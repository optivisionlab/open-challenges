"""CRUD operations for User model."""
from sqlalchemy.orm import Session
from sqlalchemy import select
from app.models.base import User, UserRole
from app.core.security import get_password_hash, verify_password
import uuid


class UserCRUD:
    """User CRUD operations."""
    
    @staticmethod
    def create_user(
        db: Session,
        email: str,
        username: str,
        password: str,
        full_name: str,
        role: UserRole = UserRole.PARTICIPANT
    ) -> User:
        """Create a new user."""
        user = User(
            id=str(uuid.uuid4()),
            email=email.lower(),
            username=username.lower(),
            full_name=full_name,
            password_hash=get_password_hash(password),
            role=role,
            is_active=True,
            is_admin=(role == UserRole.ADMIN)
        )
        db.add(user)
        db.commit()
        db.refresh(user)
        return user
    
    @staticmethod
    def get_user_by_email(db: Session, email: str) -> User | None:
        """Get user by email."""
        query = select(User).where(User.email == email.lower())
        return db.scalars(query).first()
    
    @staticmethod
    def get_user_by_username(db: Session, username: str) -> User | None:
        """Get user by username."""
        query = select(User).where(User.username == username.lower())
        return db.scalars(query).first()
    
    @staticmethod
    def get_user_by_id(db: Session, user_id: str) -> User | None:
        """Get user by ID."""
        query = select(User).where(User.id == user_id)
        return db.scalars(query).first()
    
    @staticmethod
    def authenticate_user(db: Session, email: str, password: str) -> User | None:
        """Authenticate user with email and password."""
        user = UserCRUD.get_user_by_email(db, email)
        if not user:
            return None
        if not user.is_active:
            return None
        if not verify_password(password, user.password_hash):
            return None
        return user
    
    @staticmethod
    def update_user(db: Session, user_id: str, **kwargs) -> User | None:
        """Update user fields."""
        user = UserCRUD.get_user_by_id(db, user_id)
        if not user:
            return None
        
        # Prevent updating sensitive fields
        allowed_fields = {"full_name", "username"}
        for key, value in kwargs.items():
            if key in allowed_fields and value is not None:
                setattr(user, key, value)
        
        db.commit()
        db.refresh(user)
        return user
    
    @staticmethod
    def user_exists(db: Session, email: str = None, username: str = None) -> bool:
        """Check if user exists by email or username."""
        if email:
            if UserCRUD.get_user_by_email(db, email):
                return True
        if username:
            if UserCRUD.get_user_by_username(db, username):
                return True
        return False
    
    @staticmethod
    def is_email_taken(db: Session, email: str) -> bool:
        """Check if email is already taken."""
        return UserCRUD.get_user_by_email(db, email) is not None
    
    @staticmethod
    def is_username_taken(db: Session, username: str) -> bool:
        """Check if username is already taken."""
        return UserCRUD.get_user_by_username(db, username) is not None
    
    @staticmethod
    def delete_user(db: Session, user_id: str) -> bool:
        """Delete a user by ID."""
        user = UserCRUD.get_user_by_id(db, user_id)
        if not user:
            return False
        db.delete(user)
        db.commit()
        return True
