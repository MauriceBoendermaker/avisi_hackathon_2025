from sqlalchemy import Column, Integer
from app.db.session import Base

class Consumer(Base):
    __tablename__ = "consumers"
    id = Column(Integer, primary_key=True)