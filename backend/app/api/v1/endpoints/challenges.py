"""Challenge endpoints."""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.schemas.base import ChallengeCreate, ChallengeUpdate, ChallengeResponse, ChallengeListResponse
from app.crud.challenge import ChallengeCRUD
from app.utils.db import get_db
from app.models.base import Challenge
import logging

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/challenges", tags=["challenges"])


@router.post(
    "",
    response_model=ChallengeResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Create a new challenge"
)
async def create_challenge(
    challenge_data: ChallengeCreate,
    db: Session = Depends(get_db)
):
    """Create a new challenge."""
    try:
        challenge = ChallengeCRUD.create_challenge(
            db=db,
            title=challenge_data.title,
            description=challenge_data.description,
            problem_statement=challenge_data.problem_statement,
            difficulty_level=challenge_data.difficulty_level,
            start_date=challenge_data.start_date,
            end_date=challenge_data.end_date,
            created_by="system",  # In production, get from current user
            prize_pool=challenge_data.prize_pool,
            image_url=challenge_data.image_url,
            dataset_url=challenge_data.dataset_url
        )
        return challenge
    except Exception as e:
        logger.error(f"Error creating challenge: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )


@router.get(
    "/{challenge_id}",
    response_model=ChallengeResponse,
    summary="Get a challenge by ID"
)
async def get_challenge(
    challenge_id: str,
    db: Session = Depends(get_db)
):
    """Get a challenge by ID."""
    challenge = ChallengeCRUD.get_challenge_by_id(db, challenge_id)
    if not challenge:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Challenge not found"
        )
    return challenge


@router.put(
    "/{challenge_id}",
    response_model=ChallengeResponse,
    summary="Update a challenge"
)
async def update_challenge(
    challenge_id: str,
    challenge_data: ChallengeUpdate,
    db: Session = Depends(get_db)
):
    """Update a challenge."""
    challenge = ChallengeCRUD.get_challenge_by_id(db, challenge_id)
    if not challenge:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Challenge not found"
        )
    
    try:
        update_data = challenge_data.dict(exclude_unset=True)
        updated_challenge = ChallengeCRUD.update_challenge(db, challenge_id, **update_data)
        return updated_challenge
    except Exception as e:
        logger.error(f"Error updating challenge: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )


@router.delete(
    "/{challenge_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Delete a challenge"
)
async def delete_challenge(
    challenge_id: str,
    db: Session = Depends(get_db)
):
    """Delete a challenge."""
    challenge = ChallengeCRUD.get_challenge_by_id(db, challenge_id)
    if not challenge:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Challenge not found"
        )
    
    try:
        ChallengeCRUD.delete_challenge(db, challenge_id)
    except Exception as e:
        logger.error(f"Error deleting challenge: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )
