"""CRUD operations for Submission model."""
from sqlalchemy.orm import Session
from sqlalchemy import select
from app.models.base import Submission
import uuid


class SubmissionCRUD:
    """Submission CRUD operations."""

    @staticmethod
    def create_submission(
        db: Session,
        challenge_id: str,
        user_id: str,
        file_url: str,
        score: float = 0.0,
        team_id: str = None
    ) -> Submission:
        """Create a new submission."""
        submission = Submission(
            id=str(uuid.uuid4()),
            challenge_id=challenge_id,
            user_id=user_id,
            submission_file_id=file_url,
            team_id=team_id,
            score=score,
            is_valid=True
        )
        db.add(submission)
        db.commit()
        db.refresh(submission)
        return submission

    @staticmethod
    def get_submission_by_id(db: Session, submission_id: str) -> Submission | None:
        """Get submission by ID."""
        query = select(Submission).where(Submission.id == submission_id)
        return db.scalars(query).first()

    @staticmethod
    def update_submission(db: Session, submission_id: str, **kwargs) -> Submission | None:
        """Update submission fields."""
        submission = SubmissionCRUD.get_submission_by_id(db, submission_id)
        if not submission:
            return None

        allowed_fields = {"score", "is_valid"}
        for key, value in kwargs.items():
            if key in allowed_fields and value is not None:
                setattr(submission, key, value)

        db.commit()
        db.refresh(submission)
        return submission

    @staticmethod
    def delete_submission(db: Session, submission_id: str) -> bool:
        """Delete a submission by ID."""
        submission = SubmissionCRUD.get_submission_by_id(db, submission_id)
        if not submission:
            return False
        db.delete(submission)
        db.commit()
        return True