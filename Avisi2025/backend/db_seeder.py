import csv
from datetime import datetime
from sqlalchemy.orm import Session

from app.db.session import SessionLocal
from app.models.Consumers import Consumer
from app.models.EnergyRecords import EnergyRecord
from app.models.WindTurbineRecord import WindTurbineRecord
from app.models.HourlyPrice import HourlyPrice
from app.models.SolarBedrijfRecord import SolarBedrijfRecord
from app.models.Suppliers import Supplier, SupplierRecord


# Path to CSV relative to this script
CSV_FILE = "backend/data/100_consument_verbruik_profielen.csv"
CSV_FILE_W = "backend/data/2MW_windmolen_teruglevering.csv"
CSV_FILE_P = "backend/data/DummyPrices_hourly.csv"
CSV_FILE_Z = "backend/data/bedrijf_zon_op_dak_teruglevering.csv"
CSV_FILE_S = "backend/data/150_consument_teruglevering.csv"


def populate_consumers(db):
    print("Inserting consumers...")
    db.bulk_save_objects([Consumer(id=i) for i in range(1, 101)])
    db.commit()
    print("Consumers inserted.")

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


def seed_suppliers_csv(db: Session, csv_path: str, batch_size: int = 100):
    """
    Seeds supplier data from a CSV with the format:
    timestamp,opwek_1,opwek_2,...,opwek_N

    Args:
        db: SQLAlchemy session
        csv_path: Path to the CSV file
        batch_size: Number of records to insert per commit
    """

    with open(csv_path, newline="") as csvfile:
        reader = csv.reader(csvfile)
        headers = next(reader)
        supplier_names = headers[1:]

        # Check existing suppliers
        existing_suppliers = {s.name: s for s in db.query(Supplier).all()}
        suppliers = {}
        for name in supplier_names:
            if name not in existing_suppliers:
                s = Supplier(name=name)
                db.add(s)
                suppliers[name] = s
            else:
                suppliers[name] = existing_suppliers[name]
        db.commit()

    batch = []
    row_count = 0
    with open(csv_path, newline="") as csvfile:
        reader = csv.DictReader(csvfile)
        for row in reader:
            timestamp = datetime.strptime(row["timestamp"], "%Y-%m-%d %H:%M:%S")
            for name in supplier_names:
                energy_kwh = float(row[name])
                record = SupplierRecord(
                    timestamp=timestamp,
                    supplier_id=suppliers[name].id,
                    energy_kwh=energy_kwh
                )
                batch.append(record)

            row_count += 1
            if len(batch) >= batch_size:
                db.bulk_save_objects(batch)
                db.commit()
                batch = []
                print(f"Inserted {row_count} timestamps so far...")

        if batch:
            db.bulk_save_objects(batch)
            db.commit()


def seed_single_value_csv(db: Session, csv_path: str, model, value_column: str, batch_size: int = 500):
    """
    Generic loader for CSVs with a timestamp and one numeric value column.
    
    Args:
        db: SQLAlchemy Session
        csv_path: Path to the CSV file
        model: SQLAlchemy model class
        value_column: Name of the numeric column in CSV
        batch_size: Number of rows to insert per commit
    """
    batch = []

    with open(csv_path, newline="") as csvfile:
        reader = csv.DictReader(csvfile)
        row_count = 0
        for row in reader:
            timestamp = datetime.strptime(row["timestamp"], "%Y-%m-%d %H:%M:%S")
            value = float(row[value_column])
            obj = model(timestamp=timestamp, **{value_column: value})
            batch.append(obj)
            row_count += 1

            if len(batch) >= batch_size:
                db.bulk_save_objects(batch)
                db.commit()
                batch = []
                print(f"  Inserted {row_count} rows so far...")

        # commit leftover
        if batch:
            db.bulk_save_objects(batch)
            db.commit()

def main():
    db = SessionLocal()
    try:
        """
        populate_energy_records(db)
        seed_single_value_csv(db, CSV_FILE_W, WindTurbineRecord, "wind_kwh")
        seed_single_value_csv(db, CSV_FILE_P, HourlyPrice, "price")
        seed_single_value_csv(db, CSV_FILE_Z, SolarBedrijfRecord, "solar_bedrijf_kwh")
        """
        seed_suppliers_csv(db, CSV_FILE_S)
    finally:
        db.close()

if __name__ == "__main__":
    main()