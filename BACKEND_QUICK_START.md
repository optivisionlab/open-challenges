# Backend Development - Quick Start Guide

**Last Updated**: March 25, 2026  
**Development Duration**: ~12-16 weeks  
**Tech Stack**: FastAPI, PostgreSQL, Redis, Celery

---

## Prerequisites

- Python 3.11+
- Docker & Docker Compose
- Git
- PostgreSQL client (optional)
- Redis CLI (optional)

---

## Part 1: Initial Setup (Week 1)

### Step 1.1: Create Backend Project Structure

```bash
# Navigate to backend directory
cd backend

# Create directory structure
mkdir -p app/{api/v1/endpoints,core,crud,models,schemas,services,tasks,middleware,utils}
mkdir -p tests
mkdir -p alembic/versions
mkdir -p scripts

# Create __init__.py files
touch app/__init__.py
touch app/core/__init__.py
touch app/api/__init__.py
touch app/api/v1/__init__.py
touch app/api/v1/endpoints/__init__.py
touch app/models/__init__.py
touch app/schemas/__init__.py
touch app/crud/__init__.py
touch app/services/__init__.py
touch app/tasks/__init__.py
touch app/middleware/__init__.py
touch app/utils/__init__.py
touch tests/__init__.py
touch tests/conftest.py
```

### Step 1.2: Create Configuration Files

**requirements.txt**:

```
# Core Framework
fastapi>=0.104.0
uvicorn[standard]>=0.24.0
python-multipart>=0.0.6

# Database
sqlalchemy>=2.0.0
alembic>=1.12.0
psycopg2-binary>=2.9.0

# Validation
pydantic>=2.0.0
pydantic-settings>=2.0.0

# Security
python-jose[cryptography]>=3.3.0
passlib[bcrypt]>=1.7.4
PyJWT>=2.8.0
python-dotenv>=1.0.0

# Caching & Async
redis>=5.0.0
celery[redis]>=5.3.0

# File Storage
minio>=7.1.0

# API
fastapi-cors>=0.0.6

# Testing
pytest>=7.4.0
pytest-asyncio>=0.21.0
httpx>=0.24.0
```

**requirements-dev.txt**:

```
-r requirements.txt

# Development
black>=23.0.0
flake8>=6.0.0
isort>=5.12.0
mypy>=1.0.0
pytest-cov>=4.1.0
```

**.env.example**:

```bash
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/open_challenges
SQLALCHEMY_DATABASE_URL=postgresql://user:password@localhost:5432/open_challenges

# Redis
REDIS_URL=redis://localhost:6379/0

# JWT
SECRET_KEY=your-secret-key-here-change-in-production
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
REFRESH_TOKEN_EXPIRE_DAYS=7

# App
DEBUG=True
APP_NAME="Open Challenges Platform"
APP_VERSION="1.0.0"
BACKEND_CORS_ORIGINS=["http://localhost:3000"]

# Storage
MINIO_URL=http://localhost:9000
MINIO_ROOT_USER=minioadmin
MINIO_ROOT_PASSWORD=minioadmin
MINIO_BUCKET_NAME=open-challenges

# Celery
CELERY_BROKER_URL=redis://localhost:6379/0
CELERY_RESULT_BACKEND=redis://localhost:6379/0
```

### Step 1.3: Create Docker Compose

**docker-compose.yml**:

```yaml
version: '3.8'

services:
  postgres:
    image: postgres:15-alpine
    environment:
      POSTGRES_USER: user
      POSTGRES_PASSWORD: password
      POSTGRES_DB: open_challenges
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U user"]
      interval: 10s
      timeout: 5s
      retries: 5

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 10s
      timeout: 5s
      retries: 5

  minio:
    image: minio/minio:latest
    environment:
      MINIO_ROOT_USER: minioadmin
      MINIO_ROOT_PASSWORD: minioadmin
    ports:
      - "9000:9000"
      - "9001:9001"
    command: minio server /data --console-address ":9001"
    volumes:
      - minio_data:/data

volumes:
  postgres_data:
  minio_data:
```

**Run Docker Compose**:

```bash
docker-compose up -d
```

### Step 1.4: Initialize FastAPI Application

**app/main.py**:

```python
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.api.v1.api import api_router

app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    openapi_url="/openapi.json",
    docs_url="/docs",
    redoc_url="/redoc",
)

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# API Router
app.include_router(api_router, prefix="/api/v1")

@app.get("/health")
async def health_check():
    return {"status": "ok", "version": settings.APP_VERSION}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
```

**app/core/config.py**:

```python
from pydantic_settings import BaseSettings
from typing import List

class Settings(BaseSettings):
    # App
    APP_NAME: str = "Open Challenges Platform"
    APP_VERSION: str = "1.0.0"
    DEBUG: bool = True
    
    # Database
    DATABASE_URL: str
    SQLALCHEMY_DATABASE_URL: str = None
    
    # Redis
    REDIS_URL: str = "redis://localhost:6379/0"
    
    # JWT
    SECRET_KEY: str
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7
    
    # CORS
    BACKEND_CORS_ORIGINS: List[str] = ["http://localhost:3000"]
    
    # Storage
    MINIO_URL: str = "http://localhost:9000"
    MINIO_ROOT_USER: str = "minioadmin"
    MINIO_ROOT_PASSWORD: str = "minioadmin"
    MINIO_BUCKET_NAME: str = "open-challenges"
    
    class Config:
        env_file = ".env"
        case_sensitive = True

settings = Settings()
```

### Step 1.5: Test Setup

```bash
# Install dependencies
pip install -r requirements.txt

# Run the app
python -m uvicorn app.main:app --reload

# Test health endpoint
curl http://localhost:8000/health

# Check documentation
# Visit http://localhost:8000/docs
```

---

## Part 2: Database Setup (Week 1)

### Step 2.1: Initialize Alembic

```bash
# Initialize Alembic (if not already done)
alembic init alembic

# Edit alembic/env.py for SQLAlchemy configuration
```

### Step 2.2: Create Base Model

**app/models/base.py**:

```python
from sqlalchemy.orm import declarative_base
from sqlalchemy.sql import func
from sqlalchemy import Column, DateTime

Base = declarative_base()

class BaseModel(Base):
    __abstract__ = True
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
```

### Step 2.3: Create User Model

**app/models/user.py**:

```python
from sqlalchemy import Column, String, Boolean, DateTime
from sqlalchemy.sql import func
from app.models.base import Base, BaseModel

class User(BaseModel):
    __tablename__ = "users"
    
    id = Column(String, primary_key=True)
    email = Column(String, unique=True, index=True)
    username = Column(String, unique=True, index=True)
    full_name = Column(String)
    password_hash = Column(String)
    is_active = Column(Boolean, default=True)
    is_admin = Column(Boolean, default=False)
```

### Step 2.4: Create Migration

```bash
# Create initial migration
alembic revision --autogenerate -m "Initial schema: Users"

# Apply migration
alembic upgrade head
```

---

## Part 3: Authentication (Week 2)

### Step 3.1: Security Utils

**app/core/security.py**:

```python
from datetime import datetime, timedelta, timezone
from typing import Optional
from jose import JWTError, jwt
from passlib.context import CryptContext
from pydantic import ValidationError
from app.core.config import settings

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(
            minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES
        )
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)
    return encoded_jwt

def decode_token(token: str) -> dict:
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        return payload
    except JWTError:
        return None
```

### Step 3.2: Auth Service

**app/services/auth_service.py**:

```python
from sqlalchemy.orm import Session
from app.core.security import get_password_hash, verify_password, create_access_token
from app.models.user import User
from app.crud.user import crud_user
from app.schemas.user import UserCreate

class AuthService:
    @staticmethod
    async def register(db: Session, user_data: UserCreate) -> User:
        # Check if email exists
        if crud_user.get_by_email(db, user_data.email):
            raise ValueError("Email already registered")
        
        # Hash password
        hashed_password = get_password_hash(user_data.password)
        
        # Create user
        user = User(
            email=user_data.email,
            username=user_data.username,
            full_name=user_data.full_name,
            password_hash=hashed_password,
            is_active=True
        )
        return crud_user.create(db, user)
    
    @staticmethod
    async def authenticate(db: Session, email: str, password: str) -> Optional[User]:
        user = crud_user.get_by_email(db, email)
        if not user or not verify_password(password, user.password_hash):
            return None
        return user
    
    @staticmethod
    def generate_tokens(user_id: str) -> dict:
        access_token = create_access_token({"sub": user_id})
        return {
            "access_token": access_token,
            "token_type": "bearer"
        }
```

### Step 3.3: Auth Endpoints

**app/api/v1/endpoints/auth.py**:

```python
from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from app.api.v1.dependencies import get_db
from app.services.auth_service import AuthService
from app.schemas.user import UserCreate, UserResponse

router = APIRouter(prefix="/auth", tags=["Auth"])

@router.post("/register", response_model=UserResponse)
async def register(user_data: UserCreate, db: Session = Depends(get_db)):
    try:
        user = await AuthService.register(db, user_data)
        tokens = AuthService.generate_tokens(user.id)
        return {**user.__dict__, **tokens}
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/login", response_model=UserResponse)
async def login(email: str, password: str, db: Session = Depends(get_db)):
    user = await AuthService.authenticate(db, email, password)
    if not user:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    tokens = AuthService.generate_tokens(user.id)
    return {**user.__dict__, **tokens}

@router.get("/me", response_model=UserResponse)
async def get_current_user(current_user: User = Depends(get_current_user)):
    return current_user
```

---

## Part 4: Development Workflow

### Daily Development

1. **Start Services**:
   ```bash
   docker-compose up -d
   # Check status
   docker-compose ps
   ```

2. **Run Backend Server**:
   ```bash
   python -m uvicorn app.main:app --reload
   ```

3. **Access Documentation**:
   - Swagger UI: http://localhost:8000/docs
   - ReDoc: http://localhost:8000/redoc

4. **Test Endpoints**:
   ```bash
   # Health check
   curl http://localhost:8000/health
   
   # Register user
   curl -X POST http://localhost:8000/api/v1/auth/register \
     -H "Content-Type: application/json" \
     -d '{
       "email": "user@example.com",
       "username": "testuser",
       "password": "SecurePass123!",
       "full_name": "Test User"
     }'
   ```

### Code Quality

```bash
# Format code
black app/ tests/

# Lint
flake8 app/ tests/

# Sort imports
isort app/ tests/

# Type checking
mypy app/

# Run tests
pytest tests/ -v --cov=app
```

---

## Part 5: Phased Implementation Checklist

### ✅ Phase 1: Core Infrastructure (Week 1-2)
- [ ] Project structure created
- [ ] Docker Compose configured
- [ ] FastAPI app initialized
- [ ] Database connected & models created
- [ ] Alembic migrations setup
- [ ] Base CRUD operations

### ✅ Phase 2: Authentication (Week 2-3)
- [ ] User model & schema
- [ ] Registration endpoint
- [ ] Login endpoint
- [ ] JWT token generation
- [ ] Current user endpoint
- [ ] Password hashing

### ✅ Phase 3: Challenge API (Week 3-5)
- [ ] Challenge model & schema
- [ ] Metric model & schema
- [ ] Create challenge endpoint
- [ ] List challenges (with pagination)
- [ ] Get challenge detail
- [ ] Update challenge
- [ ] Delete challenge
- [ ] Add metrics
- [ ] Cache strategy

### ✅ Phase 4: Submission & Scoring (Week 5-8)
- [ ] Submission model & schema
- [ ] File storage setup (MinIO)
- [ ] Upload endpoint
- [ ] List submissions endpoint
- [ ] Get submission detail
- [ ] Celery configuration
- [ ] Scoring task
- [ ] Score storage & retrieval

### ✅ Phase 5: Leaderboard (Week 8-10)
- [ ] SubmissionScore model
- [ ] Leaderboard query logic
- [ ] Challenge leaderboard endpoint
- [ ] Global leaderboard endpoint
- [ ] Redis caching
- [ ] Statistics endpoint

### ✅ Phase 6: Teams & Advanced (Week 10-12)
- [ ] Team model & CRUD
- [ ] Team membership
- [ ] Team endpoints
- [ ] User profile endpoints
- [ ] Analytics endpoints

### ✅ Phase 7: DevOps & Polish (Week 12-16)
- [ ] Docker production setup
- [ ] Health checks
- [ ] Error handling centralized
- [ ] Logging configured
- [ ] Tests written (80%+ coverage)
- [ ] API documentation
- [ ] Deployment to staging
- [ ] Final integration testing

---

## Useful Commands Reference

```bash
# Database
alembic revision --autogenerate -m "message"
alembic upgrade head
alembic downgrade -1

# Backend
python -m uvicorn app.main:app --reload
python -m pytest tests/ -v

# Docker
docker-compose up -d
docker-compose down
docker-compose logs -f backend
docker-compose ps

# Database CLI
psql -U user -d open_challenges -h localhost

# Redis CLI
redis-cli -n 0 PING
redis-cli -n 0 FLUSHALL
```

---

## Troubleshooting

**Port already in use**:
```bash
# Kill process on port 8000
lsof -ti:8000 | xargs kill -9
```

**Database connection error**:
```bash
# Restart postgres
docker-compose restart postgres
```

**Redis connection error**:
```bash
# Test Redis
redis-cli PING
# Should respond: PONG
```

---

## Next Steps

1. Follow **Phase 1** setup above
2. Complete **Phase 2** with authentication
3. Implement phases sequentially
4. Integrate with frontend as endpoints are completed
5. Deploy to staging for testing

---

## Support Resources

- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [SQLAlchemy Documentation](https://docs.sqlalchemy.org/)
- [Celery Documentation](https://docs.celeryproject.io/)
- [Pydantic Documentation](https://docs.pydantic.dev/)
- [Backend API Contract](./BACKEND_API_CONTRACT.md)
- [System Architecture](./SYSTEM_ARCHITECTURE.md)
