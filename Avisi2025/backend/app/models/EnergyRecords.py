from sqlalchemy import Column, Integer, Float, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from app.db.session import Base


class EnergyRecord(Base):
    __tablename__ = "energy_records"
    id = Column(Integer, primary_key=True)
    timestamp = Column(DateTime, index=True, nullable=False)
    consumer_id = Column(Integer, ForeignKey("consumers.id"), nullable=False)
    energy_kwh = Column(Float, nullable=False)
