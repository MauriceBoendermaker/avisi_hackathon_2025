from fastapi import FastAPI, Depends
from sqlalchemy.orm import Session
from app.db.session import SessionLocal
from app.models.EnergyRecords import EnergyRecord
from app.models.WindTurbineRecord import WindTurbineRecord
from app.models.SolarBedrijfRecord import SolarBedrijfRecord
from app.models.HourlyPrice import HourlyPrice
from app.api import verbruik  # <- adjust path if needed

app = FastAPI()

# Dependency to get DB session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

app.include_router(verbruik.router, prefix="/api")