# app/api/matching.py
from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func, and_
from datetime import datetime, timedelta
from app.db.session import get_db
from app.models.Consumers import Consumer
from app.models.EnergyRecords import EnergyRecord
from app.models.HourlyPrice import HourlyPrice
from app.models.SolarBedrijfRecord import SolarBedrijfRecord
from app.models.Suppliers import Supplier, SupplierRecord
from app.models.WindTurbineRecord import WindTurbineRecord
from typing import List

router = APIRouter()

class EnergySourceBreakdown:
    def __init__(self):
        self.wind_kwh = 0.0
        self.solar_kwh = 0.0
        self.wind_percentage = 0.0
        self.solar_percentage = 0.0

class TopSupplier:
    def __init__(self, supplier_id: int, name: str, kwh: float):
        self.supplier_id = supplier_id
        self.name = name
        self.kwh = kwh

class MatchingSummary:
    def __init__(self):
        self.consumer_id = 0
        self.total_kwh_received = 0.0
        self.money_saved_curos = 0.0
        self.energy_sources = EnergySourceBreakdown()
        self.top_solar_suppliers: List[TopSupplier] = []

@router.get("/matching/weekly/{consumer_id}", response_model=dict)
async def get_energy_matching(
    consumer_id: int,
    db: Session = Depends(get_db)
):
    """
    Calculate optimal energy matching for a specific consumer
    Returns distributed energy from solar suppliers (15% of excess) and wind turbine (1% of excess)
    """
    try:
        # check bestaan consument
        consumer = db.query(Consumer).filter(Consumer.id == consumer_id).first()
        if not consumer:
            raise HTTPException(status_code=404, detail="Consumer not found")

        # Laatste 24 uur voor berekening
        end_time = datetime.now() - timedelta(days=365)
        start_time = end_time - timedelta(hours=168)

        # consuments consumptie berekenen
        consumer_usage = db.query(
            func.sum(EnergyRecord.energy_kwh).label('total_usage')
        ).filter(
            and_(
                EnergyRecord.consumer_id == consumer_id,
                EnergyRecord.timestamp >= start_time,
                EnergyRecord.timestamp <= end_time
            )
        ).scalar() or 0.0

        # alle overige opgewekte zonenergie
        total_solar_excess = db.query(
            func.abs(func.sum(SupplierRecord.energy_kwh)).label('total_excess')
        ).filter(
            and_(
                SupplierRecord.timestamp >= start_time,
                SupplierRecord.timestamp <= end_time
            )
        ).scalar() or 0.0

        # windmolen overige energie
        wind_excess = db.query(
            func.abs(func.sum(WindTurbineRecord.wind_kwh)).label('wind_excess')
        ).filter(
            and_(
                WindTurbineRecord.timestamp >= start_time,
                WindTurbineRecord.timestamp <= end_time
            )
        ).scalar() or 0.0

        # bereken gebruikte energie
        # Solar: 15% van totaal, verdeelt in verhouding tot totale verbruik
        total_consumption_all = db.query(
            func.sum(EnergyRecord.energy_kwh).label('total_consumption')
        ).filter(
            and_(
                EnergyRecord.timestamp >= start_time,
                EnergyRecord.timestamp <= end_time
            )
        ).scalar() or 1.0

        # hoeveel van totaal
        consumption_share = consumer_usage / total_consumption_all if total_consumption_all > 0 else 0

        # hoeveelheid zonneenergie consument eerlijk verdient
        distributed_solar = (total_solar_excess * 0.15) * consumption_share

        # Verdeelde wind energie voor deze consument (1% totale wind)
        distributed_wind = (wind_excess * 0.01) * consumption_share

        # Bereken totale energie ontvangen
        total_received = distributed_solar + distributed_wind

        money_saved = total_received * 0.11

        # Get top donateurs
        top_suppliers = get_top_solar_suppliers(db, start_time, end_time, distributed_solar, total_solar_excess)

        # Build response
        summary = build_response(
            consumer_id, 
            total_received, 
            money_saved, 
            distributed_wind, 
            distributed_solar, 
            top_suppliers
        )

        return summary

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error calculating energy matching: {str(e)}")

def get_top_solar_suppliers(db: Session, start_time: datetime, end_time: datetime, 
                           distributed_solar: float, total_solar_excess: float) -> List[TopSupplier]:
    """Get top solar suppliers based on their excess energy contribution"""
    if total_solar_excess <= 0:
        return []

    # Get all suppliers with their excess energy
    supplier_contributions = db.query(
        Supplier.id,
        Supplier.name,
        func.sum(SupplierRecord.energy_kwh).label('total_excess')
    ).join(
        SupplierRecord, Supplier.id == SupplierRecord.supplier_id
    ).filter(
        and_(
            SupplierRecord.timestamp >= start_time,
            SupplierRecord.timestamp <= end_time
        )
    ).group_by(Supplier.id, Supplier.name).all()

    # Calculate each supplier's share of the distributed energy to this consumer
    top_suppliers = []
    for supplier_id, name, supplier_excess in supplier_contributions:
        supplier_share = supplier_excess / total_solar_excess
        distributed_to_consumer = distributed_solar * supplier_share
        
        top_suppliers.append(TopSupplier(
            supplier_id=supplier_id,
            name=name,
            kwh=round(distributed_to_consumer, 2)
        ))

    # Sort by contribution and take top 2
    top_suppliers.sort(key=lambda x: x.kwh, reverse=True)
    return top_suppliers

def build_response(consumer_id: int, total_received: float, money_saved: float,
                  wind_kwh: float, solar_kwh: float, top_suppliers: List[TopSupplier]) -> dict:
    """Build the final response in the required format"""
    
    total_energy = wind_kwh + solar_kwh
    if total_energy > 0:
        wind_percentage = round((wind_kwh / total_energy) * 100, 1)
        solar_percentage = round((solar_kwh / total_energy) * 100, 1)
    else:
        wind_percentage = 0.0
        solar_percentage = 0.0

    # Convert top suppliers to dict format
    top_suppliers_dict = [
        {
            "supplier_id": supplier.supplier_id,
            "name": supplier.name,
            "kwh": supplier.kwh
        }
        for supplier in top_suppliers
    ]

    return {
        "consumer_id": consumer_id,
        "total_kwh_received": round(total_received, 2),
        "money_saved_euro": round(money_saved, 2),
        "energy_sources": {
            "wind_kwh": round(wind_kwh, 2),
            "solar_kwh": round(solar_kwh, 2),
            "wind_percentage": wind_percentage,
            "solar_percentage": solar_percentage
        },
        "top_solar_suppliers": top_suppliers_dict
    }


class AnnualMatch:
    def __init__(self):
        self.consumer_id = 0
        self.total_kwh_received = 0.0
        self.money_saved_curos = 0.0
        self.energy_sources = {
            "wind_kwh": 0.0,
            "solar_kwh": 0.0,
            "wind_percentage": 0.0,
            "solar_percentage": 0.0
        }
        self.assigned_solar_suppliers = []  # Fixed for the year
        self.wind_contribution = 0.0


@router.get("/matching/yearly/{consumer_id}", response_model=dict)
async def get_annual_matching(
    consumer_id: int,
    db: Session = Depends(get_db)
):
    """
    Calculate annual energy matching that stays fixed for 1 year
    Uses full 2024 historical data to create stable matches
    """
    try:
        consumer = db.query(Consumer).filter(Consumer.id == consumer_id).first()
        if not consumer:
            raise HTTPException(status_code=404, detail="Consumer not found")

        start_2024 = datetime(2024, 1, 1)
        end_2024 = datetime(2024, 12, 31, 23, 59, 59)

        # Get consumer's annual consumption pattern
        consumer_annual_usage = db.query(
            func.sum(EnergyRecord.energy_kwh).label('annual_usage')
        ).filter(
            and_(
                EnergyRecord.consumer_id == consumer_id,
                EnergyRecord.timestamp >= start_2024,
                EnergyRecord.timestamp <= end_2024
            )
        ).scalar() or 0.0

        suppliers_data = get_suppliers_annual_data(db, start_2024, end_2024)
        
        # Get wind turbine annual excess
        wind_annual_excess = db.query(
            func.abs(func.sum(WindTurbineRecord.wind_kwh)).label('wind_excess')
        ).filter(
            and_(
                WindTurbineRecord.timestamp >= start_2024,
                WindTurbineRecord.timestamp <= end_2024
            )
        ).scalar() or 0.0

        # Create optimal annual matches
        assigned_suppliers = assign_annual_suppliers(
            consumer_id, 
            consumer_annual_usage, 
            suppliers_data, 
            db, 
            start_2024, 
            end_2024
        )

        annual_wind_kwh = wind_annual_excess * 0.01

        annual_solar_kwh = sum([supplier['annual_kwh'] for supplier in assigned_suppliers])

        total_received = annual_solar_kwh + annual_wind_kwh
        money_saved = total_received * 0.11

        # Build response
        return build_annual_response(
            consumer_id, 
            total_received, 
            money_saved, 
            annual_wind_kwh, 
            annual_solar_kwh, 
            assigned_suppliers
        )

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error calculating annual matching: {str(e)}")

def get_suppliers_annual_data(db: Session, start_time: datetime, end_time: datetime):
    """Get all suppliers with their annual excess energy and temporal patterns"""
    suppliers = db.query(
        Supplier.id,
        Supplier.name,
        func.sum(SupplierRecord.energy_kwh).label('annual_excess'),
    ).join(
        SupplierRecord, Supplier.id == SupplierRecord.supplier_id
    ).filter(
        and_(
            SupplierRecord.timestamp >= start_time,
            SupplierRecord.timestamp <= end_time
        )
    ).group_by(Supplier.id, Supplier.name).all()

    return [
        {
            'supplier_id': s.id,
            'name': s.name,
            'annual_excess': s.annual_excess,
            'available_kwh': s.annual_excess * 0.15
        }
        for s in suppliers
    ]

def assign_annual_suppliers(consumer_id, consumer_usage, suppliers_data, db, start_time, end_time):
    """
    Fair distribution: Each supplier's 15% donation is split across multiple consumers
    based on their usage share
    """
    assigned = []
    
    # Calculate this consumer's usage share
    total_consumption_all = get_total_consumption(db, start_time, end_time)
    consumer_share = consumer_usage / total_consumption_all if total_consumption_all > 0 else 0
    
    # Each consumer gets a portion of EVERY supplier's donation based on their usage share
    for supplier in suppliers_data:
        if supplier['available_kwh'] > 0 and consumer_share > 0:
            allocated_kwh = supplier['available_kwh'] * consumer_share
            
            assigned.append({
                "supplier_id": supplier['supplier_id'],
                "name": supplier['name'],
                "annual_kwh": allocated_kwh
            })
    
    # Sort by contribution and take top 2 for display (but all contribute)
    assigned.sort(key=lambda x: x['annual_kwh'], reverse=True)
    return assigned[:2]  # Only show top 2, but all suppliers actually contribute

def get_total_consumption(db, start_time, end_time):
    """Get total energy consumption across all consumers"""
    return db.query(
        func.sum(EnergyRecord.energy_kwh).label('total_consumption')
    ).filter(
        and_(
            EnergyRecord.timestamp >= start_time,
            EnergyRecord.timestamp <= end_time
        )
    ).scalar() or 1.0


def build_annual_response(consumer_id, total_received, money_saved, wind_kwh, solar_kwh, assigned_suppliers):
    """Build the annual matching response"""
    total_energy = wind_kwh + solar_kwh
    if total_energy > 0:
        wind_percentage = round((wind_kwh / total_energy) * 100, 1)
        solar_percentage = round((solar_kwh / total_energy) * 100, 1)
    else:
        wind_percentage = 0.0
        solar_percentage = 0.0

    return {
        "consumer_id": consumer_id,
        "total_kwh_received": round(total_received, 2),
        "money_saved_euro": round(money_saved, 2),
        "energy_sources": {
            "wind_kwh": round(wind_kwh, 2),
            "solar_kwh": round(solar_kwh, 2),
            "wind_percentage": wind_percentage,
            "solar_percentage": solar_percentage
        },
        "solar_suppliers": [
            {
                "supplier_id": s['supplier_id'],
                "name": s['name'],
                "kwh": round(s['annual_kwh'], 2)
            }
            for s in assigned_suppliers
        ]
    }