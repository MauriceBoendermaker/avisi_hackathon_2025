from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.models.EnergyRecords import EnergyRecord

router = APIRouter()

@router.get("/api/totaal/allepersonen")
def totaal_allepersonen(db: Session = Depends(get_db)):
    try:
        total = db.query(EnergyRecord.energy_kwh).all() 
        total_kwh = sum(row[0] for row in total)  
        return {"totaal_verbruik_kwh": round(total_kwh, 2)}
    except Exception as e:
        return {"error": str(e)} 


@router.get("/api/totaal/{consumerId}")
def totaal_1persoon(consumerId, db: Session = Depends(get_db)):
    try:
        total = db.query(EnergyRecord.energy_kwh).filter(EnergyRecord.consumer_id==consumerId)
        total_kwh = sum(row[0] for row in total)
        return {"totaal_verbruik_kwh": round(total_kwh, 2)}
    except Exception as e:
        return {"error": str(e)}
