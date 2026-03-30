"""CRUD operations for Challenge model."""
from sqlalchemy.orm import Session
from sqlalchemy import select
from app.models.base import Challenge
import uuid


class ChallengeCRUD:
    """Challenge CRUD operations."""

    @staticmethod
    def create_challenge(
        db: Session,
        title: str,
        description: str,
        problem_statement: str,
        difficulty_level,
        start_date,
        end_date,
        created_by: str,
        prize_pool: float = None,
        image_url: str = None,
        dataset_url: str = None
    ) -> Challenge:
        """Create a new challenge."""
        challenge = Challenge(
            id=str(uuid.uuid4()),
            title=title,
            description=description,
            problem_statement=problem_statement,
            difficulty_level=difficulty_level,
            start_date=start_date,
            end_date=end_date,
            created_by=created_by,
            prize_pool=prize_pool,
            image_url=image_url,
            dataset_url=dataset_url
        )
        db.add(challenge)
        db.commit()
        db.refresh(challenge)
        return challenge

    @staticmethod
    def get_challenge_by_id(db: Session, challenge_id: str) -> Challenge | None:
        """Get challenge by ID."""
        query = select(Challenge).where(Challenge.id == challenge_id)
        return db.scalars(query).first()

    @staticmethod
    def update_challenge(db: Session, challenge_id: str, **kwargs) -> Challenge | None:
        """Update challenge fields."""
        challenge = ChallengeCRUD.get_challenge_by_id(db, challenge_id)
        if not challenge:
            return None

        allowed_fields = {"title", "description", "is_active", "status", "difficulty_level", "start_date", "end_date"}
        for key, value in kwargs.items():
            if key in allowed_fields and value is not None:
                setattr(challenge, key, value)

        db.commit()
        db.refresh(challenge)
        return challenge

    @staticmethod
    def delete_challenge(db: Session, challenge_id: str) -> bool:
        """Delete a challenge by ID."""
        challenge = ChallengeCRUD.get_challenge_by_id(db, challenge_id)
        if not challenge:
            return False
        db.delete(challenge)
        db.commit()
        return True