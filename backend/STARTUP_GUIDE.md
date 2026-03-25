# Backend Startup Guide - Development Environment

**Created**: March 25, 2026  
**Status**: Phase 1 - Core Infrastructure (IN PROGRESS)  

---

## Quick Start (Without Docker)

If Docker daemon is not available, you can run the backend services locally or use cloud services.

### Option 1: Using Local Services

#### 1. Install PostgreSQL
**macOS (with Homebrew):**
```bash
brew install postgresql
brew services start postgresql
```

**Verify:**
```bash
psql --version
```

#### 2. Create Database
```bash
psql postgres << EOF
CREATE ROLE user WITH LOGIN PASSWORD 'password';
ALTER ROLE user CREATEDB;
CREATE DATABASE open_challenges OWNER user;
EOF
```

**Verify:**
```bash
psql -U user -d open_challenges -c "\dt"
```

#### 3. Install Redis
**macOS:**
```bash
brew install redis
brew services start redis
```

**Verify:**
```bash
redis-cli PING
# Should respond: PONG
```

#### 4. Install MinIO (optional for local development)
```bash
brew install minio
minio server /tmp/minio &
```

### Option 2: Using Cloud Services

- **PostgreSQL**: AWS RDS, Supabase, Railway
- **Redis**: Redis Cloud, AWS ElastiCache
- **MinIO**: AWS S3 (update credentials in .env)

### Option 3: Start Only Docker Services

If you can't run Docker, run services individually:

```bash
# Terminal 1: PostgreSQL
createdb -U user open_challenges

# Terminal 2: Redis
redis-server

# Terminal 3: Backend
python -m uvicorn app.main:app --reload
```

---

## Backend Setup Steps

### 1. Navigate to Backend Directory
```bash
cd backend
```

### 2. Create Virtual Environment (Recommended)
```bash
python3.11 -m venv venv
source venv/bin/activate
```

### 3. Install Dependencies
```bash
pip install -r requirements.txt
```

### 4. Set Up Environment
```bash
cp .env.example .env.development
# Edit .env.development with your database URL
```

**If using local PostgreSQL:**
```bash
DATABASE_URL=postgresql://user:password@localhost:5432/open_challenges
SQLALCHEMY_DATABASE_URL=postgresql://user:password@localhost:5432/open_challenges
```

### 5. Run the Application
```bash
python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

**Output should show:**
```
INFO:     Uvicorn running on http://0.0.0.0:8000
INFO:     Application startup complete
```

### 6. Test the API
Open in browser or use curl:

```bash
# Health check
curl http://localhost:8000/health

# Root endpoint
curl http://localhost:8000/

# API documentation
# Visit: http://localhost:8000/api/docs
```

---

## Run Tests

```bash
# All tests
pytest tests/ -v

# With coverage
pytest tests/ -v --cov=app

# Specific test file
pytest tests/test_health.py -v

# Watch mode (with pytest-watch)
ptw tests/
```

---

## Project Structure Created

```
backend/
├── app/
│   ├── core/
│   │   ├── config.py          ✅ Settings management
│   │   ├── security.py        ✅ JWT, password hashing
│   │   └── __init__.py
│   ├── api/
│   │   └── v1/
│   │       ├── api.py         ✅ Router
│   │       ├── endpoints/     📁 API endpoints (next)
│   │       └── __init__.py
│   ├── models/
│   │   ├── base.py            ✅ Database models (User, Challenge, etc.)
│   │   └── __init__.py
│   ├── schemas/
│   │   ├── base.py            ✅ Pydantic schemas for validation
│   │   └── __init__.py
│   ├── crud/                  📁 CRUD operations (next)
│   ├── services/              📁 Business logic (next)
│   ├── tasks/                 📁 Celery tasks (Phase 4)
│   ├── middleware/            📁 Custom middleware (Phase 6)
│   ├── utils/
│   │   ├── db.py              ✅ Database utilities
│   │   └── __init__.py
│   └── main.py                ✅ FastAPI entry point
├── tests/
│   ├── conftest.py            ✅ Test configuration
│   ├── test_health.py         ✅ Health check tests
│   └── __init__.py
├── alembic/
│   ├── versions/              📁 Migration files (next)
│   └── env.py                 📁 Alembic config (next)
├── scripts/                   📁 Utility scripts
├── docker-compose.yml         ✅ Production compose
├── docker-compose.dev.yml     ✅ Dev compose
├── requirements.txt           ✅ Dependencies
├── .env.example               ✅ Environment template
├── .env.development           ✅ Development config
├── pytest.ini                 ✅ Pytest config
├── setup.cfg                  ✅ Setup config
└── README.md                  ✅ Documentation
```

---

## Phase 1 Implementation Status

### ✅ Completed
- [x] Project structure created
- [x] Dependencies configured (requirements.txt)
- [x] Environment configuration (.env files)
- [x] FastAPI application initialized
- [x] Database utilities (SQLAlchemy engine, session)
- [x] Database models (User, Challenge, Metric, Team, Submission, etc.)
- [x] Pydantic schemas for validation
- [x] Health check endpoints
- [x] API router structure
- [x] Security utilities (JWT, password hashing)
- [x] Test configuration
- [x] Docker Compose configuration
- [x] README documentation

### ⏳ Next Steps (This Week)
- [ ] Database migrations (Alembic)
- [ ] CRUD operations for User, Challenge
- [ ] Authentication service implementation
- [ ] Test database setup

### 📋 Phase 2 (Week 2-3)
- [ ] Register endpoint
- [ ] Login endpoint
- [ ] Token refresh endpoint
- [ ] Current user endpoint
- [ ] Authorization middleware

---

## Common Commands

### Development
```bash
# Start server with auto-reload
python -m uvicorn app.main:app --reload

# Format code
black app/ tests/

# Lint code  
flake8 app/ tests/

# Type checking
mypy app/

# Sort imports
isort app/
```

### Database
```bash
# Create local database
createdb -U user open_challenges

# Drop database
dropdb -U user open_challenges

# Connect to database
psql -U user -d open_challenges
```

### Redis
```bash
# Start Redis
redis-server

# Test connection
redis-cli PING

# Monitor
redis-cli MONITOR
```

### Docker
```bash
# Start all services
docker-compose -f docker-compose.dev.yml up -d

# Check status
docker-compose -f docker-compose.dev.yml ps

# View logs
docker-compose -f docker-compose.dev.yml logs -f

# Stop all services
docker-compose -f docker-compose.dev.yml down
```

---

## Troubleshooting

### PostgreSQL Connection Error
```
Error: could not connect to server
Solution: Ensure PostgreSQL is running
macOS: brew services start postgresql
```

### Redis Connection Error
```
Error: Connection refused
Solution: Start Redis
macOS: redis-server
```

### ModuleNotFoundError: No module named 'app'
```
Solution 1: Use -m flag:
python -m uvicorn app.main:app --reload

Solution 2: Set PYTHONPATH:
export PYTHONPATH="${PYTHONPATH}:/path/to/backend"
```

### Database Already Exists
```bash
# Drop and recreate
dropdb -U user open_challenges
createdb -U user open_challenges
```

### Port 8000 Already in Use
```bash
# Kill process on port 8000
lsof -ti:8000 | xargs kill -9

# Or use different port
python -m uvicorn app.main:app --port 8001
```

---

## Next: Database Migrations

Once backend is running, we'll set up Alembic migrations:

```bash
# Initialize Alembic
alembic init alembic

# Create migration
alembic revision --autogenerate -m "Initial schema"

# Apply migrations
alembic upgrade head
```

---

## Documentation Links

- [BACKEND_QUICK_START.md](../BACKEND_QUICK_START.md) - Full setup guide
- [BACKEND_IMPLEMENTATION_PLAN.md](../BACKEND_IMPLEMENTATION_PLAN.md) - Overall roadmap
- [BACKEND_API_CONTRACT.md](../BACKEND_API_CONTRACT.md) - API reference
- [README.md](./README.md) - Backend-specific README

---

## Testing the Setup

### 1. Test Imports
```python
python -c "from app.main import app; print('✅ FastAPI app loaded successfully')"
```

### 2. Test Database Connection
```python
python << EOF
from app.utils.db import engine
try:
    with engine.connect() as conn:
        print("✅ Database connection successful")
except Exception as e:
    print(f"❌ Database error: {e}")
EOF
```

### 3. Run Health Checks
```bash
pytest tests/test_health.py -v
```

---

## Environment Setup for Different Systems

### macOS (Intel)
```bash
# Install Python
brew install python@3.11

# Create venv
python3.11 -m venv venv
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

### macOS (Apple Silicon)
```bash
# May need to install dependencies for psycopg2
ARCHFLAGS=-Wno-error=unused-command-line-argument-hard-error-in-future pip install psycopg2-binary
```

### Linux (Ubuntu/Debian)
```bash
sudo apt-get update
sudo apt-get install python3.11 python3-venv postgresql postgresql-contrib redis-server

# Create venv
python3.11 -m venv venv
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

### Windows (PowerShell)
```powershell
# Create venv
python -m venv venv
.\venv\Scripts\Activate.ps1

# Install dependencies
pip install -r requirements.txt
```

---

## Next Actions

1. **Now**: Follow setup steps above
2. **Test**: Run `pytest tests/test_health.py -v`
3. **Verify**: Visit http://localhost:8000/api/docs
4. **Next Phase**: Implement database migrations

---

**Setup Complete! Backend ready for Phase 2 implementation.** ✅
