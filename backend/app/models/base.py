from sqlalchemy import Column, String, Boolean, DateTime, Integer, Float, Text, Enum
from sqlalchemy.orm import declarative_base
from sqlalchemy.sql import func
import enum
from datetime import datetime

Base = declarative_base()


class BaseModel(Base):
    """Base model with common fields."""
    __abstract__ = True
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())


class ChallengeStatus(str, enum.Enum):
    """Challenge status enumeration."""
    DRAFT = "DRAFT"
    ACTIVE = "ACTIVE"
    CLOSED = "CLOSED"
    ARCHIVED = "ARCHIVED"


class ChallengeDifficulty(str, enum.Enum):
    """Challenge difficulty enumeration."""
    EASY = "EASY"
    MEDIUM = "MEDIUM"
    HARD = "HARD"


class SubmissionStatus(str, enum.Enum):
    """Submission status enumeration."""
    PENDING = "PENDING"
    PROCESSING = "PROCESSING"
    COMPLETED = "COMPLETED"
    FAILED = "FAILED"


class MetricType(str, enum.Enum):
    """Metric type enumeration."""
    ACCURACY = "ACCURACY"
    PRECISION = "PRECISION"
    RECALL = "RECALL"
    F1_SCORE = "F1_SCORE"
    AUC = "AUC"
    MSE = "MSE"
    RMSE = "RMSE"
    MAE = "MAE"
    R2_SCORE = "R2_SCORE"
    CUSTOM = "CUSTOM"


class MetricDirection(str, enum.Enum):
    """Metric direction enumeration."""
    HIGHER_IS_BETTER = "HIGHER_IS_BETTER"
    LOWER_IS_BETTER = "LOWER_IS_BETTER"


class UserRole(str, enum.Enum):
    """User role enumeration."""
    ADMIN = "ADMIN"
    ORGANIZER = "ORGANIZER"
    PARTICIPANT = "PARTICIPANT"
    VIEWER = "VIEWER"


class User(BaseModel):
    """User model."""
    __tablename__ = "users"
    
    id = Column(String, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    username = Column(String, unique=True, index=True, nullable=False)
    full_name = Column(String, nullable=False)
    password_hash = Column(String, nullable=False)
    is_active = Column(Boolean, default=True, index=True)
    is_admin = Column(Boolean, default=False, index=True)
    role = Column(Enum(UserRole), default=UserRole.PARTICIPANT, nullable=False)


class Challenge(BaseModel):
    """Challenge model."""
    __tablename__ = "challenges"
    
    id = Column(String, primary_key=True, index=True)
    title = Column(String, nullable=False, index=True)
    description = Column(Text, nullable=False)
    problem_statement = Column(Text, nullable=False)
    
    # Status & Visibility
    status = Column(Enum(ChallengeStatus), default=ChallengeStatus.DRAFT, index=True)
    
    # Timing
    start_date = Column(DateTime(timezone=True), nullable=False)
    end_date = Column(DateTime(timezone=True), nullable=False)
    
    # Media
    image_url = Column(String)
    dataset_url = Column(String)
    
    # Challenge Details
    difficulty_level = Column(Enum(ChallengeDifficulty), nullable=False, index=True)
    prize_pool = Column(Float)
    
    # Metadata
    created_by = Column(String, index=True)
    participant_count = Column(Integer, default=0)
    submission_count = Column(Integer, default=0)


class Metric(BaseModel):
    """Metric model."""
    __tablename__ = "metrics"
    
    id = Column(String, primary_key=True, index=True)
    challenge_id = Column(String, index=True, nullable=False)
    name = Column(String, nullable=False)
    description = Column(Text)
    
    # Type Configuration
    metric_type = Column(Enum(MetricType), nullable=False)
    formula = Column(Text)
    
    # Scoring
    weight = Column(Float, default=1.0)
    is_primary = Column(Boolean, default=False)
    min_value = Column(Float, default=0.0)
    max_value = Column(Float, default=100.0)
    direction = Column(Enum(MetricDirection), nullable=False)


class Team(BaseModel):
    """Team model."""
    __tablename__ = "teams"
    
    id = Column(String, primary_key=True, index=True)
    name = Column(String, nullable=False, index=True)
    description = Column(Text)
    created_by = Column(String, index=True, nullable=False)
    member_count = Column(Integer, default=1)


class Submission(BaseModel):
    """Submission model."""
    __tablename__ = "submissions"
    
    id = Column(String, primary_key=True, index=True)
    challenge_id = Column(String, index=True, nullable=False)
    team_id = Column(String, index=True)
    user_id = Column(String, index=True, nullable=False)
    
    # File
    submission_file_id = Column(String)
    submission_format = Column(String)
    
    # Status
    status = Column(Enum(SubmissionStatus), default=SubmissionStatus.PENDING, index=True)
    submitted_at = Column(DateTime(timezone=True), default=func.now())
    processed_at = Column(DateTime(timezone=True))
    error_message = Column(Text)
    
    # Tracking
    is_latest = Column(Boolean, default=True, index=True)


class SubmissionScore(BaseModel):
    """Submission score model."""
    __tablename__ = "submission_scores"
    
    id = Column(String, primary_key=True, index=True)
    submission_id = Column(String, index=True, nullable=False)
    metric_id = Column(String, index=True, nullable=False)
    score_value = Column(Float, nullable=False)
    calculated_at = Column(DateTime(timezone=True), default=func.now())


class Leaderboard(BaseModel):
    """Leaderboard model for cached rankings."""
    __tablename__ = "leaderboard"
    
    id = Column(String, primary_key=True, index=True)
    challenge_id = Column(String, index=True, nullable=False)
    team_id = Column(String, index=True, nullable=True)
    user_id = Column(String, index=True, nullable=True)
    
    rank = Column(Integer, nullable=False)
    total_score = Column(Float, nullable=False)
    
    # Additional fields
    submission_count = Column(Integer, default=0)
    last_submission_at = Column(DateTime(timezone=True))
