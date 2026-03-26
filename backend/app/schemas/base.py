from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List
from datetime import datetime
from enum import Enum


class ChallengeStatus(str, Enum):
    DRAFT = "DRAFT"
    ACTIVE = "ACTIVE"
    CLOSED = "CLOSED"
    ARCHIVED = "ARCHIVED"


class ChallengeDifficulty(str, Enum):
    EASY = "EASY"
    MEDIUM = "MEDIUM"
    HARD = "HARD"


class MetricDirection(str, Enum):
    HIGHER_IS_BETTER = "HIGHER_IS_BETTER"
    LOWER_IS_BETTER = "LOWER_IS_BETTER"


class Response(BaseModel):
    """Base response model."""
    message: Optional[str] = None
    status: str


class PaginatedResponse(BaseModel):
    """Paginated response model."""
    total: int
    skip: int
    limit: int
    items: List


class UserCreate(BaseModel):
    """User creation schema."""
    email: EmailStr
    username: str = Field(..., min_length=3, max_length=50)
    password: str = Field(..., min_length=8, max_length=72)
    full_name: str = Field(..., min_length=2)


class UserUpdate(BaseModel):
    """User update schema."""
    full_name: Optional[str] = None
    username: Optional[str] = None


class UserResponse(BaseModel):
    """User response schema."""
    id: str
    email: str
    username: str
    full_name: str
    is_active: bool
    is_admin: bool
    created_at: datetime
    
    class Config:
        from_attributes = True


class UserWithToken(UserResponse):
    """User response with authentication tokens."""
    access_token: str
    refresh_token: str
    token_type: str = "bearer"


class MetricCreate(BaseModel):
    """Metric creation schema."""
    name: str = Field(..., min_length=1)
    description: Optional[str] = None
    metric_type: str
    weight: float = Field(default=1.0, ge=0)
    is_primary: bool = False
    min_value: float = 0.0
    max_value: float = 100.0
    direction: MetricDirection
    formula: Optional[str] = None


class MetricResponse(BaseModel):
    """Metric response schema."""
    id: str
    challenge_id: str
    name: str
    metric_type: str
    weight: float
    is_primary: bool
    direction: str
    created_at: datetime
    
    class Config:
        from_attributes = True


class ChallengeCreate(BaseModel):
    """Challenge creation schema."""
    title: str = Field(..., min_length=5, max_length=200)
    description: str = Field(..., min_length=10, max_length=5000)
    problem_statement: str = Field(..., min_length=10)
    difficulty_level: ChallengeDifficulty
    start_date: datetime
    end_date: datetime
    prize_pool: Optional[float] = None
    image_url: Optional[str] = None
    dataset_url: Optional[str] = None
    metrics: List[MetricCreate] = Field(..., min_items=1)


class ChallengeUpdate(BaseModel):
    """Challenge update schema."""
    title: Optional[str] = None
    description: Optional[str] = None
    problem_statement: Optional[str] = None
    status: Optional[ChallengeStatus] = None
    difficulty_level: Optional[ChallengeDifficulty] = None
    start_date: Optional[datetime] = None
    end_date: Optional[datetime] = None


class ChallengeResponse(BaseModel):
    """Challenge response schema."""
    id: str
    title: str
    description: str
    problem_statement: str
    status: str
    difficulty_level: str
    prize_pool: Optional[float]
    image_url: Optional[str]
    dataset_url: Optional[str]
    start_date: datetime
    end_date: datetime
    participant_count: int
    submission_count: int
    created_by: str
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True


class ChallengeListResponse(BaseModel):
    """Challenge list response."""
    id: str
    title: str
    description: str
    status: str
    difficulty_level: str
    prize_pool: Optional[float]
    image_url: Optional[str]
    participant_count: int
    submission_count: int
    created_at: datetime
    
    class Config:
        from_attributes = True


class TeamCreate(BaseModel):
    """Team creation schema."""
    name: str = Field(..., min_length=3, max_length=100)
    description: Optional[str] = None


class TeamResponse(BaseModel):
    """Team response schema."""
    id: str
    name: str
    description: Optional[str]
    created_by: str
    member_count: int
    created_at: datetime
    
    class Config:
        from_attributes = True


class SubmissionResponse(BaseModel):
    """Submission response schema."""
    id: str
    challenge_id: str
    team_id: Optional[str]
    user_id: str
    status: str
    submitted_at: datetime
    processed_at: Optional[datetime]
    error_message: Optional[str]
    is_latest: bool
    
    class Config:
        from_attributes = True


class ScoreResponse(BaseModel):
    """Score response schema."""
    metric_id: str
    metric_name: str
    score_value: float


class SubmissionDetailResponse(SubmissionResponse):
    """Submission detail response with scores."""
    scores: List[ScoreResponse] = []


class LeaderboardEntry(BaseModel):
    """Leaderboard entry schema."""
    rank: int
    team_id: Optional[str]
    team_name: Optional[str]
    user_id: Optional[str]
    username: Optional[str]
    total_score: float
    submission_count: int
    last_submission_at: Optional[datetime]


class LeaderboardResponse(BaseModel):
    """Leaderboard response schema."""
    challenge_id: str
    challenge_title: Optional[str]
    total_participants: int
    updated_at: datetime
    rankings: List[LeaderboardEntry]
