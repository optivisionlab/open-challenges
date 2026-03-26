"""Authentication endpoints."""
from fastapi import APIRouter, Depends, HTTPException, status, Header
from sqlalchemy.orm import Session
from app.schemas.base import UserCreate, UserResponse, UserWithToken
from app.services.auth_service import AuthService
from app.utils.db import get_db
from app.models.base import User
import logging

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/auth", tags=["auth"])


def get_token_from_header(authorization: str = Header(None)) -> str:
    """Extract token from Authorization header."""
    if not authorization:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authenticated",
            headers={"WWW-Authenticate": "Bearer"}
        )
    
    parts = authorization.split()
    if len(parts) != 2 or parts[0].lower() != "bearer":
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authorization header",
            headers={"WWW-Authenticate": "Bearer"}
        )
    
    return parts[1]


async def get_current_user_from_header(
    authorization: str = Header(None),
    db: Session = Depends(get_db)
) -> User:
    """Get current user from Authorization header."""
    token = get_token_from_header(authorization)
    
    try:
        from app.services.auth_service import AuthService
        return AuthService.get_current_user(db, token)
    except ValueError as e:
        logger.warning(f"Authentication failed: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=str(e),
            headers={"WWW-Authenticate": "Bearer"}
        )


@router.post(
    "/register",
    response_model=UserWithToken,
    status_code=status.HTTP_201_CREATED,
    summary="Register a new user",
    responses={
        400: {"description": "Email or username already taken"},
        422: {"description": "Invalid input data"}
    }
)
async def register(
    user_data: UserCreate,
    db: Session = Depends(get_db)
) -> UserWithToken:
    """
    Register a new user.
    
    - **email**: Valid email address
    - **username**: Unique username (3-50 characters)
    - **password**: Strong password (min 8 characters)
    - **full_name**: User's full name (2+ characters)
    
    Returns: User object with access and refresh tokens
    """
    try:
        return AuthService.register(db, user_data)
    except ValueError as e:
        logger.warning(f"Registration failed: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )
    except Exception as e:
        logger.error(f"Registration error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Registration failed"
        )


@router.post(
    "/login",
    response_model=UserWithToken,
    status_code=status.HTTP_200_OK,
    summary="User login",
    responses={
        401: {"description": "Invalid credentials"},
        404: {"description": "User not found"}
    }
)
async def login(
    email: str,
    password: str,
    db: Session = Depends(get_db)
) -> UserWithToken:
    """
    User login with email and password.
    
    - **email**: User email address
    - **password**: User password
    
    Returns: User object with access and refresh tokens
    """
    try:
        return AuthService.login(db, email, password)
    except ValueError as e:
        logger.warning(f"Login failed: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
            headers={"WWW-Authenticate": "Bearer"}
        )
    except Exception as e:
        logger.error(f"Login error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Login failed"
        )


@router.post(
    "/refresh",
    response_model=dict,
    status_code=status.HTTP_200_OK,
    summary="Refresh access token",
    responses={
        401: {"description": "Invalid refresh token"}
    }
)
async def refresh_token(
    refresh_token: str
) -> dict:
    """
    Refresh access token using a valid refresh token.
    
    - **refresh_token**: Valid refresh token from login response
    
    Returns: New access token
    """
    try:
        return AuthService.refresh_access_token(refresh_token)
    except ValueError as e:
        logger.warning(f"Token refresh failed: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired refresh token",
            headers={"WWW-Authenticate": "Bearer"}
        )
    except Exception as e:
        logger.error(f"Token refresh error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Token refresh failed"
        )


@router.post(
    "/logout",
    status_code=status.HTTP_200_OK,
    summary="User logout",
    responses={
        401: {"description": "Invalid token"}
    }
)
async def logout(
    current_user: User = Depends(get_current_user_from_header),
    authorization: str = Header(None),
) -> dict:
    """
    User logout - blacklist access token.
    
    Auth header: `Authorization: Bearer <token>`
    
    Returns: Logout confirmation message
    """
    try:
        token = get_token_from_header(authorization)
        AuthService.logout(token)
        logger.info(f"User logged out: {current_user.email}")
        return {"message": "Successfully logged out"}
    except HTTPException:
        raise
    except Exception as e:
        logger.warning(f"Logout failed: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token",
            headers={"WWW-Authenticate": "Bearer"}
        )


@router.get(
    "/me",
    response_model=UserResponse,
    status_code=status.HTTP_200_OK,
    summary="Get current user profile",
    responses={
        401: {"description": "Invalid or expired token"}
    }
)
async def get_me(
    current_user: User = Depends(get_current_user_from_header)
) -> UserResponse:
    """
    Get current logged-in user profile.
    
    Auth header: `Authorization: Bearer <access_token>`
    
    Returns: Current user profile
    """
    return UserResponse.model_validate(current_user)
