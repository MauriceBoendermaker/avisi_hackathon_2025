from sqlalchemy import Column, Integer, Float, DateTime
from app.db.session import Base

class HourlyPrice(Base):
    __tablename__ = "hourly_prices"
    
    id = Column(Integer, primary_key=True, index=True)
    timestamp = Column(DateTime, nullable=False, index=True)
    price = Column(Float, nullable=False)