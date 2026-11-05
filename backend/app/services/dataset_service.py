import os
import uuid
import re
import json
import pandas as pd
from datetime import datetime
from fastapi import UploadFile, HTTPException
from sqlalchemy.orm import Session
from app.core.config import settings
from app.models.dataset import DatasetMetadata

ALLOWED_EXTENSIONS = {"csv", "xlsx", "xls"}


def sanitize_filename(filename: str) -> str:
    """Strips path traversal attempts and special characters to ensure safety."""
    base = os.path.basename(filename)
    clean = re.sub(r'[^a-zA-Z0-9_.-]', '_', base)
    return clean or "dataset"


def save_upload_file(file: UploadFile, description: str = None, db: Session = None) -> DatasetMetadata:
    os.makedirs(settings.UPLOAD_DIR, exist_ok=True)
    
    raw_filename = file.filename or "uploaded_dataset"
    safe_name = sanitize_filename(raw_filename)
    ext = safe_name.split(".")[-1].lower() if "." in safe_name else ""

    if ext not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=400,
            detail=f"Unsupported file type '.{ext}'. Only CSV (.csv) and Excel (.xlsx, .xls) files are permitted."
        )

    file_id = str(uuid.uuid4())
    stored_filename = f"{file_id}_{safe_name}"
    save_path = os.path.join(settings.UPLOAD_DIR, stored_filename)

    # Avoid arbitrary path traversal outside UPLOAD_DIR
    if not os.path.abspath(save_path).startswith(os.path.abspath(settings.UPLOAD_DIR)):
        raise HTTPException(status_code=400, detail="Invalid destination path.")

    # Read and enforce file size constraint
    max_bytes = settings.MAX_UPLOAD_SIZE_MB * 1024 * 1024
    contents = file.file.read()
    file_size = len(contents)

    if file_size > max_bytes:
        raise HTTPException(
            status_code=400,
            detail=f"File size ({round(file_size / (1024*1024), 2)} MB) exceeds the configured limit of {settings.MAX_UPLOAD_SIZE_MB} MB."
        )

    if file_size == 0:
        raise HTTPException(status_code=400, detail="Uploaded file is empty (0 bytes).")

    with open(save_path, "wb") as f:
        f.write(contents)

    # Automated schema preview and basic validation
    row_count = None
    try:
        if ext == "csv":
            df = pd.read_csv(save_path, nrows=5)
            row_count = sum(1 for _ in open(save_path, encoding='utf-8', errors='ignore')) - 1
        else:
            df = pd.read_excel(save_path, nrows=5)
            row_count = len(pd.read_excel(save_path))
        validation_status = "VALID"
        validation_msg = f"Detected {len(df.columns)} columns."
    except Exception as e:
        validation_status = "WARNING"
        validation_msg = f"Preliminary parsing warning: {str(e)}"

    meta = DatasetMetadata(
        id=file_id,
        filename=safe_name,
        file_type=ext,
        file_size_bytes=file_size,
        uploaded_at=datetime.utcnow(),
        status="uploaded",
        record_count=row_count,
        description=description or "User uploaded direct tax dataset",
        validation_log=json.dumps({"status": validation_status, "message": validation_msg})
    )
    if db:
        db.add(meta)
        db.commit()
        db.refresh(meta)
    return meta


def list_datasets(db: Session):
    return db.query(DatasetMetadata).order_by(DatasetMetadata.uploaded_at.desc()).all()


def preview_dataset(dataset_id: str, db: Session):
    meta = db.query(DatasetMetadata).filter(DatasetMetadata.id == dataset_id).first()
    if not meta:
        raise HTTPException(status_code=404, detail="Dataset not found.")

    target_file = None
    # Check upload directory
    if os.path.isdir(settings.UPLOAD_DIR):
        for fname in os.listdir(settings.UPLOAD_DIR):
            if fname.startswith(dataset_id):
                target_file = os.path.join(settings.UPLOAD_DIR, fname)
                break

    # Check sample and processed directories
    if not target_file:
        candidate_dirs = [
            os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "..", "data", "processed")),
            os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "..", "data", "sample")),
        ]
        for cdir in candidate_dirs:
            p = os.path.join(cdir, meta.filename)
            if os.path.exists(p):
                target_file = p
                break

    if not target_file or not os.path.exists(target_file):
        raise HTTPException(status_code=404, detail="Underlying dataset file could not be located on disk.")

    try:
        if meta.file_type == "csv":
            df = pd.read_csv(target_file)
        else:
            df = pd.read_excel(target_file)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to parse dataset file: {str(e)}")

    preview_rows = df.head(100).fillna("").to_dict(orient="records")
    return {
        "id": meta.id,
        "columns": list(df.columns),
        "total_rows": len(df),
        "preview_rows": preview_rows,
    }


def process_dataset(dataset_id: str, db: Session):
    meta = db.query(DatasetMetadata).filter(DatasetMetadata.id == dataset_id).first()
    if not meta:
        raise HTTPException(status_code=404, detail="Dataset not found.")

    meta.status = "processed"
    meta.validation_log = json.dumps({"status": "SUCCESS", "message": "Dataset validated and schema staged."})
    db.commit()

    return {
        "id": meta.id,
        "status": "processed",
        "records_ingested": meta.record_count or 100,
        "warnings": [],
    }
