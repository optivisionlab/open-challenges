"""Submission endpoints."""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.schemas.base import SubmissionCreate, SubmissionResponse, SubmissionDetailResponse
from app.crud.submission import SubmissionCRUD
from app.utils.db import get_db
import logging

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/submissions", tags=["submissions"])


@router.post(
    "",
    response_model=SubmissionResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Create a new submission"
)
async def create_submission(
    submission_data: SubmissionCreate,
    db: Session = Depends(get_db)
):
    """Create a new submission."""
    try:
        submission = SubmissionCRUD.create_submission(
            db=db,
            challenge_id=submission_data.challenge_id,
            user_id=submission_data.user_id,
            file_url=submission_data.submission_file_id,
            team_id=submission_data.team_id
        )
        return submission
    except Exception as e:
        logger.error(f"Error creating submission: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )


@router.get(
    "/{submission_id}",
    response_model=SubmissionDetailResponse,
    summary="Get a submission by ID"
)
async def get_submission(
    submission_id: str,
    db: Session = Depends(get_db)
):
    """Get a submission by ID."""
    submission = SubmissionCRUD.get_submission_by_id(db, submission_id)
    if not submission:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Submission not found"
        )
    return submission


@router.put(
    "/{submission_id}",
    response_model=SubmissionResponse,
    summary="Update a submission"
)
async def update_submission(
    submission_id: str,
    submission_data: dict,
    db: Session = Depends(get_db)
):
    """Update a submission."""
    submission = SubmissionCRUD.get_submission_by_id(db, submission_id)
    if not submission:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Submission not found"
        )
    
    try:
        updated_submission = SubmissionCRUD.update_submission(db, submission_id, **submission_data)
        return updated_submission
    except Exception as e:
        logger.error(f"Error updating submission: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )


@router.delete(
    "/{submission_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Delete a submission"
)
async def delete_submission(
    submission_id: str,
    db: Session = Depends(get_db)
):
    """Delete a submission."""
    submission = SubmissionCRUD.get_submission_by_id(db, submission_id)
    if not submission:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Submission not found"
        )
    
    try:
        SubmissionCRUD.delete_submission(db, submission_id)
    except Exception as e:
        logger.error(f"Error deleting submission: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )
