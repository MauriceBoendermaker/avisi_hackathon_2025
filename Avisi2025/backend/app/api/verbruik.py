from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.models.EnergyRecords import EnergyRecord

router = APIRouter()

@router.get("/verbruik")
def verbruik():
    return {"message": "alle verbruik"}

@router.get("/api/totaal/verbruik")
def totaal_verbruik(db: Session = Depends(get_db)):
    """
    Returns the total consumption in kWh from the EnergyRecord table.
    """
    try:
        total = db.query(EnergyRecord.energy_kwh).filter(EnergyRecord.consumer_id==1)
        total_kwh = sum(row[0] for row in total)  # ⚠️ FIX: row is a tuple, not an object
        return {"totaal_verbruik_kwh": round(total_kwh, 2)}
    except Exception as e:
        return {"error": str(e)}  # Optional: useful for debugging
