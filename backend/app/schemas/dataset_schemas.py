from typing import List, Optional, Any, Dict
from pydantic import BaseModel
from datetime import datetime


class DatasetItem(BaseModel):
    id: str
    filename: str
    file_type: str
    file_size_bytes: int
    status: str
    record_count: Optional[int] = None
    description: Optional[str] = None
    uploaded_at: datetime


class DatasetPreviewData(BaseModel):
    id: str
    columns: List[str]
    total_rows: int
    preview_rows: List[Dict[str, Any]]


class DatasetProcessResult(BaseModel):
    id: str
    status: str
    records_ingested: int
    warnings: List[str]

