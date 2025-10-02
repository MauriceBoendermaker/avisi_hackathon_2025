from fastapi import FastAPI, Depends
from sqlalchemy.orm import Session
from app.db.session import SessionLocal
from app.models.EnergyRecords import EnergyRecord
from app.models.WindTurbineRecord import WindTurbineRecord
from app.models.SolarBedrijfRecord import SolarBedrijfRecord
from app.models.HourlyPrice import HourlyPrice

app = FastAPI()

# Dependency to get DB session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# 1. Total consumption (kWh) from EnergyRecord
@app.get("/api/totaal/verbruik")
def totaal_verbruik(db: Session = Depends(get_db)):
    total = db.query(EnergyRecord).with_entities(
        EnergyRecord.energy_kwh
    ).all()
    total_kwh = sum(row[0] for row in total)
    return {"totaal_verbruik_kwh": round(total_kwh, 2)}

# 2. Total donated/received (kWh) from WindTurbine + Solar
@app.get("/api/totaal/ontvangen")
def totaal_ontvangen(db: Session = Depends(get_db)):
    wind_total = db.query(WindTurbineRecord).with_entities(
        WindTurbineRecord.wind_kwh
    ).all()
    solar_total = db.query(SolarBedrijfRecord).with_entities(
        SolarBedrijfRecord.solar_bedrijf_kwh
    ).all()

    total_kwh = sum(row[0] for row in wind_total) + sum(row[0] for row in solar_total)
    return {"totaal_ontvangen_kwh": round(total_kwh, 2)}

# 3. Total € saved = SUM(energy_kwh * price) based on timestamp
@app.get("/api/totaal/bespaard")
def totaal_bespaard(db: Session = Depends(get_db)):
    # Join EnergyRecord and HourlyPrice on timestamp
    joined = db.query(EnergyRecord.energy_kwh, HourlyPrice.price).join(
        HourlyPrice, EnergyRecord.timestamp == HourlyPrice.timestamp
    ).all()

    total_euro = sum(kwh * price for kwh, price in joined)
    return {"totaal_bespaard_euro": round(total_euro, 2)}

