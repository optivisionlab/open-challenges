from fastapi import APIRouter
from app.api.v1.endpoints import auth

# Create API router
router = APIRouter()


# Include endpoint routers
router.include_router(auth.router)


@router.get("/health")
async def health_check():
    """Health check endpoint."""
    return {"status": "ok", "service": "open-challenges-api"}
