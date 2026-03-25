# Open Challenges Platform - Backend

Production-ready backend API for the Open Challenges platform.

## Quick Start

### Prerequisites
- Python 3.11+
- Docker & Docker Compose
- PostgreSQL Client (optional)

### Setup

1. **Install dependencies:**
```bash
pip install -r requirements.txt
```

2. **Copy environment file:**
```bash
cp .env.example .env.development
```

3. **Start services:**
```bash
docker-compose up -d
```

4. **Run the application:**
```bash
python -m uvicorn app.main:app --reload
```

5. **Access documentation:**
- Swagger UI: [API Docs](http://localhost:8000/api/docs)
- ReDoc: [ReDoc Documentation](http://localhost:8000/api/redoc)

## Project Structure

```
backend/
├── app/
│   ├── core/                    # Core configuration
│   │   ├── config.py
│   │   └── security.py
│   ├── api/
│   │   └── v1/
│   │       ├── endpoints/       # API endpoints
│   │       └── api.py
│   ├── models/                  # Database models (SQLAlchemy)
│   ├── schemas/                 # Pydantic schemas
│   ├── crud/                    # CRUD operations
│   ├── services/                # Business logic
│   ├── tasks/                   # Celery tasks
│   ├── middleware/              # Custom middleware
│   ├── utils/                   # Utilities
│   └── main.py                  # FastAPI entry point
├── tests/                       # Test suite
├── alembic/                     # Database migrations
├── docker-compose.yml           # Docker Compose
└── requirements.txt             # Dependencies
```

## Technology Stack

- **Framework**: FastAPI
- **Database**: PostgreSQL
- **Cache**: Redis
- **Storage**: MinIO/S3
- **Task Queue**: Celery
- **Container**: Docker

## API Endpoints

### Health Check
- `GET /health` - Health check
- `GET /` - Root endpoint with info

### Full API
- See [BACKEND_API_CONTRACT.md](../BACKEND_API_CONTRACT.md) for complete API reference

## Development

### Start Development Server
```bash
python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### Format Code
```bash
black app/ tests/
```

### Lint
```bash
flake8 app/ tests/
```

### Run Tests
```bash
pytest tests/ -v --cov=app
```

## Docker Services

### PostgreSQL
- Host: localhost
- Port: 5432
- User: user
- Password: password
- Database: open_challenges

### Redis
- Host: localhost
- Port: 6379

### MinIO
- Host: localhost
- Port: 9000
- Console: http://localhost:9001
- User: minioadmin
- Password: minioadmin

## Implementation Status

### Phase 1: Core Infrastructure ⏳
- [x] Project structure created
- [x] Dependencies configured
- [x] FastAPI app initialized
- [x] Database utilities setup
- [x] Docker Compose ready
- [ ] Database models
- [ ] Alembic migrations

### Phase 2: Authentication (Next)
- [ ] User model
- [ ] Register endpoint
- [ ] Login endpoint
- [ ] JWT tokens

See [BACKEND_IMPLEMENTATION_PLAN.md](../BACKEND_IMPLEMENTATION_PLAN.md) for full roadmap.

## Documentation

- **[BACKEND_IMPLEMENTATION_PLAN.md](../BACKEND_IMPLEMENTATION_PLAN.md)** - Master plan
- **[BACKEND_API_CONTRACT.md](../BACKEND_API_CONTRACT.md)** - API reference
- **[BACKEND_QUICK_START.md](../BACKEND_QUICK_START.md)** - Setup guide

## Next Steps

1. Create database models
2. Set up Alembic migrations
3. Implement authentication endpoints
4. Build challenge management API
5. Implement submission handling
6. Build leaderboard system
