# Open Challenges Platform - System Architecture

## 1. System Overview

The Open Challenges Platform is a comprehensive web application for organizing, managing, and executing AI/ML competitions. It supports challenge creation, team management, submission handling, and real-time leaderboard updates.

### Key Features
- 🏆 Challenge Management (Create, Edit, Launch)
- 👥 Team Collaboration & Member Management  
- 📊 Real-time Leaderboard & Metrics
- 🎯 Flexible Scoring System with Custom Metrics
- 📤 Automated Submission Processing
- 🔐 Role-based Access Control
- 📈 Performance Analytics & Insights

---

## 2. Architecture Diagram

```mermaid
graph TB
    subgraph Client["Client Layer (Next.js Frontend)"]
        UI["React Components"]
        State["State Management"]
        Auth["Auth Service"]
    end
    
    subgraph API["API Layer (FastAPI)"]
        Gateway["API Gateway"]
        ChallengeAPI["Challenge Service"]
        TeamAPI["Team Service"]
        SubmissionAPI["Submission Service"]
        LeaderboardAPI["Leaderboard Service"]
        MetricsAPI["Metrics Service"]
    end
    
    subgraph Data["Data Layer"]
        DB["PostgreSQL<br/>Database"]
        Cache["Redis<br/>Cache"]
        Storage["MinIO/S3<br/>Storage"]
    end
    
    subgraph Jobs["Job Processing"]
        Queue["Celery<br/>Task Queue"]
        Events["Kafka<br/>Message Queue"]
    end
    
    Client -->|HTTP/REST| API
    API --> Data
    API --> Jobs
    Jobs -->|Process| Data
    Cache -.->|Cache| Data
    Events -->|Events| Client
```

---

## 3. Frontend Architecture

### Directory Structure

```
frontend/
├── src/
│   ├── app/
│   │   ├── layout.tsx                 # Root layout
│   │   ├── page.tsx                   # Home page
│   │   ├── globals.css               # Tailwind styles
│   │   ├── (auth)/                   # Auth routes
│   │   │   ├── login/
│   │   │   ├── register/
│   │   │   └── layout.tsx
│   │   ├── challenges/               # Challenge routes
│   │   │   ├── page.tsx              # List view
│   │   │   ├── [id]/
│   │   │   │   ├── page.tsx          # Detail view
│   │   │   │   ├── submit/
│   │   │   │   └── submissions/
│   │   ├── leaderboard/
│   │   ├── teams/
│   │   └── dashboard/
│   ├── components/
│   │   ├── challenges/
│   │   │   ├── ChallengeCard.tsx
│   │   │   ├── ChallengeDetail.tsx
│   │   │   ├── ChallengeList.tsx
│   │   │   └── CreateChallengeForm.tsx
│   │   ├── submissions/
│   │   │   └── SubmitSolutionForm.tsx
│   │   ├── leaderboard/
│   │   └── layout/
│   ├── types/
│   │   └── index.ts                  # TypeScript interfaces
│   └── utils/
│       ├── challenges.ts             # Challenge service
│       ├── formatters.ts             # Utility functions
│       └── ...
├── public/                           # Static assets
├── package.json
├── tsconfig.json
├── next.config.js
└── tailwind.config.ts
```

### Page Routes

#### Authentication Routes
```
/login              - User login page
/register           - User registration
/forgot-password    - Password recovery
```

#### Challenge Routes
```
/challenges              - Challenge list with filters
/challenges/[id]        - Challenge detail view
/challenges/[id]/submit - Submit solution form
/challenges/[id]/submissions - Submission history
/challenges/create      - Create new challenge (Admin)
/challenges/[id]/edit   - Edit challenge (Admin)
```

#### Team Routes
```
/teams              - Teams list
/teams/[id]        - Team detail & members
/teams/create      - Create new team
/teams/[id]/join   - Join team request
```

#### Leaderboard Routes
```
/leaderboard           - Global leaderboard
/challenges/[id]/leaderboard - Challenge-specific leaderboard
```

#### Dashboard Routes
```
/dashboard         - User dashboard
/dashboard/teams   - My teams
/dashboard/submissions - My submissions
```

---

## 4. Component Hierarchy

### Challenge Components

```
ChallengeDetail
├── BreadcrumbNav
├── ChallengeBanner
│   ├── ChallengeImage
│   └── QuickInfoSidebar
│       ├── StatusBadge
│       ├── DifficultyBadge
│       └── ActionButtons
├── ChallengeContent
│   ├── ProblemStatement
│   ├── Timeline
│   ├── Resources
│   └── Metrics
├── LeaderboardSection
│   └── LeaderboardTable
└── RelatedChallenges
    └── ChallengeCard[]
```

### Challenge Input Form Components

```
CreateChallengeForm
├── FormHeader
├── BasicInfoSection
│   ├── TitleInput
│   ├── DescriptionInput
│   ├── DifficultySelect
│   ├── ProblemStatementEditor
│   └── ImageUpload
├── TimelineSection
│   ├── StartDatePicker
│   └── EndDatePicker
├── PrizeSection
│   └── PrizePoolInput
├── MetricsSection
│   ├── MetricsList[]
│   ├── AddMetricButton
│   └── MetricEditor
├── ResourcesSection
│   ├── DatasetUpload
│   └── DocumentationLinks
└── FormActions
    ├── PreviewButton
    ├── SaveDraftButton
    └── PublishButton
```

---

## 5. Data Flow - Challenge Creation

```mermaid
sequenceDiagram
    participant User as User
    participant Form as CreateForm
    participant API as FastAPI
    participant DB as PostgreSQL
    participant Cache as Redis
    
    User->>Form: Fill challenge info
    Form->>Form: Validate form
    User->>Form: Click Submit
    Form->>API: POST /challenges
    API->>API: Validate input
    API->>DB: INSERT challenge
    API->>DB: INSERT challenge_metrics
    API->>Cache: Invalidate challenges cache
    API-->>Form: Success response
    Form-->>User: Show confirmation
```

---

## 6. Data Flow - Challenge Submission

```mermaid
sequenceDiagram
    participant User as User/Team
    participant Frontend as Frontend
    participant API as FastAPI
    participant Storage as MinIO/S3
    participant Queue as Celery
    participant Scorer as Scoring Engine
    participant DB as PostgreSQL
    
    User->>Frontend: Upload solution
    Frontend->>API: POST /submissions
    API->>Storage: Store submission file
    API->>DB: Create submission record
    API->>Queue: Queue scoring task
    API-->>Frontend: Submission received
    Frontend-->>User: Show confirmation
    
    Queue->>Scorer: Process submission
    Scorer->>Storage: Download submission
    Scorer->>Scorer: Run evaluation
    Scorer->>DB: Update submission scores
    Scorer->>Queue: Emit result event
    
    Note over Frontend: WebSocket listener
    Frontend->>API: Poll submission status
    API-->>Frontend: Updated status & scores
```

---

## 7. TypeScript Data Models

### Challenge

```typescript
interface Challenge {
  id: string;
  title: string;
  description: string;
  problem_statement: string;
  
  // Status & Visibility
  status: ChallengeStatus;
  
  // Timing
  start_date: string;
  end_date: string;
  
  // Media
  image_url?: string;
  dataset_url?: string;
  
  // Challenge Details
  difficulty_level: ChallengeDifficulty;
  prize_pool?: number;
  
  // Metrics
  participant_count: number;
  submission_count: number;
  
  // Metadata
  created_by: string;
  created_at: string;
  updated_at: string;
}
```

### Metric

```typescript
interface Metric {
  id: string;
  challenge_id: string;
  name: string;
  description?: string;
  
  // Type Configuration
  metric_type: MetricType;
  formula?: string;
  
  // Scoring
  weight: number;
  is_primary: boolean;
  min_value: number;
  max_value: number;
  direction: MetricDirection; // HIGHER_IS_BETTER | LOWER_IS_BETTER
  
  created_at: string;
}
```

### Submission

```typescript
interface Submission {
  id: string;
  challenge_id: string;
  team_id: string;
  user_id: string;
  
  // File
  submission_file_id: string;
  submission_format: string;
  
  // Status
  status: SubmissionStatus;
  submitted_at: string;
  processed_at?: string;
  error_message?: string;
  
  is_latest: boolean;
}

interface SubmissionScore {
  id: string;
  submission_id: string;
  metric_id: string;
  score_value: number;
  calculated_at: string;
  metric: Metric;
}
```

---

## 8. API Endpoints Reference

### Challenge Endpoints

```
GET    /api/v1/challenges              - List challenges (paginated)
POST   /api/v1/challenges              - Create challenge (Admin)
GET    /api/v1/challenges/{id}         - Get challenge detail
PUT    /api/v1/challenges/{id}         - Update challenge (Admin)
DELETE /api/v1/challenges/{id}         - Delete challenge (Admin)
GET    /api/v1/challenges/{id}/metrics - Get challenge metrics
POST   /api/v1/challenges/{id}/metrics - Add metric (Admin)
```

### Submission Endpoints

```
GET    /api/v1/submissions             - List user submissions
POST   /api/v1/submissions             - Submit solution
GET    /api/v1/submissions/{id}        - Get submission detail
GET    /api/v1/submissions/{id}/scores - Get submission scores
```

### Leaderboard Endpoints

```
GET    /api/v1/challenges/{id}/leaderboard - Get challenge leaderboard
GET    /api/v1/leaderboard                 - Global leaderboard
```

---

## 9. State Management Strategy

### Using Zustand

```typescript
// Store structures
interface ChallengeStore {
  challenges: Challenge[];
  currentChallenge: Challenge | null;
  loading: boolean;
  error: string | null;
  filters: {
    status: ChallengeStatus[];
    difficulty: ChallengeDifficulty[];
    searchQuery: string;
  };
}

interface AuthStore {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
}

interface SubmissionStore {
  submissions: Submission[];
  currentSubmission: Submission | null;
  isUploading: boolean;
  uploadProgress: number;
}
```

---

## 10. Security Considerations

### Authentication
- JWT token-based authentication
- Refresh token rotation
- Secure cookie storage

### Authorization
- Role-based access control (RBAC)
- Challenge ownership verification
- Team membership validation

### Data Protection
- Input validation on both frontend and backend
- SQL injection prevention (using ORM)
- XSS protection via React's built-in escaping
- CSRF token for state-changing operations

### File Handling
- File size limits on submissions
- Virus scanning for uploaded files
- Sandboxed execution of user submissions

---

## 11. Performance Optimization

### Frontend
- Next.js Image Optimization
- Code splitting with dynamic imports
- React Query/SWR for data fetching
- Service Worker for offline support

### Backend
- Database indexing on frequently queried fields
- Redis caching for leaderboards
- CDN for static assets
- Database connection pooling

### Monitoring & Analytics
- User engagement tracking
- Challenge performance metrics
- Submission success rates
- API response time monitoring

---

## 12. Development Workflow

### Setup
```bash
# Frontend
cd frontend
npm install
npm run dev

# Backend
cd backend
pip install -r requirements.txt
python -m uvicorn api.main:app --reload
```

### Environment Variables
```
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000/api/v1
NEXT_PUBLIC_APP_NAME=Open Challenges
DATABASE_URL=postgresql://user:password@localhost/db
REDIS_URL=redis://localhost:6379
```

### Deployment Pipeline
1. Push to main branch
2. Run tests (Jest, Pytest)
3. Build Docker images
4. Push to container registry
5. Deploy to Kubernetes/Cloud
6. Run smoke tests
7. Monitor error rates

---

## 13. Future Enhancements

- Real-time collaboration with WebSockets
- Advanced visualization dashboards
- ML model deployment integration
- Automated code quality checks
- Notebook integration (Jupyter)
- API versioning & backwards compatibility
- Mobile app (React Native)
- GraphQL API layer
