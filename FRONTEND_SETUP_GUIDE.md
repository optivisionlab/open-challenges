# Frontend Implementation Guide - Open Challenges Platform

## Overview

This document provides a complete guide for building and maintaining the Open Challenges Platform frontend application. It covers architecture, components, styling, routing, and best practices.

---

## 1. Project Setup & Structure

### Installation

```bash
cd frontend
npm install
npm run dev
```

### Key Technologies
- **Framework**: Next.js 14+ (React Server Components)
- **Language**: TypeScript
- **Styling**: Tailwind CSS (with custom config)
- **UI Components**: Custom built components, can integrate Shadcn/UI
- **State**: React hooks (local state), can add Zustand for global state
- **Data Fetching**: Async/await with fetch API
- **Form Handling**: React hooks + HTML5 validation

### Project Structure

```
frontend/
├── src/
│   ├── app/                          # Next.js App Router
│   │   ├── layout.tsx                # Root layout
│   │   ├── page.tsx                  # Home page
│   │   ├── globals.css               # Global styles
│   │   ├── (auth)/                   # Auth routes group
│   │   │   ├── login/page.tsx
│   │   │   ├── register/page.tsx
│   │   │   └── layout.tsx
│   │   ├── challenges/               # Challenge routes
│   │   │   ├── page.tsx              # List
│   │   │   ├── create/page.tsx       # Create (NEW)
│   │   │   └── [id]/
│   │   │       ├── page.tsx          # Detail
│   │   │       ├── edit/page.tsx     # Edit (TODO)
│   │   │       ├── submit/page.tsx   # Submit solution
│   │   │       └── submissions/page.tsx
│   │   ├── leaderboard/
│   │   ├── teams/
│   │   └── dashboard/
│   │
│   ├── components/
│   │   ├── challenges/
│   │   │   ├── ChallengeCard.tsx          # Card component
│   │   │   ├── ChallengeDetail.tsx        # Detail view
│   │   │   ├── ChallengeList.tsx          # List with filters
│   │   │   └── CreateChallengeForm.tsx    # Create form (NEW)
│   │   ├── submissions/
│   │   │   └── SubmitSolutionForm.tsx
│   │   ├── leaderboard/
│   │   │   ├── GlobalLeaderboardTable.tsx
│   │   │   └── LeaderboardTable.tsx
│   │   ├── layout/
│   │   │   ├── Header.tsx
│   │   │   └── Footer.tsx
│   │   └── auth/
│   │       ├── AuthLayout.tsx
│   │       ├── LoginForm.tsx
│   │       └── RegisterForm.tsx
│   │
│   ├── types/
│   │   └── index.ts                  # TypeScript interfaces
│   │
│   └── utils/
│       ├── challenges.ts             # Challenge service (UPDATED)
│       ├── leaderboard.ts
│       ├── formatters.ts
│       ├── submissionService.ts
│       ├── authService.ts
│       └── globalLeaderboardService.ts
│
├── public/                           # Static assets
├── package.json
├── tsconfig.json
├── next.config.js
└── tailwind.config.ts
```

---

## 2. Challenge Creation Flow

### Component: CreateChallengeForm

**Location**: `components/challenges/CreateChallengeForm.tsx`

**Features**:
- ✅ Step-by-step form wizard (6 steps)
- ✅ Form validation at each step
- ✅ Real-time preview mode
- ✅ Metric management (add/edit/delete)
- ✅ Progress indicators
- ✅ Error handling

**Steps**:
1. **Basic Info** - Title, description, image
2. **Details** - Problem statement, difficulty, prize pool, dataset URL
3. **Timeline** - Start date, end date with validation
4. **Metrics** - Add evaluation metrics with weight and direction
5. **Resources** - Documentation and submission format guidelines
6. **Review** - Final confirmation before submission

**Usage**:

```tsx
import CreateChallengeForm from "@/components/challenges/CreateChallengeForm";

export default function CreatePage() {
  const handleSubmit = async (formData) => {
    const challenge = await ChallengeService.createChallenge(formData);
    // Redirect to challenge detail
    redirect(`/challenges/${challenge.id}`);
  };

  return (
    <CreateChallengeForm 
      onSubmit={handleSubmit}
      isLoading={false}
    />
  );
}
```

### Page Route: /challenges/create

**Location**: `app/challenges/create/page.tsx`

**Server Action**:
```tsx
const handleSubmit = async (formData: any) => {
  "use server";
  // Server-side validation and API call
  const challenge = await ChallengeService.createChallenge(formData);
  redirect(`/challenges/${challenge.id}`);
};
```

---

## 3. Challenge Detail View

### Component: ChallengeDetail

**Location**: `components/challenges/ChallengeDetail.tsx`

**Features**:
- Hero section with challenge image
- Quick info sidebar (status, difficulty, prize, time remaining)
- Problem statement section
- Timeline with countdown
- Resources (dataset, documentation)
- Statistics panel
- Challenge info (created date, last updated)
- Leaderboard section (if available)
- Related challenges grid

**Props**:
```tsx
interface ChallengeDetailProps {
  challenge: Challenge;
  relatedChallenges?: Challenge[];
  leaderboardEntries?: LeaderboardEntry[];
}
```

**Layout Structure**:
```
┌───────────────────────────────────────────┐
│              Header / Breadcrumb           │
├───────────────────────────────────────────┤
│  ┌──────────────────────┐  ┌────────────┐ │
│  │  Challenge Image     │  │  Quick     │ │
│  │  (Hero Section)      │  │  Info      │ │
│  │                      │  │  Sidebar   │ │
│  └──────────────────────┘  │            │ │
│                            │ - Prize    │ │
│  Challenge Title           │ - Status   │ │
│  Challenge Description     │ - Time     │ │
│                            │ - Buttons  │ │
│                            └────────────┘ │
└───────────────────────────────────────────┘

┌───────────────────────────────────────────┐
│  Main Content (2/3 width)  │  Sidebar (1/3)│
├──────────────────────────────┼─────────────┤
│ • Problem Statement          │ • Stats     │
│ • Timeline                   │ • Info      │
│ • Resources                  │             │
│ • Documentation              │             │
└──────────────────────────────┴─────────────┘

┌───────────────────────────────────────────┐
│         Leaderboard Section               │
│  (Top 10 teams with scores)               │
└───────────────────────────────────────────┘

┌───────────────────────────────────────────┐
│      Related Challenges (3 columns)       │
└───────────────────────────────────────────┘
```

### Page Route: /challenges/[id]

**Location**: `app/challenges/[id]/page.tsx`

**Features**:
- Server-side data fetching
- Metadata generation
- Handles 404 errors gracefully
- Fetches related challenges
- Loads leaderboard data

```tsx
export async function generateMetadata({ params }: ChallengePageProps) {
  const challenge = await ChallengeService.getChallengeById(params.id);
  return {
    title: `${challenge?.title} - Open Challenges`,
    description: challenge?.description,
  };
}

export default async function ChallengePage({ params }: ChallengePageProps) {
  const challenge = await ChallengeService.getChallengeById(params.id);
  const relatedChallenges = await fetchRelated(challenge);
  const leaderboardData = await LeaderboardService.getLeaderboard(params.id);
  
  return (
    <ChallengeDetail
      challenge={challenge}
      relatedChallenges={relatedChallenges}
      leaderboardEntries={leaderboardData}
    />
  );
}
```

---

## 4. Types & Interfaces

### Challenge Type

```tsx
export interface Challenge {
  id: string;
  title: string;
  description: string;
  problem_statement: string;
  status: ChallengeStatus;          // DRAFT | ACTIVE | CLOSED | ARCHIVED
  difficulty_level: ChallengeDifficulty;  // EASY | MEDIUM | HARD
  start_date: string;               // ISO 8601
  end_date: string;                 // ISO 8601
  image_url?: string;
  dataset_url?: string;
  prize_pool?: number;
  participant_count: number;
  submission_count: number;
  created_by: string;
  created_at: string;
  updated_at: string;
}
```

### Metric Type

```tsx
export interface Metric {
  id: string;
  challenge_id: string;
  name: string;                     // e.g., "Accuracy"
  description?: string;
  metric_type: MetricType;          // SCORING_METRIC | CUSTOM_METRIC
  formula?: string;                 // Optional formula
  weight: number;                   // 0-1 or higher
  is_primary: boolean;              // Primary ranking metric
  min_value: number;
  max_value: number;
  direction: MetricDirection;       // HIGHER_IS_BETTER | LOWER_IS_BETTER
  created_at: string;
}
```

---

## 5. Services & Utilities

### ChallengeService

**Location**: `utils/challenges.ts`

**Methods**:

```tsx
class ChallengeService {
  // Read operations
  static getChallenges(page?: number, limit?: number)
  static getChallengeById(id: string)
  static getActiveChallenges()
  static getChallengesByDifficulty(difficulty: ChallengeDifficulty)
  static getChallengesByStatus(status: ChallengeStatus)
  static searchChallenges(query: string)
  static filterChallenges(filters: FilterOptions)
  
  // Write operations
  static createChallenge(data: Partial<Challenge>)
  static updateChallenge(id: string, data: Partial<Challenge>)
  static deleteChallenge(id: string)
}
```

**Example Usage**:

```tsx
// Get all challenges with pagination
const result = await ChallengeService.getChallenges(1, 10);
const { items, total, page, total_pages } = result;

// Filter challenges
const filtered = await ChallengeService.filterChallenges({
  status: ['ACTIVE'],
  difficulty: ['MEDIUM', 'HARD'],
  minPrize: 5000,
  search: "Machine Learning"
});

// Create challenge
const newChallenge = await ChallengeService.createChallenge({
  title: "New Challenge",
  description: "...",
  status: "DRAFT",
  difficulty_level: "MEDIUM"
});
```

### MetricService

**Location**: `utils/challenges.ts`

```tsx
class MetricService {
  static getMetrics(challengeId: string): Promise<Metric[]>
  static createMetric(challengeId: string, data: Partial<Metric>): Promise<Metric>
}
```

---

## 6. Styling Guidelines

### Tailwind CSS Configuration

**Global Colors**:
```tsx
// Palette from tailwind.config.ts
const colors = {
  primary: 'bg-blue-600',      // Main CTA
  success: 'bg-green-600',     // Positive actions
  danger: 'bg-red-600',        // Deletions, errors
  warning: 'bg-yellow-600',    // Warnings
  info: 'bg-cyan-600',         // Information
};
```

### Component Styling Patterns

**Button Styles**:
```tsx
// Primary Button
<button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
  Action
</button>

// Secondary Button
<button className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
  Cancel
</button>

// Disabled Button
<button disabled className="opacity-50 cursor-not-allowed">
  Disabled
</button>
```

**Card Styles**:
```tsx
// Standard Card
<div className="bg-white rounded-lg p-6 shadow-sm">
  Content
</div>

// Highlighted Card
<div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
  Content
</div>
```

**Badge Styles**:
```tsx
// Status Badge
<span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">
  ACTIVE
</span>

// Difficulty Badge
<span className={`px-3 py-1 rounded-full text-xs font-semibold ${getDifficultyColor(difficulty)}`}>
  {difficulty}
</span>
```

---

## 7. Form Handling

### Form Validation

```tsx
// Client-side validation
const validateStep = (step: number): boolean => {
  switch (step) {
    case 1:
      if (!formData.title?.trim()) {
        setError("Title is required");
        return false;
      }
      return true;
    // ... more validations
  }
};

// Server-side validation (in API)
// Backend should validate all inputs separately
```

### Form State Management

```tsx
// Local state with React hooks
const [formData, setFormData] = useState<Partial<Challenge>>({
  title: "",
  description: "",
  // ...
});

const updateFormData = (key: string, value: any) => {
  setFormData(prev => ({
    ...prev,
    [key]: value
  }));
};

// Form submission
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  if (validateStep(currentStep)) {
    await onSubmit(formData);
  }
};
```

---

## 8. Data Fetching Patterns

### Server-Side Fetching (Recommended)

```tsx
// Async Server Component
export default async function ChallengePage() {
  // Direct API call in Server Component
  const challenge = await ChallengeService.getChallengeById(params.id);
  
  return <ChallengeDetail challenge={challenge} />;
}
```

### Client-Side Fetching

```tsx
"use client";  // Mark as client component

export default function ChallengeList() {
  const [challenges, setChallenges] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const data = await ChallengeService.getChallenges();
        setChallenges(data.items);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return <LoadingSpinner />;
  return <ChallengeCard challenges={challenges} />;
}
```

---

## 9. Testing

### Component Testing Example

```tsx
// Example with Jest + React Testing Library
import { render, screen } from "@testing-library/react";
import CreateChallengeForm from "@/components/challenges/CreateChallengeForm";

describe("CreateChallengeForm", () => {
  it("should render all form steps", () => {
    render(
      <CreateChallengeForm onSubmit={jest.fn()} />
    );
    
    expect(screen.getByText(/Basic Info/i)).toBeInTheDocument();
    expect(screen.getByText(/Details/i)).toBeInTheDocument();
  });

  it("should validate required fields", async () => {
    const mockSubmit = jest.fn();
    render(<CreateChallengeForm onSubmit={mockSubmit} />);
    
    const nextButton = screen.getByText(/Next/i);
    await userEvent.click(nextButton);
    
    expect(screen.getByText(/Title is required/i)).toBeInTheDocument();
  });
});
```

---

## 10. Performance Optimization

### Image Optimization

```tsx
// Use Next.js Image component
import Image from "next/image";

<Image
  src={challenge.image_url}
  alt={challenge.title}
  width={500}
  height={300}
  className="object-cover"
/>
```

### Code Splitting

```tsx
// Dynamic imports for heavy components
import dynamic from "next/dynamic";

const ChallengeDetail = dynamic(
  () => import("@/components/challenges/ChallengeDetail"),
  { loading: () => <LoadingSpinner /> }
);
```

### Memoization

```tsx
// Prevent unnecessary re-renders
import { memo } from "react";

const ChallengeCard = memo(function ChallengeCard({ challenge }) {
  return (
    // Component content
  );
});
```

---

## 11. Deployment Checklist

- [ ] Run `npm run build` and verify no errors
- [ ] Run tests: `npm run test`
- [ ] Check ESLint: `npm run lint`
- [ ] Update environment variables
- [ ] Test API endpoints
- [ ] Verify responsive design on mobile
- [ ] Test form submissions
- [ ] Check error handling
- [ ] Optimize images
- [ ] Set up CDN/caching
- [ ] Monitor error rates post-deployment

### Environment Variables

```env
NEXT_PUBLIC_API_BASE_URL=https://api.example.com/api/v1
NEXT_PUBLIC_APP_NAME=Open Challenges
NEXT_PUBLIC_SITE_URL=https://example.com
```

---

## 12. Common Issues & Solutions

### Issue: Form not submitting
**Solution**: 
- Check if validation is passing
- Verify server action is marked with `"use server"`
- Check browser console for errors

### Issue: Images not loading
**Solution**:
- Verify image URL is accessible
- Check Next.js Image configuration in `next.config.js`
- Use fallback gradient if image fails

### Issue: Slow page loads
**Solution**:
- Implement pagination for challenge lists
- Use React.memo for expensive components
- Optimize images with Next.js Image
- Consider implementing virtual scrolling

---

## 13. Future Enhancements

- [ ] Real-time updates with WebSockets
- [ ] Google Drive/Dropbox integration for submissions
- [ ] Dark mode support
- [ ] Multi-language support (i18n)
- [ ] Advanced analytics dashboard
- [ ] Email notifications
- [ ] GraphQL API support
- [ ] Advanced search filters
- [ ] Challenge templates
- [ ] Bulk operations

---

## 14. Resources & References

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [TypeScript Handbook](https://www.typescriptlang.org/docs)
- [Jest Testing](https://jestjs.io)
