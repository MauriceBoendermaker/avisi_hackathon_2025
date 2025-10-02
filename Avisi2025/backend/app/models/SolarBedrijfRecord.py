from sqlalchemy import Column, Integer, Float, DateTime
from app.db.session import Base

class SolarBedrijfRecord(Base):
    __tablename__ = "solar_bedrijf_records"

    id = Column(Integer, primary_key=True, index=True)
    timestamp = Column(DateTime, nullable=False, index=True)
    solar_bedrijf_kwh = Column(Float, nullable=False)