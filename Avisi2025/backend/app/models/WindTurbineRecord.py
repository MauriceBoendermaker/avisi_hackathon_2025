# app/models.py (or app/models/wind.py)
from sqlalchemy import Column, Integer, Float, DateTime
from app.db.session import Base

class WindTurbineRecord(Base):
    __tablename__ = "wind_turbine_records"

    id = Column(Integer, primary_key=True, index=True)
    timestamp = Column(DateTime, nullable=False, index=True)
    wind_kwh = Column(Float, nullable=False)