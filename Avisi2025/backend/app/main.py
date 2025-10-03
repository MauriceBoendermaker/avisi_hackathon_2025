from fastapi import FastAPI
from app.api import verbruik
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="My FastAPI Backend")

# Include routers
app.include_router(verbruik.router, prefix="/api/v1", tags=["verbruik"])

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

