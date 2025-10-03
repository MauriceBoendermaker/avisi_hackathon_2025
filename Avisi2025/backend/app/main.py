from fastapi import FastAPI
from app.api import verbruik
from app.api.matching import router as matching_router 
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# Include routers
app.include_router(verbruik.router, prefix="/api/v1", tags=["verbruik"])
app.include_router(matching_router, prefix="/api/consumer", tags=["matching"])

origins = [
    "*",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,       # or ["*"] to allow all origins (not recommended for production)
    allow_credentials=True,
    allow_methods=["*"],         # allow all HTTP methods (GET, POST, etc.)
    allow_headers=["*"],         # allow all headers
)

