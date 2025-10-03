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


def optimize_supplier_allocations(suppliers_data, db: Session = Depends(get_db)):
    """
    Optimize supplier allocations to maximize total savings across all consumers
    Formula: total_savings = sum(kwh_received * 0.11 - 100) for all participating consumers
    """

    consumers_data = db.query(EnergyRecord).all()
    consumers_with_potential = []
    for consumer in consumers_data:
        # Minimum energy voor break even: 100 € / 0.11 €/kwh = 909.09 kwh
        min_energy_to_break_even = 100 / 0.11
        consumers_with_potential.append({
            'consumer_id': consumer['id'],
            'annual_usage': consumer['annual_usage'],
            'min_energy_needed': min_energy_to_break_even,
            'potential_savings': 0
        })
    
    # Sort consumers by usage (higher usage consumers can benefit more)
    consumers_with_potential.sort(key=lambda x: x['annual_usage'], reverse=True)
    
    # Available donation pool from suppliers
    available_donations = {s['supplier_id']: s['available_kwh'] for s in suppliers_data}
    
    # Optimization: allocate to consumers who can achieve savings
    allocations = {}
    total_donated = 0
    
    for consumer in consumers_with_potential:
        consumer_id = consumer['consumer_id']
        allocations[consumer_id] = []
        remaining_need = consumer['min_energy_needed']
        
        # Try to allocate enough energy to make it worthwhile for this consumer
        for supplier in suppliers_data:
            if available_donations[supplier['supplier_id']] > 0 and remaining_need > 0:
                # Allocate as much as possible from this supplier
                allocate_amount = min(available_donations[supplier['supplier_id']], remaining_need)
                
                allocations[consumer_id].append({
                    'supplier_id': supplier['supplier_id'],
                    'name': supplier['name'],
                    'kwh': allocate_amount
                })
                
                available_donations[supplier['supplier_id']] -= allocate_amount
                remaining_need -= allocate_amount
                total_donated += allocate_amount
        
        # If we couldn't allocate enough to break even, remove this consumer
        if remaining_need > 0:
            # Re-allocate this energy to other consumers
            for allocation in allocations[consumer_id]:
                available_donations[allocation['supplier_id']] += allocation['kwh']
                total_donated -= allocation['kwh']
            allocations[consumer_id] = []
    
    # Second pass: distribute remaining energy to maximize savings
    remaining_energy = sum(available_donations.values())
    if remaining_energy > 0:
        # Distribute to consumers who already broke even (marginal benefit = 0.11 €/kwh)
        active_consumers = [c for c in consumers_with_potential if allocations[c['consumer_id']]]
        
        for consumer in active_consumers:
            consumer_id = consumer['consumer_id']
            for supplier in suppliers_data:
                if available_donations[supplier['supplier_id']] > 0:
                    allocate_amount = available_donations[supplier['supplier_id']]
                    
                    allocations[consumer_id].append({
                        'supplier_id': supplier['supplier_id'],
                        'name': supplier['name'], 
                        'kwh': allocate_amount
                    })
                    
                    available_donations[supplier['supplier_id']] = 0
                    break
    
    return allocations

def calculate_total_savings(allocations):
    """Calculate total savings across all consumers"""
    total_savings = 0
    for consumer_id, supplier_allocations in allocations.items():
        if supplier_allocations:  # Only consumers with allocations
            total_received = sum(allocation['kwh'] for allocation in supplier_allocations)
            savings = (total_received * 0.11) - 100
            total_savings += savings
    return total_savings