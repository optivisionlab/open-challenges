"""Authentication service - business logic for authentication."""
from sqlalchemy.orm import Session
from datetime import timedelta
from app.schemas.base import UserCreate, UserWithToken, UserResponse
from app.crud.user import UserCRUD
from app.core.security import create_access_token, create_refresh_token, decode_token
from app.models.base import User, UserRole
from app.core.config import settings
import logging

logger = logging.getLogger(__name__)


class AuthService:
    """Authentication service."""
    
    @staticmethod
    def register(db: Session, user_data: UserCreate) -> UserWithToken:
        """
        Register a new user.
        
        Args:
            db: Database session
            user_data: User registration data
            
        Returns:
            UserWithToken with access and refresh tokens
            
        Raises:
            ValueError: If email or username already exists
        """
        # Check if email already exists
        if UserCRUD.is_email_taken(db, user_data.email):
            raise ValueError(f"Email {user_data.email} already registered")
        
        # Check if username already exists
        if UserCRUD.is_username_taken(db, user_data.username):
            raise ValueError(f"Username {user_data.username} already taken")
        
        # Create new user
        user = UserCRUD.create_user(
            db=db,
            email=user_data.email,
            username=user_data.username,
            password=user_data.password,
            full_name=user_data.full_name,
            role=UserRole.PARTICIPANT  # Default role
        )
        
        logger.info(f"New user registered: {user.email}")
        
        # Generate tokens
        tokens = AuthService._generate_tokens(user)
        
        return UserWithToken(
            **user.__dict__,
            **tokens
        )
    
    @staticmethod
    def login(db: Session, email: str, password: str) -> UserWithToken:
        """
        Login user with email and password.
        
        Args:
            db: Database session
            email: User email
            password: User password
            
        Returns:
            UserWithToken with access and refresh tokens
            
        Raises:
            ValueError: If credentials are invalid
        """
        user = UserCRUD.authenticate_user(db, email, password)
        if not user:
            logger.warning(f"Failed login attempt for: {email}")
            raise ValueError("Invalid email or password")
        
        logger.info(f"User logged in: {user.email}")
        
        # Generate tokens
        tokens = AuthService._generate_tokens(user)
        
        return UserWithToken(
            **user.__dict__,
            **tokens
        )
    
    @staticmethod
    def refresh_access_token(refresh_token: str) -> dict:
        """
        Generate new access token from refresh token.
        
        Args:
            refresh_token: Refresh token
            
        Returns:
            Dict with new access_token
            
        Raises:
            ValueError: If refresh token is invalid
        """
        payload = decode_token(refresh_token)
        if not payload:
            raise ValueError("Invalid refresh token")
        
        user_id = payload.get("sub")
        if not user_id:
            raise ValueError("Invalid refresh token")
        
        logger.info(f"Token refreshed for user: {user_id}")
        
        # Create new access token
        access_token = create_access_token({"sub": user_id})
        
        return {
            "access_token": access_token,
            "token_type": "bearer"
        }
    
    @staticmethod
    def get_current_user(db: Session, token: str) -> User:
        """
        Get current user from access token.
        
        Args:
            db: Database session
            token: Access token
            
        Returns:
            Current user
            
        Raises:
            ValueError: If token is invalid or user not found
        """
        payload = decode_token(token)
        if not payload:
            raise ValueError("Invalid access token")
        
        user_id = payload.get("sub")
        if not user_id:
            raise ValueError("Invalid access token")
        
        user = UserCRUD.get_user_by_id(db, user_id)
        if not user:
            raise ValueError("User not found")
        
        if not user.is_active:
            raise ValueError("User account is inactive")
        
        return user
    
    @staticmethod
    def _generate_tokens(user: User) -> dict:
        """
        Generate access and refresh tokens for user.
        
        Args:
            user: User object
            
        Returns:
            Dict with access_token and refresh_token
        """
        access_token = create_access_token(
            data={"sub": user.id}
        )
        refresh_token = create_refresh_token(
            data={"sub": user.id}
        )
        
        return {
            "access_token": access_token,
            "refresh_token": refresh_token,
            "token_type": "bearer"
        }
    
    @staticmethod
    def logout(token: str) -> bool:
        """
        Logout user by blacklisting token.
        
        Note: In production, tokens should be added to a blacklist in Redis
        with TTL equal to token expiration time.
        
        Args:
            token: Access token
            
        Returns:
            True if logout successful
        """
        logger.info("User logged out")
        # TODO: Add token to Redis blacklist
        return True
