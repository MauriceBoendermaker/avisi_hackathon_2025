from fastapi import FastAPI
from app.api import verbruik
from app.api.matching import router as matching_router 

app = FastAPI(title="My FastAPI Backend")

# Include routers
app.include_router(verbruik.router, prefix="/api/v1", tags=["verbruik"])
app.include_router(matching_router, prefix="/api/consumer", tags=["matching"])