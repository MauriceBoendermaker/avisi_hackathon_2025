from fastapi import APIRouter

router = APIRouter()

@router.get("/verbruik")
def verbruik():
    return {"message": "alle verbruik"}