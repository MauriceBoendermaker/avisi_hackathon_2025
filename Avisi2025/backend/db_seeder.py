import csv
from datetime import datetime
from app.db.session import SessionLocal
from app.models.Consumers import Consumer
from app.models.EnergyRecords import EnergyRecord

# Path to CSV relative to this script
CSV_FILE = "backend/data/100_consument_verbruik_profielen.csv"
"""
def populate_consumers(db):
    print("Inserting consumers...")
    db.bulk_save_objects([Consumer(id=i) for i in range(1, 101)])
    db.commit()
    print("Consumers inserted.")
"""
def populate_energy_records(db):
    print("Inserting energy records...")
    batch = []
    batch_size = 100  # adjust for memory/performance
    with open(CSV_FILE, newline="") as csvfile:
        reader = csv.reader(csvfile)
        headers = next(reader)  # skip header: timestamp,1,2,3,...

        for row_idx, row in enumerate(reader, start=1):
            ts = datetime.strptime(row[0], "%Y-%m-%d %H:%M:%S")
            for i, consumption_str in enumerate(row[1:], start=1):
                batch.append(EnergyRecord(
                    timestamp=ts,
                    consumer_id=i,
                    energy_kwh=float(consumption_str)
                ))
            # bulk insert in batches
            if len(batch) >= batch_size:
                db.bulk_save_objects(batch)
                db.commit()
                batch.clear()
            if row_idx % 1000 == 0:
                print(f"Processed {row_idx} timestamps...")

    # insert remaining records
    if batch:
        db.bulk_save_objects(batch)
        db.commit()
    print("Energy records inserted.")

def main():
    db = SessionLocal()
    try:
        populate_energy_records(db)
    finally:
        db.close()

if __name__ == "__main__":
    main()