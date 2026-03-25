# 🎯 Open Challenges - Competitive Programming Platform

> A comprehensive platform for hosting and managing programming challenges with real-time leaderboards, scoring systems, and team competitions.

![Status](https://img.shields.io/badge/status-Phase%201%20Complete-green)
![Version](https://img.shields.io/badge/version-0.1.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)

---

## 📋 Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [System Architecture](#system-architecture)
- [Project Structure](#project-structure)
- [Quick Start](#quick-start)
- [API Documentation](#api-documentation)
- [Features](#features)
- [Development](#development)
- [Testing](#testing)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)

---

## 🎯 Overview

**Open Challenges** is a modern competitive programming platform designed for:
- **Hosting Challenges**: Create and manage programming competitions
- **Team Competitions**: Form teams and compete together
- **Real-time Scoring**: Automatic evaluation and ranking
- **Leaderboards**: Global and challenge-specific rankings
- **File Sharing**: Secure submission and storage

### Key Goals
✅ User-friendly interface for challenge creation and participation  
✅ Accurate and fair evaluation system  
✅ Real-time leaderboard updates  
✅ Scalable architecture for thousands of users  
✅ Enterprise-grade security and reliability  

---

## 🛠 Tech Stack

### Frontend
```
Framework:     Next.js 14 (React) with TypeScript
Styling:       Tailwind CSS 3
UI Components: shadcn/ui (Radix UI)
State:         React hooks & Context API
Testing:       Jest (configured)
```

### Backend
```
Framework:     FastAPI (Python 3.11+)
Database:      PostgreSQL 15
Cache:         Redis 7
Storage:       MinIO (S3-compatible)
Task Queue:    Celery with Redis broker
ORM:           SQLAlchemy 2.0
Validation:    Pydantic 2.0
Auth:          JWT + Bcrypt
```

### Infrastructure
```
Containerization: Docker & Docker Compose
Development:      uvicorn + Next.js dev server
Production:       Gunicorn + Next.js build
Monitoring:       Health checks & Logging
```

---

## 🏗 System Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    CLIENT LAYER (Port 3001)                 │
├─────────────────────────────────────────────────────────────┤
│  Next.js 14 + React + TypeScript                            │
│  ├── Login/Register (Auth)                                  │
│  ├── Challenge Browse & Details                             │
│  ├── Submission Upload                                      │
│  ├── Real-time Leaderboard                                  │
│  └── User Dashboard                                         │
└────────────────────▲────────────────────────────────────────┘
                     │ HTTP/REST
                     │ (http://localhost:8000/api/v1)
┌────────────────────▼────────────────────────────────────────┐
│                  API LAYER (Port 8000)                      │
├─────────────────────────────────────────────────────────────┤
│  FastAPI Application                                        │
│  ├── POST /auth/register           - User registration     │
│  ├── POST /auth/login              - User login             │
│  ├── GET  /challenges              - List challenges        │
│  ├── POST /challenges              - Create challenge       │
│  ├── POST /submissions             - Submit solution        │
│  ├── GET  /leaderboard             - Get rankings           │
│  └── GET  /health                  - Health check           │
└────────────────────▲────────────────────────────────────────┘
                     │ Database/Cache
                     ├─ PostgreSQL (Port 5432)
                     ├─ Redis (Port 6379)
│                     └─ MinIO (Port 9000)
┌────────────────────▼────────────────────────────────────────┐
│              DATA & SERVICES LAYER                          │
├─────────────────────────────────────────────────────────────┤
│  PostgreSQL 15 - Challenge, User, Submission data           │
│  Redis 7 - Caching, Celery tasks, Leaderboard updates     │
│  MinIO - Secure file storage (submissions, test cases)     │
│  Celery - Asynchronous task processing (scoring)           │
└─────────────────────────────────────────────────────────────┘
```

### Key Services

| Service | Role | Port | Status |
|---------|------|------|--------|
| **Frontend** | Web UI | 3001 | 🟢 Running |
| **FastAPI** | REST API | 8000 | 🟢 Running |
| **PostgreSQL** | Data Storage | 5432 | 🟢 Running |
| **Redis** | Cache & Queue | 6379 | 🟢 Running |
| **MinIO** | File Storage | 9000 | 🟢 Running |
| **Celery** | Task Queue | - | ⏳ Phase 2 |

---

## 📁 Project Structure

```
open-challenges/
├── 📂 backend/                          # FastAPI Backend (Phase 1 ✅)
│   ├── app/
│   │   ├── core/
│   │   │   ├── config.py               # Environment configuration
│   │   │   └── security.py             # JWT & password utilities
│   │   ├── api/v1/
│   │   │   ├── api.py                  # Router initialization
│   │   │   └── endpoints/              # API endpoints (Phase 2+)
│   │   ├── models/
│   │   │   └── base.py                 # SQLAlchemy models (8 models)
│   │   ├── schemas/
│   │   │   └── base.py                 # Pydantic validation schemas
│   │   ├── crud/                       # Database operations (Phase 2+)
│   │   ├── services/                   # Business logic (Phase 2+)
│   │   ├── tasks/                      # Celery tasks (Phase 4+)
│   │   └── main.py                     # FastAPI entry point
│   ├── tests/
│   │   ├── conftest.py                 # Test fixtures
│   │   └── test_health.py              # Health check tests
│   ├── requirements.txt                # Python dependencies
│   ├── docker-compose.dev.yml          # Development Docker setup
│   ├── docker-compose.yml              # Production Docker setup
│   ├── README.md                       # Backend documentation
│   └── STARTUP_GUIDE.md                # Backend setup instructions
│
├── 📂 frontend/                         # Next.js Frontend (Phase 1 ✅)
│   ├── src/
│   │   ├── app/
│   │   │   ├── (auth)/                 # Authentication pages
│   │   │   │   ├── login/              # Login page
│   │   │   │   └── register/           # Registration page
│   │   │   ├── challenges/             # Challenge pages
│   │   │   │   ├── page.tsx            # Challenge list
│   │   │   │   ├── [id]/               # Challenge detail
│   │   │   │   ├── create/             # Create challenge
│   │   │   │   └── [id]/submit/        # Submit solution
│   │   │   ├── leaderboard/            # Leaderboard page
│   │   │   └── layout.tsx              # Root layout
│   │   ├── components/
│   │   │   ├── auth/                   # Auth components
│   │   │   ├── challenges/             # Challenge components
│   │   │   ├── leaderboard/            # Leaderboard components
│   │   │   ├── submissions/            # Submission components
│   │   │   └── layout/                 # Layout components
│   │   ├── types/                      # TypeScript types
│   │   └── utils/                      # Utility functions
│   ├── package.json                    # npm dependencies
│   ├── tailwind.config.ts              # Tailwind CSS config
│   ├── tsconfig.json                   # TypeScript config
│   ├── README.md                       # Frontend documentation
│   └── Dockerfile                      # Frontend Docker setup
│
├── 📄 Documentation Files (90KB)
│   ├── ARCHITECTURE_DIAGRAMS.md         # System diagrams
│   ├── SYSTEM_ARCHITECTURE.md           # Detailed architecture
│   ├── BACKEND_IMPLEMENTATION_PLAN.md   # 7-phase backend plan
│   ├── BACKEND_API_CONTRACT.md          # API specification
│   ├── BACKEND_QUICK_START.md           # Backend setup
│   ├── START_HERE_BACKEND.md            # Backend overview
│   ├── BACKEND_BUILD_STATUS.md          # Build status
│   ├── FRONTEND_IMPLEMENTATION.md       # Frontend details
│   └── DOCUMENTATION_INDEX.md           # Documentation hub
│
└── 📊 Configuration
    ├── .env.example                     # Environment template
    ├── .gitignore                       # Git ignore rules
    └── LICENSE                          # MIT License
```

---

## 🚀 Quick Start

### Prerequisites
- **Docker** & **Docker Compose** (recommended)
- **Python 3.11+** (for local backend)
- **Node.js 18+** (for frontend)
- **Git**

### Option 1: Run with Docker (Recommended)

```bash
# Clone and navigate to project
git clone <repo>
cd open-challenges

# Start all services
cd backend
docker-compose -f docker-compose.dev.yml up -d

# Install frontend dependencies
cd ../frontend
npm install

# Start frontend (in another terminal)
npm run dev
```

### Option 2: Run Locally (No Docker)

#### Backend Setup
```bash
cd backend

# Create virtual environment
python3 -m venv venv
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Set environment variables
cp .env.example .env.development
# Edit .env.development with your database settings

# Start PostgreSQL and Redis locally
# (See backend/STARTUP_GUIDE.md for detailed instructions)

# Run migrations and start server
python -m uvicorn app.main:app --reload
```

#### Frontend Setup
```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

### Access Points

| Component | URL | Notes |
|-----------|-----|-------|
| **Frontend** | http://localhost:3001 | Web application |
| **API Docs** | http://localhost:8000/api/docs | Swagger UI |
| **API ReDoc** | http://localhost:8000/api/redoc | ReDoc documentation |
| **Health Check** | http://localhost:8000/health | Backend health |
| **MinIO Console** | http://localhost:9001 | File storage UI (minio/minioadmin) |

---

## 📚 API Documentation

### Base URL
```
http://localhost:8000/api/v1
```

### Interactive Documentation
- **Swagger UI**: http://localhost:8000/api/docs
- **ReDoc**: http://localhost:8000/api/redoc

### Core Endpoints (Phase 1-3)

#### Authentication (Phase 2)
```
POST   /auth/register          Register new user
POST   /auth/login             Login user
POST   /auth/refresh           Refresh access token
GET    /auth/me                Get current user info
```

#### Challenges (Phase 3)
```
GET    /challenges             List all challenges
POST   /challenges             Create new challenge
GET    /challenges/{id}        Get challenge details
PUT    /challenges/{id}        Update challenge
DELETE /challenges/{id}        Delete challenge
GET    /challenges/{id}/submit Submit page data
```

#### Submissions (Phase 4)
```
POST   /submissions            Submit solution
GET    /submissions/{id}       Get submission details
GET    /submissions            List user submissions
GET    /submissions/{id}/score Get submission score
```

#### Leaderboard (Phase 5)
```
GET    /leaderboard            Global leaderboard
GET    /leaderboard/{challenge_id}  Challenge leaderboard
```

#### Health & Status
```
GET    /health                 Service health check
GET    /status                 System status
```

### Example API Call

```bash
# Get API documentation
curl http://localhost:8000/api/docs

# Health check
curl http://localhost:8000/health

# Login
curl -X POST http://localhost:8000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password123"}'
```

---

## ✨ Features

### Phase 1: Foundation ✅
- [x] Frontend UI components (Auth, Challenges, Leaderboard)
- [x] Backend API foundation
- [x] Database schema (8 models)
- [x] Docker configuration
- [x] Health checks & documentation

### Phase 2: Authentication (Next)
- [ ] User registration & login
- [ ] JWT token management
- [ ] Password reset flow
- [ ] Email verification
- [ ] OAuth2 integration

### Phase 3: Challenge Management
- [ ] Create/edit challenges
- [ ] Challenge categories & filters
- [ ] Difficulty levels
- [ ] Time limits & constraints

### Phase 4: Submissions & Scoring
- [ ] File upload handling
- [ ] Submission validation
- [ ] Automated test execution
- [ ] Score calculation
- [ ] Celery task processing

### Phase 5: Leaderboard
- [ ] Real-time rankings
- [ ] Team standings
- [ ] Historical scores
- [ ] Performance analytics

### Phase 6: Advanced Features
- [ ] Real-time notifications
- [ ] Comment & discussion
- [ ] Solution visibility
- [ ] Code quality metrics

### Phase 7: DevOps & Optimization
- [ ] CI/CD pipeline
- [ ] Performance optimization
- [ ] Monitoring & alerting
- [ ] Backup & recovery

---

## 🔧 Development

### Backend Development

#### Run tests
```bash
cd backend
pytest tests/ -v                 # Run all tests
pytest tests/ --cov=app          # With coverage
```

#### Code quality
```bash
# Format code
black app/

# Lint
flake8 app/

# Type checking
mypy app/

# Import sorting
isort app/
```

#### Create new endpoint
```bash
# 1. Create schema in app/schemas/base.py
# 2. Create model if needed in app/models/base.py
# 3. Create CRUD in app/crud/
# 4. Create service in app/services/
# 5. Create endpoint in app/api/v1/endpoints/
# 6. Test with pytest
```

#### Database migrations
```bash
# Generate migration
alembic revision --autogenerate -m "description"

# Apply migration
alembic upgrade head

# Rollback
alembic downgrade -1
```

### Frontend Development

#### Run development server
```bash
cd frontend
npm run dev           # Start dev server on port 3001
npm run build         # Build for production
npm run lint          # Lint code
```

#### Create new page
```bash
# 1. Create file in src/app/[route]/page.tsx
# 2. Add components in src/components/
# 3. Add types in src/types/index.ts
# 4. Update utils if needed
```

#### Type checking
```bash
# TypeScript check
npx tsc --noEmit

# Component check
npm run lint
```

---

## 🧪 Testing

### Backend Tests

```bash
cd backend

# Run health check tests
pytest tests/test_health.py -v

# Run all tests
pytest tests/ -v

# With coverage
pytest tests/ --cov=app --cov-report=html

# Watch mode (requires pytest-watch)
ptw tests/
```

### Frontend Tests (Ready for Phase 2)

```bash
cd frontend

# Unit tests
npm test

# E2E tests
npm run test:e2e

# Coverage
npm test -- --coverage
```

---

## 🐳 Docker & Deployment

### Development Deployment

```bash
# Start services
cd backend
docker-compose -f docker-compose.dev.yml up -d

# View logs
docker-compose -f docker-compose.dev.yml logs -f

# Stop services
docker-compose -f docker-compose.dev.yml down
```

### Production Deployment

```bash
# Build images
docker-compose build

# Start services
docker-compose up -d

# Stop services
docker-compose down
```

### Environment Configuration

Create `.env` file in backend directory:
```env
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/open_challenges

# Redis
REDIS_URL=redis://localhost:6379

# JWT
JWT_SECRET_KEY=your-secret-key-here
JWT_ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
REFRESH_TOKEN_EXPIRE_DAYS=7

# Email
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password

# MinIO
MINIO_ENDPOINT=localhost:9000
MINIO_ACCESS_KEY=minioadmin
MINIO_SECRET_KEY=minioadmin
```

---

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'Add amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

### Development Guidelines

- Follow PEP 8 (Python) and ESLint (JavaScript)
- Write tests for new features
- Update documentation
- Use meaningful commit messages
- Keep PRs focused and reasonably sized

### Code Style

**Backend (Python)**
```python
# Use type hints
def create_user(email: str, password: str) -> UserResponse:
    pass

# Use descriptive names
user_repository = UserRepository()

# Document with docstrings
"""Create a new user with email and password."""
```

**Frontend (TypeScript)**
```typescript
// Use interfaces for props
interface LoginProps {
  onSuccess: (token: string) => void;
  isLoading: boolean;
}

// Use meaningful component names
const LoginFormComponent: React.FC<LoginProps> = ({ onSuccess }) => {
  return <form>...</form>;
};
```

---

## 📊 Project Timeline

| Phase | Focus | Duration | Status |
|-------|-------|----------|--------|
| 1 | Foundation & Infrastructure | 1 week | ✅ Complete |
| 2 | Authentication & Authorization | 1-2 weeks | 🔄 Next |
| 3 | Challenge Management | 2 weeks | ⏳ Planned |
| 4 | Submissions & Scoring | 3 weeks | ⏳ Planned |
| 5 | Leaderboard & Analytics | 2 weeks | ⏳ Planned |
| 6 | Real-time Features | 1.5 weeks | ⏳ Planned |
| 7 | DevOps & Optimization | 2 weeks | ⏳ Planned |
| **Total** | **Complete System** | **12-16 weeks** | **On Schedule** |

---

## 📖 Documentation

### Main Documents
- **[SYSTEM_ARCHITECTURE.md](SYSTEM_ARCHITECTURE.md)** - Detailed architecture
- **[BACKEND_IMPLEMENTATION_PLAN.md](BACKEND_IMPLEMENTATION_PLAN.md)** - Backend roadmap
- **[BACKEND_API_CONTRACT.md](BACKEND_API_CONTRACT.md)** - API specification
- **[FRONTEND_IMPLEMENTATION.md](FRONTEND_IMPLEMENTATION.md)** - Frontend details
- **[DOCUMENTATION_INDEX.md](DOCUMENTATION_INDEX.md)** - Complete doc index

### Getting Started
- **[backend/STARTUP_GUIDE.md](backend/STARTUP_GUIDE.md)** - Backend setup
- **[backend/README.md](backend/README.md)** - Backend overview
- **[frontend/README.md](frontend/README.md)** - Frontend overview

---

## 🐛 Troubleshooting

### Common Issues

**Issue: Docker daemon not running**
```bash
# macOS
open /Applications/Docker.app

# Linux
sudo systemctl start docker
```

**Issue: Port already in use**
```bash
# Find and kill process using port 3001
lsof -i :3001
kill -9 <PID>

# Or use different port
npm run dev -- -p 3002
```

**Issue: Database connection failed**
```bash
# Check PostgreSQL is running
docker-compose -f docker-compose.dev.yml ps

# Check logs
docker-compose -f docker-compose.dev.yml logs postgres
```

**Issue: Dependencies not installed**
```bash
# Backend
cd backend
pip install --upgrade -r requirements.txt

# Frontend
cd frontend
npm install
npm ci  # Clean install
```

---

## 📞 Support

- **Documentation**: See [DOCUMENTATION_INDEX.md](DOCUMENTATION_INDEX.md)
- **Issues**: Open an issue on GitHub
- **Discussions**: Use GitHub Discussions
- **Email**: support@open-challenges.dev

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **FastAPI** - Modern Python web framework
- **Next.js** - React framework for production
- **PostgreSQL** - Reliable relational database
- **Redis** - In-memory data structure store
- **Docker** - Containerization platform
- **Tailwind CSS** - Utility-first CSS framework

---

## 📈 Project Status

**Current Phase**: 1️⃣ Foundation Complete ✅  
**Overall Progress**: 0-18% (Phase 1 of 7)  
**Timeline**: On Schedule 📅  
**Last Updated**: March 25, 2026  

### Phase 1 Completion Statistics
- ✅ 27 files created
- ✅ 755+ lines of production code
- ✅ 8 database models
- ✅ 20+ validation schemas
- ✅ 100% health checks passing
- ✅ Full tests framework ready
- ✅ Complete documentation (90KB)

---

## 🎯 Next Milestones

1. **Phase 2 START** (Week 1-2)
   - User registration & login
   - JWT token management
   - Email verification

2. **Phase 3** (Week 3-4)
   - Challenge CRUD operations
   - Category & filtering system
   - Difficulty levels

3. **Phase 4** (Week 5-7)
   - File upload handling
   - Automated scoring system
   - Celery task processing

---

**Built with ❤️ by the Open Challenges Team**

For the latest updates and more details, visit our [Documentation Hub](DOCUMENTATION_INDEX.md).
