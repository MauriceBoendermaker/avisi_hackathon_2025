from fastapi import FastAPI
from app.api import verbruik


app = FastAPI(title="My FastAPI Backend")

# Include routers
app.include_router(verbruik.router, prefix="/api/v1", tags=["verbruik"])