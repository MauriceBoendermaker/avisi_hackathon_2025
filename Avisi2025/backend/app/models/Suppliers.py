from sqlalchemy import Column, Integer, String, Float, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from app.db.session import Base

class Supplier(Base):
    __tablename__ = "suppliers"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(50), nullable=False, unique=True)

    records = relationship("SupplierRecord", back_populates="supplier")


class SupplierRecord(Base):
    __tablename__ = "supplier_records"

    id = Column(Integer, primary_key=True, index=True)
    timestamp = Column(DateTime, nullable=False, index=True)
    supplier_id = Column(Integer, ForeignKey("suppliers.id"), nullable=False)
    energy_kwh = Column(Float, nullable=False)

    supplier = relationship("Supplier", back_populates="records")