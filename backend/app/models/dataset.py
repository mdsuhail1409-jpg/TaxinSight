from datetime import datetime
from sqlalchemy import Column, Integer, String, DateTime, Text
from app.database.session import Base


class DatasetMetadata(Base):
    __tablename__ = "datasets_metadata"

    id = Column(String(36), primary_key=True, index=True)
    filename = Column(String(255), nullable=False)
    file_type = Column(String(10), nullable=False)
    file_size_bytes = Column(Integer, nullable=False)
    uploaded_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    status = Column(String(20), default="uploaded", nullable=False)
    record_count = Column(Integer, nullable=True)
    description = Column(Text, nullable=True)
    validation_log = Column(Text, nullable=True)
