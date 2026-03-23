# Open Challenges Platform - System Design Document

## 1. Project Overview

Trang web **Open Challenges** là một nền tảng cho phép tổ chức và quản lý các cuộc thi AI/Machine Learning, hỗ trợ:
- Trình bày thông tin chi tiết về các thử thách (challenge)
- Hiển thị bảng xếp hạng (leaderboard) các đội tham gia
- Cho phép đội thi submit kết quả/mô hình
- Cấu hình metrics tính toán điểm số tự động

---

## 2. Technology Stack

### Backend
- **Language**: Python 3.10+
- **Framework**: FastAPI
- **Database**: PostgreSQL
- **Cache**: Redis
- **Task Queue**: Celery (cho async jobs - đánh giá mô hình)
- **Message Queue**: Apache Kafka

### Frontend
- **Framework**: Next.js 14+ (React Server Components)
- **UI Library**: Material-UI, Shadcn, hoặc Ant Design
- **State Management**: Redux Toolkit hoặc Zustand
- **Styling**: Tailwind CSS

### DevOps
- **Containerization**: Docker & Docker Compose
- **Hosting**: AWS/GCP/Azure
- **CI/CD**: GitHub Actions

---

## 3. System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Frontend (Next.js 14+)                    │
│  - Challenge List   - Challenge Detail  - Leaderboard UI    │
│  - Submit Page      - Metrics Config    - Dashboard         │
└────────────────────┬────────────────────────────────────────┘
                     │ REST API / WebSocket
┌────────────────────▼────────────────────────────────────────┐
│                    API Gateway / Load Balancer               │
└────────────────────┬────────────────────────────────────────┘
                     │
┌────────────────────▼────────────────────────────────────────┐
│                      FastAPI Backend                        │
│  - Challenge Service    - Auth Service                       │
│  - Submission Service   - Leaderboard Service               │
│  - Metrics Service      - User Service                      │
└────────────────────┬────────────────────────────────────────┘
                     │
        ┌────────────┼────────────┬────────────┬──────────┐
        │            │            │            │          │
        ▼            ▼            ▼            ▼          ▼
    PostgreSQL    Redis       Celery      MinIO/S3    Kafka
    (Database)   (Cache)    (Task Queue) (Storage) (Message Queue)
```

---

## 4. Database Schema

### Core Tables

```sql

-- Users & Authentication
users
  id (PK)
  email (UNIQUE)
  username (UNIQUE)
  password_hash
  first_name
  last_name
  avatar_url
  is_active
  created_at
  updated_at

-- Teams
teams
  id (PK)
  name
  description
  leader_id (FK: users)
  logo_url
  created_at
  updated_at

team_members
  id (PK)
  team_id (FK: teams)
  user_id (FK: users)
  role (ADMIN, MEMBER)
  joined_at

-- Challenges
challenges
  id (PK)
  title
  description
  problem_statement (TEXT/Markdown)
  dataset_url / dataset_file_id (FK: files)
  status (DRAFT, ACTIVE, CLOSED, ARCHIVED)
  start_date
  end_date
  image_url
  difficulty_level (EASY, MEDIUM, HARD)
  prize_pool
  created_by (FK: users)
  created_at
  updated_at

-- Metrics Configuration
metrics
  id (PK)
  challenge_id (FK: challenges)
  name (e.g., "Accuracy", "F1 Score", "AUC")
  metric_type (SCORING_METRIC, CUSTOM_METRIC)
  formula / calculation_function
  weight (for weighted score)
  is_primary (cho leaderboard chính)
  min_value
  max_value
  direction (HIGHER_IS_BETTER, LOWER_IS_BETTER)
  created_at

-- Submissions
submissions
  id (PK)
  challenge_id (FK: challenges)
  team_id (FK: teams)
  user_id (FK: users)
  submission_file_id (FK: files)
  submission_format (JSON, CSV, PKL, H5, etc.)
  status (PENDING, PROCESSING, SUCCESS, FAILED)
  submitted_at
  processed_at
  error_message
  notes
  is_latest (cho tracking submission mới nhất)

-- Scores & Results
submission_scores
  id (PK)
  submission_id (FK: submissions)
  metric_id (FK: metrics)
  score_value
  raw_output
  calculated_at

overall_scores
  id (PK)
  submission_id (FK: submissions)
  challenge_id (FK: challenges)
  team_id (FK: teams)
  overall_score (weighted average)
  rank
  calculated_at

-- Files Storage
files
  id (PK)
  filename
  file_type (DATASET, SUBMISSION, MODEL, etc.)
  file_size
  storage_path
  s3_key / cloud_storage_key
  checksum
  uploaded_by (FK: users)
  uploaded_at
  metadata (JSON)

-- Leaderboard (Materialized View / Cache)
leaderboards
  id (PK)
  challenge_id (FK: challenges)
  team_id (FK: teams)
  team_name
  overall_score
  primary_metric_score
  rank
  submission_count
  last_submission_at
  updated_at

```

---

## 5. File System Structure

```
open-challenges/
│
├── backend/                          # Backend service
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py                  # FastAPI app entry point
│   │   ├── config.py                # Configuration (env vars, settings)
│   │   ├── database.py              # Database setup + session
│   │   │
│   │   ├── models/                  # SQLAlchemy models
│   │   │   ├── __init__.py
│   │   │   ├── user.py
│   │   │   ├── team.py
│   │   │   ├── challenge.py
│   │   │   ├── metric.py
│   │   │   ├── submission.py
│   │   │   └── file.py
│   │   │
│   │   ├── schemas/                 # Pydantic schemas (request/response)
│   │   │   ├── __init__.py
│   │   │   ├── user.py
│   │   │   ├── team.py
│   │   │   ├── challenge.py
│   │   │   ├── metric.py
│   │   │   ├── submission.py
│   │   │   └── leaderboard.py
│   │   │
│   │   ├── api/                     # API routes
│   │   │   ├── __init__.py
│   │   │   ├── v1/
│   │   │   │   ├── __init__.py
│   │   │   │   ├── endpoints/
│   │   │   │   │   ├── __init__.py
│   │   │   │   │   ├── users.py
│   │   │   │   │   ├── teams.py
│   │   │   │   │   ├── challenges.py
│   │   │   │   │   ├── submissions.py
│   │   │   │   │   ├── metrics.py
│   │   │   │   │   ├── leaderboards.py
│   │   │   │   │   └── auth.py
│   │   │   │   └── router.py        # Combine all routes
│   │   │   └── dependencies.py      # Shared dependencies, auth
│   │   │
│   │   ├── services/                # Business logic layers
│   │   │   ├── __init__.py
│   │   │   ├── user_service.py
│   │   │   ├── team_service.py
│   │   │   ├── challenge_service.py
│   │   │   ├── submission_service.py
│   │   │   ├── metrics_service.py   # Calculate scores
│   │   │   ├── leaderboard_service.py
│   │   │   └── file_service.py      # Upload/download files
│   │   │
│   │   ├── tasks/                   # Async tasks (Celery)
│   │   │   ├── __init__.py
│   │   │   ├── celery_app.py
│   │   │   ├── evaluate_submission.py
│   │   │   ├── calculate_scores.py
│   │   │   └── update_leaderboard.py
│   │   │
│   │   ├── utils/                   # Utilities
│   │   │   ├── __init__.py
│   │   │   ├── auth.py              # JWT, password hashing
│   │   │   ├── validators.py
│   │   │   ├── pagination.py
│   │   │   └── exceptions.py        # Custom exceptions
│   │   │
│   │   ├── evaluators/              # Evaluation logic
│   │   │   ├── __init__.py
│   │   │   ├── base_evaluator.py
│   │   │   ├── classification_evaluator.py
│   │   │   ├── regression_evaluator.py
│   │   │   ├── custom_evaluator.py
│   │   │   └── metric_calculator.py
│   │   │
│   │   └── core/                    # Core functionality
│   │       ├── __init__.py
│   │       ├── security.py
│   │       ├── logging.py
│   │       └── constants.py
│   │
│   ├── migrations/                  # Alembic migrations
│   │   ├── env.py
│   │   ├── script.py.mako
│   │   └── versions/
│   │
│   ├── tests/                       # Unit & integration tests
│   │   ├── __init__.py
│   │   ├── conftest.py
│   │   ├── test_auth.py
│   │   ├── test_challenges.py
│   │   ├── test_submissions.py
│   │   └── test_metrics.py
│   │
│   ├── requirements.txt             # Python dependencies
│   ├── Dockerfile
│   ├── .env.example
│   └── README.md
│
├── frontend/                         # Next.js frontend
│   ├── public/                      # Static assets
│   │   ├── images/
│   │   ├── icons/
│   │   └── fonts/
│   │
│   ├── src/
│   │   │
│   │   ├── app/                     # App directory (Next.js 13+)
│   │   │   ├── layout.tsx           # Root layout
│   │   │   ├── page.tsx             # Home page
│   │   │   ├── (auth)/              # Auth routes group
│   │   │   │   ├── login/
│   │   │   │   ├── register/
│   │   │   │   └── layout.tsx
│   │   │   ├── challenges/          # Challenge routes
│   │   │   │   ├── page.tsx
│   │   │   │   ├── [id]/
│   │   │   │   │   ├── page.tsx
│   │   │   │   │   └── submit/
│   │   │   │   └── layout.tsx
│   │   │   ├── leaderboard/         # Leaderboard page
│   │   │   │   ├── [challengeId]/
│   │   │   │   │   └── page.tsx
│   │   │   │   └── page.tsx
│   │   │   ├── dashboard/           # Admin dashboard
│   │   │   │   ├── page.tsx
│   │   │   │   ├── metrics/
│   │   │   │   └── layout.tsx
│   │   │   ├── api/                 # API routes (route handlers)
│   │   │   │   ├── auth/
│   │   │   │   ├── challenges/
│   │   │   │   ├── submissions/
│   │   │   │   └── leaderboard/
│   │   │   ├── globals.css
│   │   │   └── error.tsx
│   │   │
│   │   ├── components/              # Reusable components
│   │   │   ├── layout/
│   │   │   │   ├── Header.tsx
│   │   │   │   ├── Sidebar.tsx
│   │   │   │   └── Footer.tsx
│   │   │   ├── challenges/
│   │   │   │   ├── ChallengeList.tsx
│   │   │   │   ├── ChallengeCard.tsx
│   │   │   │   ├── ChallengeDetail.tsx
│   │   │   │   └── ChallengeForm.tsx
│   │   │   ├── submissions/
│   │   │   │   ├── SubmissionForm.tsx
│   │   │   │   ├── SubmissionHistory.tsx
│   │   │   │   └── SubmissionDetail.tsx
│   │   │   ├── leaderboard/
│   │   │   │   ├── LeaderboardTable.tsx
│   │   │   │   ├── LeaderboardFilters.tsx
│   │   │   │   └── TeamRankCard.tsx
│   │   │   ├── metrics/
│   │   │   │   ├── MetricConfig.tsx
│   │   │   │   ├── MetricForm.tsx
│   │   │   │   └── MetricPreview.tsx
│   │   │   ├── auth/
│   │   │   │   ├── LoginForm.tsx
│   │   │   │   ├── RegisterForm.tsx
│   │   │   │   └── ProtectedRoute.tsx
│   │   │   └── common/
│   │   │       ├── Button.tsx
│   │   │       ├── Modal.tsx
│   │   │       ├── Loading.tsx
│   │   │       └── Toast.tsx
│   │   │
│   │   ├── contexts/                # React Context (auth, theme)
│   │   │   ├── AuthContext.tsx
│   │   │   └── ThemeContext.tsx
│   │   │
│   │   ├── store/                   # Redux/state management
│   │   │   ├── index.ts
│   │   │   ├── slices/
│   │   │   │   ├── authSlice.ts
│   │   │   │   ├── challengeSlice.ts
│   │   │   │   ├── submissionSlice.ts
│   │   │   │   └── leaderboardSlice.ts
│   │   │   └── hooks.ts
│   │   │
│   │   ├── services/                # API client services
│   │   │   ├── api.ts              # Axios/Fetch wrapper
│   │   │   ├── authService.ts
│   │   │   ├── challengeService.ts
│   │   │   ├── submissionService.ts
│   │   │   ├── leaderboardService.ts
│   │   │   └── metricsService.ts
│   │   │
│   │   ├── hooks/                   # Custom React hooks
│   │   │   ├── useAuth.ts
│   │   │   ├── useFetch.ts
│   │   │   ├── usePagination.ts
│   │   │   └── useForm.ts
│   │   │
│   │   ├── utils/                   # Utility functions
│   │   │   ├── formatters.ts
│   │   │   ├── validators.ts
│   │   │   ├── constants.ts
│   │   │   └── helpers.ts
│   │   │
│   │   └── types/                   # TypeScript types
│   │       ├── index.ts
│   │       ├── models.ts
│   │       ├── api.ts
│   │       └── forms.ts
│   │
│   ├── package.json
│   ├── next.config.ts
│   ├── tsconfig.json
│   ├── tailwind.config.ts
│   ├── postcss.config.js
│   ├── .eslintrc.json
│   ├── Dockerfile
│   ├── .env.example
│   ├── .env.local.example
│   └── README.md
│
├── docker-compose.yml               # Docker compose for local dev
├── README.md                         # Project documentation
├── CONTRIBUTING.md
└── .gitignore

```

---

## 6. Core Features & API Endpoints

### 6.1 Authentication & User Management

```
POST   /api/v1/auth/register          - Register new user
POST   /api/v1/auth/login             - Login user
POST   /api/v1/auth/refresh           - Refresh JWT token
GET    /api/v1/users/{user_id}        - Get user profile
PUT    /api/v1/users/{user_id}        - Update user profile
GET    /api/v1/users/me               - Get current user
```

### 6.2 Team Management

```
POST   /api/v1/teams                  - Create team
GET    /api/v1/teams                  - List teams
GET    /api/v1/teams/{team_id}        - Get team details
PUT    /api/v1/teams/{team_id}        - Update team
DELETE /api/v1/teams/{team_id}        - Delete team
POST   /api/v1/teams/{team_id}/members - Add team member
DELETE /api/v1/teams/{team_id}/members/{user_id} - Remove member
GET    /api/v1/teams/{team_id}/members - List team members
```

### 6.3 Challenges

```
GET    /api/v1/challenges              - List all challenges
GET    /api/v1/challenges/{challenge_id} - Get challenge details
POST   /api/v1/challenges              - Create challenge (Admin)
PUT    /api/v1/challenges/{challenge_id} - Update challenge (Admin)
DELETE /api/v1/challenges/{challenge_id} - Delete challenge (Admin)
GET    /api/v1/challenges/{challenge_id}/dataset - Download dataset
```

### 6.4 Submissions

```
POST   /api/v1/submissions             - Submit solution file
GET    /api/v1/submissions             - List submissions
GET    /api/v1/submissions/{submission_id} - Get submission details
GET    /api/v1/challenges/{challenge_id}/submissions - List submissions of a challenge
DELETE /api/v1/submissions/{submission_id} - Delete submission
GET    /api/v1/submissions/{submission_id}/download - Download submission
```

### 6.5 Metrics Configuration

```
GET    /api/v1/challenges/{challenge_id}/metrics - List metrics
POST   /api/v1/challenges/{challenge_id}/metrics - Create metric
PUT    /api/v1/metrics/{metric_id}     - Update metric
DELETE /api/v1/metrics/{metric_id}     - Delete metric
POST   /api/v1/metrics/{metric_id}/test - Test metric configuration
GET    /api/v1/metrics/{metric_id}/formula - Get metric formula details
```

### 6.6 Leaderboard

```
GET    /api/v1/leaderboards/{challenge_id} - Get leaderboard
GET    /api/v1/leaderboards/{challenge_id}?team_id={team_id} - Get team rank
GET    /api/v1/leaderboards/{challenge_id}?sort=score&order=desc - Sorted leaderboard
WebSocket: /ws/leaderboard/{challenge_id} - Real-time leaderboard updates
```

---

## 7. Key Features Details

### 7.1 Challenge Management

```
Challenge Status Flow:
DRAFT → ACTIVE (auto on start_date) → CLOSED (auto on end_date) → ARCHIVED

Challenge Information:
- Title, Description, Problem Statement
- Dataset (upload or external link)
- Start/End dates
- Difficulty level (Easy, Medium, Hard)
- Prize pool
- Tags/Categories
```

### 7.2 Submission System

```
Submission Workflow:
1. User submits solution (CSV, JSON, Model file, etc.)
2. System validates file format
3. Background task evaluates submission
4. Calculate scores using configured metrics
5. Update leaderboard
6. Notify team with results

Supported Formats:
- CSV (predictions with probabilities)
- JSON (structured predictions)
- PKL/H5 (pre-trained models)
- Custom formats (configurable)
```

### 7.3 Metrics Configuration

```
Built-in Metrics:
- Classification: Accuracy, Precision, Recall, F1, ROC-AUC
- Regression: MAE, RMSE, R², MAPE
- Custom: User-defined Python functions

Metric Properties:
- Name & Description
- Formula/Calculation function
- Weight (for weighted average)
- Min/Max bounds
- Direction (higher/lower is better)
- Primary metric (for main ranking)

Score Calculation:
overall_score = σ(weight_i * normalized_score_i)
normalized_score = (score - min) / (max - min)
```

### 7.4 Leaderboard

```
Leaderboard Display:
- Rank | Team Name | Overall Score | Metric 1 | Metric 2 | ... | Submission Count | Last Submission

Features:
- Real-time updates via WebSocket
- Filter by team, metric
- Sort by score, submission date
- Display score history (visualization)
- Download leaderboard CSV
```

---

## 8. Data Flow Diagrams

### Submission Processing Flow

```
User Submit
    ↓
Validate File Format
    ↓
Store File in S3/MinIO
    ↓
Create Submission Record (PENDING)
    ↓
Queue Evaluation Task (Celery)
    ↓
[Async] Evaluate Submission
    ↓
[Async] Calculate Scores based on Metrics
    ↓
[Async] Update Leaderboard
    ↓
Mark Submission as SUCCESS
    ↓
Notify Team via WebSocket/Email
```

### Metrics Configuration Flow

```
Admin Configures Metric
    ↓
Define Name, Formula, Weights
    ↓
Test with Sample Data
    ↓
Save Metric Configuration
    ↓
On next Submission:
    ├─ Fetch Metric Config
    ├─ Evaluate Ground Truth vs Prediction
    ├─ Apply Formula
    └─ Store Score
```

---

## 9. Environment Variables

### Backend (.env)

```bash
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/open_challenges
SQLALCHEMY_ECHO=true

# Redis
REDIS_URL=redis://localhost:6379/0

# JWT
SECRET_KEY=your-secret-key-here
JWT_ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
REFRESH_TOKEN_EXPIRE_DAYS=7

# Email
SMTP_SERVER=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-password

# File Storage
STORAGE_TYPE=s3  # or 'local', 'minio'
AWS_ACCESS_KEY_ID=your-key
AWS_SECRET_ACCESS_KEY=your-secret
AWS_BUCKET_NAME=open-challenges
AWS_REGION=us-east-1

# Celery
CELERY_BROKER_URL=kafka://localhost:9092
CELERY_RESULT_BACKEND=redis://localhost:6379/0

# Kafka
KAFKA_BOOTSTRAP_SERVERS=localhost:9092
KAFKA_TOPIC_SUBMISSIONS=submissions_topic
KAFKA_TOPIC_SCORES=scores_topic
KAFKA_TOPIC_LEADERBOARD=leaderboard_topic

# Server
DEBUG=false
LOG_LEVEL=INFO
```

### Frontend (.env.local)

```bash
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000/api/v1
NEXT_PUBLIC_WS_URL=ws://localhost:8000/ws
NEXT_PUBLIC_APP_NAME=Open Challenges
NEXT_PUBLIC_ENABLE_ANALYTICS=true
```

---

## 10. Development Setup

### Local Setup with Docker Compose

```bash
# Clone repository
git clone <repo-url>
cd open-challenges

# Copy environment files
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env

# Start services
docker-compose up -d

# Run migrations
docker-compose exec backend alembic upgrade head

# Access
- Frontend: http://localhost:3000
- Backend: http://localhost:8000
- API Docs: http://localhost:8000/docs
```

### Directory Initialization

```bash
# Backend setup
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
alembic upgrade head

# Frontend setup
cd frontend
npm install
npm run dev
```

---

## 11. Security Considerations

- **Authentication**: JWT tokens + Refresh token rotation
- **Authorization**: Role-based access control (RBAC) - Admin, Team Lead, Member
- **File Validation**: Scan uploads for malware, validate formats
- **Data Protection**: Encrypt sensitive data at rest, use HTTPS in production
- **Rate Limiting**: API rate limiting to prevent abuse
- **CORS**: Configure proper CORS headers
- **Input Validation**: Sanitize all user inputs

---

## 12. Performance Optimization

- **Caching**: Use Redis for leaderboard, challenge list caching
- **Pagination**: Implement cursor-based pagination for large datasets
- **Async Processing**: Use Celery for long-running evaluation tasks
- **Database Indexing**: Index on challenge_id, team_id, submitted_at
- **CDN**: Serve static assets via CDN
- **Connection Pooling**: Database connection pooling

---

## 13. Testing Strategy

### Unit Tests
- Service layer (challenge_service, metrics_service, etc.)
- Utility functions (validators, formatters)
- Model validations

### Integration Tests
- API endpoints (auth, submissions, leaderboard)
- Database operations
- File upload/download

### E2E Tests
- User registration → Team creation → Submit → View results
- Admin metric config → Evaluation

---

## 14. Deployment

### Cloud Deployment Steps
1. Build Docker images for backend & frontend
2. Push to container registry (ECR, GCR, Docker Hub)
3. Deploy to Kubernetes/ECS/App Engine
4. Setup PostgreSQL managed database
5. Configure Redis cache
6. Setup S3 bucket for file storage
7. Configure CI/CD pipeline
8. Setup monitoring & logging

---

## 15. Future Enhancements

- [x] Multi-language support (i18n)
- [ ] Real-time collaborative submissions
- [ ] ML model versioning & experiment tracking
- [ ] Advanced visualization & charts
- [ ] Integration with MLflow/Weights & Biases
- [ ] Mobile app (React Native)
- [ ] API plugin system for custom evaluators
- [ ] Team discussion forums per challenge

---

**Document Version**: 1.0  
**Last Updated**: March 2026
