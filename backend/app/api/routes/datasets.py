from fastapi import APIRouter, Depends, UploadFile, File, Form
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.schemas.tax_schemas import APIResponse
from app.services.dataset_service import (
    save_upload_file,
    list_datasets,
    preview_dataset,
    process_dataset,
)

router = APIRouter(prefix="/datasets", tags=["Datasets"])


@router.post("/upload", response_model=APIResponse, status_code=201)
def upload_dataset(
    file: UploadFile = File(...),
    description: str = Form(None),
    db: Session = Depends(get_db)
):
    meta = save_upload_file(file=file, description=description, db=db)
    return APIResponse(
        data={
            "id": meta.id,
            "filename": meta.filename,
            "file_type": meta.file_type,
            "file_size_bytes": meta.file_size_bytes,
            "status": meta.status,
            "uploaded_at": meta.uploaded_at.isoformat(),
        },
        message="Dataset uploaded successfully."
    )


@router.get("", response_model=APIResponse)
def get_datasets(db: Session = Depends(get_db)):
    datasets = list_datasets(db=db)
    res = [
        {
            "id": d.id,
            "filename": d.filename,
            "file_type": d.file_type,
            "file_size_bytes": d.file_size_bytes,
            "status": d.status,
            "record_count": d.record_count,
            "description": d.description,
            "uploaded_at": d.uploaded_at.isoformat(),
        }
        for d in datasets
    ]
    return APIResponse(data=res)


@router.get("/{dataset_id}/preview", response_model=APIResponse)
def get_dataset_preview(dataset_id: str, db: Session = Depends(get_db)):
    preview_data = preview_dataset(dataset_id=dataset_id, db=db)
    return APIResponse(data=preview_data)


@router.post("/{dataset_id}/process", response_model=APIResponse)
def process_uploaded_dataset(dataset_id: str, db: Session = Depends(get_db)):
    result = process_dataset(dataset_id=dataset_id, db=db)
    return APIResponse(data=result, message="Dataset processed successfully.")
