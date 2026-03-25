# Open Challenges Platform - Visual Architecture

## Complete System Architecture

```mermaid
graph TB
    subgraph Client["🌐 Frontend (Next.js 14)"]
        UI["React Components"]
        Pages["App Router Pages"]
        State["Local State + Hooks"]
        Services["Service Layer"]
    end
    
    subgraph API["⚙️ API Layer (FastAPI)"]
        Gateway["API Gateway"]
        ChallengeAPI["Challenge Service"]
        SubmissionAPI["Submission Service"]
        LeaderboardAPI["Leaderboard Service"]
        AuthAPI["Auth Service"]
    end
    
    subgraph Data["💾 Data Layer"]
        DB["PostgreSQL"]
        Cache["Redis Cache"]
        Storage["S3/MinIO"]
    end
    
    subgraph Jobs["⏱️ Job Processing"]
        Queue["Celery Queue"]
        Scorer["Scoring Engine"]
        Events["Kafka Events"]
    end
    
    Client -->|HTTP/REST| API
    API -->|Read/Write| Data
    API -->|Queue Jobs| Jobs
    Jobs -->|Process & Update| Data
    Events -->|Real-time| Client
    Client -->|Cache| Data
```

## Frontend Component Hierarchy

```mermaid
graph TD
    App["App (Root Layout)"]
    
    App --> Challenges["Challenges Routes"]
    App --> Auth["Auth Routes"]
    App --> Dashboard["Dashboard Routes"]
    
    Challenges --> List["Challenge List Page"]
    Challenges --> Detail["Challenge Detail Page"]
    Challenges --> Create["Create Challenge Page"]
    Challenges --> Submit["Submit Solution Page"]
    
    Create --> Form["CreateChallengeForm Component"]
    Detail --> DetailComp["ChallengeDetail Component"]
    List --> ListComp["ChallengeList Component"]
    
    Form --> Wizard["6-Step Wizard"]
    DetailComp --> Hero["Hero Section"]
    DetailComp --> Content["Content Sections"]
    DetailComp --> Sidebar["Info Sidebar"]
    DetailComp --> Leaderboard["Leaderboard Table"]
    
    Wizard --> Step1["Step 1: Basic Info"]
    Wizard --> Step2["Step 2: Details"]
    Wizard --> Step3["Step 3: Timeline"]
    Wizard --> Step4["Step 4: Metrics"]
    Wizard --> Step5["Step 5: Resources"]
    Wizard --> Step6["Step 6: Review"]
```

## Data Model Relationships

```mermaid
erDiagram
    USERS ||--o{ TEAMS : leads
    USERS ||--o{ CHALLENGES : creates
    USERS ||--o{ SUBMISSIONS : makes
    TEAMS ||--o{ TEAM_MEMBERS : has
    CHALLENGES ||--o{ METRICS : has
    CHALLENGES ||--o{ SUBMISSIONS : receives
    CHALLENGES ||--o{ LEADERBOARD : tracks
    SUBMISSIONS ||--o{ SUBMISSION_SCORES : generates
    METRICS ||--o{ SUBMISSION_SCORES : evaluates
```

## Challenge Creation Data Flow

```mermaid
sequenceDiagram
    actor User as User
    participant Form as CreateForm
    participant Service as ChallengeService
    participant Page as Create Page
    participant API as FastAPI
    participant DB as PostgreSQL
    
    User->>Form: Fill challenge details
    Form->>Form: Validate input
    User->>Form: Submit on step 6
    Form->>Service: createChallenge(data)
    Service->>API: POST /challenges
    API->>API: Validate
    API->>DB: INSERT challenge
    API->>DB: INSERT metrics
    API-->>Service: Success response
    Service-->>Page: Challenge created
    Page->>Page: Redirect to detail
```

## Challenge Viewing Data Flow

```mermaid
sequenceDiagram
    actor User as User
    participant Page as Challenge[id] Page
    participant Service as ChallengeService
    participant API as FastAPI
    participant DB as PostgreSQL
    participant Cache as Redis
    
    User->>Page: Navigate to /challenges/[id]
    Page->>Service: getChallengeById(id)
    Service->>Cache: Check cache
    alt Cache Hit
        Cache-->>Service: Return cached
    else Cache Miss
        Service->>API: GET /challenges/[id]
        API->>DB: Query challenge
        DB-->>API: Return data
        API->>Cache: Store in cache
        API-->>Service: Return challenge
    end
    Service-->>Page: Challenge data
    Page->>Page: Fetch related challenges
    Page->>Page: Fetch leaderboard
    Page->>Page: Render components
    Page-->>User: Display challenge
```

## Form State Management Flow

```mermaid
stateDiagram-v2
    [*] --> Step1: Initial
    Step1 --> Step2: Validate & Next
    Step2 --> Step3: Validate & Next
    Step3 --> Step4: Validate & Next
    Step4 --> Step5: Validate & Next
    Step5 --> Step6: Validate & Next
    Step6 --> Review: Ready
    
    Step1 --> Step1: Previous / Edit
    Step2 --> Step1: Previous
    Step3 --> Step2: Previous
    Step4 --> Step3: Previous
    Step5 --> Step4: Previous
    Step6 --> Step5: Previous
    
    Review --> Creating: Submit
    Creating --> Success: Success
    Creating --> Error: Error
    Error --> Step6: Retry
    Success --> [*]: Redirect
```

## Routing Map

```mermaid
graph TD
    Home["/"]
    
    Home --> Challenges["/challenges"]
    Home --> Auth["/login, /register"]
    Home --> Teams["/teams"]
    Home --> Leaderboard["/leaderboard"]
    
    Challenges --> ChallengeList["List all<br/>with filters"]
    Challenges --> CreateChallenge["/create<br/>NEW"]
    Challenges --> ChallengeDetail["/[id]"]
    
    CreateChallenge --> CreateForm["6-Step<br/>Form"]
    
    ChallengeDetail --> DetailView["Challenge<br/>Details"]
    ChallengeDetail --> Submit["/[id]/submit"]
    ChallengeDetail --> Submissions["/[id]/submissions"]
    ChallengeDetail --> Edit["/[id]/edit<br/>TODO"]
    
    Teams --> TeamList["List Teams"]
    Teams --> CreateTeam["/create"]
    
    Leaderboard --> GlobalLeaderboard["Global<br/>Rankings"]
    Leaderboard --> ChallengeLeaderboard["Challenge<br/>Rankings"]
```

## Component Props Hierarchy

```mermaid
graph TD
    CreateChallengeForm["CreateChallengeForm<br/>Props: initialData, onSubmit"]
    CreateChallengeForm --> Step1["Step 1 Content"]
    CreateChallengeForm --> StepIndicator["StepIndicator<br/>Props: currentStep"]
    CreateChallengeForm --> Preview["Preview Panel<br/>Props: formData"]
    
    ChallengeDetail["ChallengeDetail<br/>Props: challenge,<br/>relatedChallenges,<br/>leaderboard"]
    ChallengeDetail --> Hero["HeroSection<br/>Props: challenge"]
    ChallengeDetail --> Sidebar["InfoSidebar<br/>Props: challenge"]
    ChallengeDetail --> Content["Content<br/>Props: challenge"]
    ChallengeDetail --> Related["RelatedChallenges<br/>Props: challenges[]"]
    ChallengeDetail --> Leaderboard["LeaderboardTable<br/>Props: entries[]"]
```

## Error Handling Flow

```mermaid
graph TD
    FormSubmit["Form Submit"]
    Validation["Validate Input"]
    
    Validation -->|Error| ValidationError["Show<br/>Validation Error"]
    Validation -->|Success| APICall["Call API"]
    
    APICall -->|Network Error| NetError["Show<br/>Network Error"]
    APICall -->|Server Error| ServerError["Show<br/>Server Error"]
    APICall -->|Success| Success["Success<br/>Redirect"]
    
    ValidationError --> FormSubmit
    NetError --> Retry["Retry?"]
    ServerError --> Retry
    Retry -->|Yes| APICall
    Retry -->|No| FormSubmit
    Success --> [*]
```

## Performance Optimization Strategy

```mermaid
graph LR
    FastAPI["FastAPI Backend"] --> Cache["Redis Cache<br/>Challenge Data"]
    FastAPI --> DB["PostgreSQL<br/>Primary Data"]
    
    Next["Next.js Frontend"]
    Next --> SSR["Server-Side<br/>Rendering"]
    Next --> CSR["Client-Side<br/>Rendering"]
    
    SSR --> Prerender["Pre-render<br/>Static Pages"]
    SSR --> ISR["ISR<br/>Revalidate"]
    
    CSR --> Memoize["React.memo<br/>Components"]
    CSR --> Lazy["Dynamic<br/>Imports"]
    
    Prerender --> CDN["CDN<br/>Distribution"]
    ISR --> CDN
    
    Images["Image<br/>Optimization"]
    Next --> Images
    Images --> WebP["WebP Format<br/>Smaller Size"]
    
    Assets["Asset<br/>Optimization"]
    Next --> Assets
    Assets --> Minify["Minify<br/>CSS/JS"]
```

## Testing Strategy

```mermaid
graph TD
    Tests["Test Suite"]
    
    Tests --> Unit["Unit Tests<br/>• Components<br/>• Utils<br/>• Services"]
    Tests --> Integration["Integration Tests<br/>• Form + Service<br/>• Detail + API<br/>• List + Filters"]
    Tests --> E2E["E2E Tests<br/>• Create Challenge<br/>• View Challenge<br/>• Search & Filter"]
    
    Unit --> Jest["Jest"]
    Integration --> RTL["React Testing<br/>Library"]
    E2E --> Playwright["Playwright"]
    
    Jest --> Coverage["Code<br/>Coverage"]
    RTL --> Coverage
    Playwright --> Coverage
```

## Deployment Architecture

```mermaid
graph LR
    Dev["Development<br/>Next.js Dev Server"]
    Staging["Staging<br/>Production-like"]
    Prod["Production<br/>Live"]
    
    Dev --> Build["Build"]
    Build --> Docker["Docker<br/>Container"]
    Docker --> Registry["Container<br/>Registry"]
    
    Registry --> K8s["Kubernetes<br/>Orchestration"]
    K8s --> CDN["CDN<br/>Static Files"]
    K8s --> API["API<br/>Gateway"]
    K8s --> Cache["Redis<br/>Cache"]
    K8s --> Monitoring["Monitoring<br/>Logging"]
    
    Staging -.->|Promote| Prod
    Dev -.->|Deploy| Staging
```

## API Response Caching Strategy

```mermaid
graph TD
    Request["User Request"]
    Request --> BrowserCache{"Browser<br/>Cache?"}
    
    BrowserCache -->|Hit| Return["Return<br/>Cached"]
    BrowserCache -->|Miss| RedisCache{"Redis<br/>Cache?"}
    
    RedisCache -->|Hit| Cache["Get from<br/>Redis"]
    RedisCache -->|Miss| DB["Query<br/>Database"]
    
    Cache --> Response["Response<br/>+ Set Headers"]
    DB --> Response
    Return --> Response
    Response --> Client["Client"]
    
    Invalidate["Data Update"]
    Invalidate --> InvalidateCache["Clear<br/>Related Caches"]
    InvalidateCache --> UpdateDB["Update<br/>Database"]
```

## Authentication Flow

```mermaid
sequenceDiagram
    actor User
    participant App as Frontend App
    participant API as FastAPI
    participant DB as Database
    participant JWT as JWT Token
    
    User->>App: Login Form
    App->>API: POST /auth/login
    API->>DB: Find User
    DB-->>API: User ID
    API->>JWT: Sign Token
    JWT-->>API: Access + Refresh
    API-->>App: Tokens + User
    App->>App: Store Token
    App->>API: Use Token in Headers
    API->>API: Verify Token
    API-->>App: Protected Data
```

---

## Key Metrics & Performance Targets

```
Frontend Performance:
├── Page Load: < 2s
├── API Response: < 500ms
├── Image Load: < 1s
├── Form Interaction: < 100ms
└── Search/Filter: < 1s

Code Quality:
├── TypeScript Coverage: 100%
├── Component Test Coverage: > 80%
├── ESLint Score: 0 warnings
└── Bundle Size: < 300KB

User Experience:
├── Mobile Responsiveness: 100%
├── Accessibility: WCAG AA
├── Error Message Clarity: 100%
└── Form Success Rate: > 95%
```

---

## Technology Stack Overview

```mermaid
graph TB
    Frontend["FRONTEND"]
    Backend["BACKEND"]
    Data["DATA & INFRASTRUCTURE"]
    
    Frontend --> FE1["Next.js 14+"]
    Frontend --> FE2["React + TypeScript"]
    Frontend --> FE3["Tailwind CSS"]
    Frontend --> FE4["React Hooks"]
    
    Backend --> BE1["FastAPI"]
    Backend --> BE2["Python 3.10+"]
    Backend --> BE3["Pydantic"]
    Backend --> BE4["SQLAlchemy"]
    
    Data --> D1["PostgreSQL"]
    Data --> D2["Redis"]
    Data --> D3["Celery"]
    Data --> D4["Kafka"]
    Data --> D5["MinIO/S3"]
    
    Deploy["DEPLOYMENT"]
    Deploy --> Container["Docker"]
    Deploy --> Orbit["Kubernetes"]
    Deploy --> CDN["CDN"]
    Deploy --> Monitor["Prometheus/Grafana"]
```

---

*These diagrams provide a comprehensive visual representation of the Open Challenges Platform architecture, data flows, and component relationships.*
