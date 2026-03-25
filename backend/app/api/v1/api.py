from fastapi import APIRouter

# Create API router
router = APIRouter()


@router.get("/health")
async def health_check():
    """Health check endpoint."""
    return {"status": "ok", "service": "open-challenges-api"}
