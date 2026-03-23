# Frontend UI/UX Documentation

## Page Layouts Overview

### Home Page (/)

```
┌─────────────────────────────────────────────────┐
│                    Header (Nav)                  │
├─────────────────────────────────────────────────┤
│                                                 │
│               HERO SECTION                      │
│  ┌─────────────────────────────────────────┐   │
│  │ "Compete in AI & ML Challenges"         │   │
│  │ [Explore Challenges] [Get Started]      │   │
│  │                                         │   │
│  │ Stats Grid:                             │   │
│  │ [50+ Active] [5K+ Participants]         │   │
│  │ [$500K+ Prize] [100+ Countries]         │   │
│  └─────────────────────────────────────────┘   │
│                                                 │
├─────────────────────────────────────────────────┤
│           FEATURED CHALLENGES SECTION           │
│  ┌──────────────┐ ┌──────────────┐ ┌─────────┐ │
│  │ Challenge 1  │ │ Challenge 2  │ │ Chal... │ │
│  │ [Image]      │ │ [Image]      │ │         │ │
│  │ [Details]    │ │ [Details]    │ │         │ │
│  └──────────────┘ └──────────────┘ └─────────┘ │
│  [View All Challenges →]                       │
│                                                 │
├─────────────────────────────────────────────────┤
│              HOW IT WORKS SECTION               │
│  ┌────────┐  ┌────────┐  ┌────────┐  ┌────────┐│
│  │ 1      │  │ 2      │  │ 3      │  │ 4      ││
│  │ Browse │→ │ Join   │→ │ Build  │→ │Compete││
│  │        │  │ Team   │  │Submit  │  │ Win   ││
│  └────────┘  └────────┘  └────────┘  └────────┘│
│                                                 │
├─────────────────────────────────────────────────┤
│            WHY CHOOSE US SECTION                │
│  ┌──────────┐┌──────────┐┌──────────┐           │
│  │Real-time ││Flexible  ││Challenge ││ ...     │
│  │Leader    ││Metrics   ││Prize     ││         │
│  │boards    ││          ││Pools     ││         │
│  └──────────┘└──────────┘└──────────┘           │
│                                                 │
├─────────────────────────────────────────────────┤
│            CTA SECTION                          │
│  Ready to Get Started?                          │
│  [Create Free Account] [Browse Challenges]      │
│                                                 │
├─────────────────────────────────────────────────┤
│                    Footer                       │
│  Links | Social | Copyright                     │
└─────────────────────────────────────────────────┘
```

### Challenges Page (/challenges)

```
┌─────────────────────────────────────────────────┐
│                    Header (Nav)                  │
├─────────────────────────────────────────────────┤
│                                                 │
│ PAGE TITLE: "All Challenges"                    │
│ Description: "Explore and participate in..."    │
│                                                 │
├─────────────────────────────────────────────────┤
│             SEARCH & FILTERS SECTION            │
│                                                 │
│ ┌──────────────────────────────────────────┐   │
│ │ Search challenges...                     │   │
│ └──────────────────────────────────────────┘   │
│                                                 │
│ Filters: [All Status ▼] [All Difficulty ▼]    │
│ Results: 23 challenges found                   │
│                                                 │
├─────────────────────────────────────────────────┤
│          CHALLENGES GRID (3 COLUMNS)            │
│                                                 │
│ ┌──────────────┐┌──────────────┐┌────────────┐ │
│ │ACTIVE  MEDIUM││ACTIVE MEDIUM ││CLOSED HARD │ │
│ │ [Image]      ││ [Image]      ││ [Image]    │ │
│ │              ││              ││            │ │
│ │Challenge     ││Challenge     ││Challenge  │ │
│ │Title Here    ││Title Here    ││Title Here │ │
│ │              ││              ││            │ │
│ │Description   ││Description   ││Description│ │
│ │              ││              ││            │ │
│ │┌──────┬──────┐││┌──────┬──────┐││ ┌───┬─┬─┐│ │
│ ││245   │892   │││245   │892   │││0 │0  │0│ │ │
│ ││Part. │Submit││Part. │Submit││Part.│  │ │ │ │
│ │└──────┴──────┘┘└──────┴──────┘┘ └───┴─┴─┘│ │
│ │                                          │ │
│ │Prize: $5,000                             │ │
│ │                                          │ │
│ │25 days remaining                         │ │
│ │Ends: Mar 20, 2026                       │ │
│ │                                          │ │
│ │[View Details]                            │ │
│ └──────────────┘└──────────────┘└────────────┘ │
│ ┌──────────────┐┌──────────────┐┌────────────┐ │
│ │              ││              ││            │ │
│ │   ... more cards ...                    │ │
│ │              ││              ││            │ │
│ └──────────────┘└──────────────┘└────────────┘ │
│                                                 │
├─────────────────────────────────────────────────┤
│           PAGINATION                            │
│  [Previous] [1] [2] [3] [Next]                 │
│                                                 │
├─────────────────────────────────────────────────┤
│                    Footer                       │
└─────────────────────────────────────────────────┘
```

## Component Hierarchy

```
App (Root Layout)
│
├── Header
│   ├── Logo/Brand
│   ├── Nav Links (Home, Challenges, Leaderboard, About)
│   ├── Auth Links (Sign In, Join Now)
│   └── Mobile Menu Toggle
│
├── Main Content
│   │
│   ├── HomePage (/)
│   │   ├── Hero Section
│   │   │   ├── Title & Description
│   │   │   ├── CTA Buttons
│   │   │   └── Stats Grid
│   │   │       └── 4 Stat Cards
│   │   │
│   │   ├── Featured Challenges
│   │   │   └── ChallengeCard × 3
│   │   │
│   │   ├── How It Works Section
│   │   │   └── 4 Step Cards
│   │   │
│   │   ├── Features Section
│   │   │   └── 6 Feature Cards
│   │   │
│   │   └── CTA Section
│   │
│   └── ChallengesPage (/challenges)
│       ├── Page Header
│       ├── Search & Filters
│       │   ├── Search Input
│       │   ├── Status Dropdown Filter
│       │   ├── Difficulty Dropdown Filter
│       │   └── Results Counter
│       │
│       ├── ChallengeList
│       │   ├── Loading State (spinny loader)
│       │   ├── Empty State (sad icon + message)
│       │   ├── Challenges Grid
│       │   │   └── ChallengeCard × 9
│       │   │       ├── Image with Gradient Fallback
│       │   │       ├── Status Badge
│       │   │       ├── Difficulty Badge
│       │   │       ├── Title
│       │   │       ├── Description
│       │   │       ├── Metrics Grid (Participants, Submissions)
│       │   │       ├── Prize Display
│       │   │       ├── Timeline (Days Remaining)
│       │   │       └── CTA Button
│       │   │
│       │   └── Pagination
│       │       ├── Previous Button
│       │       ├── Page Numbers
│       │       └── Next Button
│
└── Footer
    ├── Brand Section
    ├── Quick Links
    ├── Resources
    ├── Connect/Social Links
    └── Legal Links & Copyright
```

## Challenge Card Anatomy

```
┌──────────────────────────────────┐
│ ┌────────────────────────────────┤ ← Image Container
│ │  [ACTIVE]    [MEDIUM]          │    (200px height)
│ │     ↓            ↓             │
│ │   Badge        Badge           │
│ │                                │
│ │        Challenge Image         │
│ │     (with hover zoom)          │
│ │                                │
│ └────────────────────────────────┘
│                                  │
│ Title Here (max 2 lines)          │ ← Content Area
│                                  │
│ Brief description text that      │
│ gets truncated to 2 lines...     │
│                                  │
│ ┌──────────────┬──────────────┐  │
│ │Participants  │Submissions   │  │
│ │245           │892           │  │
│ └──────────────┴──────────────┘  │
│                                  │
│ Prize: $5,000                     │
│                                  │
│ ────────────────────────────────  │ ← Divider
│                                  │
│ 25 days remaining                 │
│ Ends: Mar 20, 2026               │
│                                  │
│  [View Details →]                │ ← CTA Button
│                                  │
└──────────────────────────────────┘

Responsive:
- Mobile: 1 column
- Tablet (md): 2 columns
- Desktop (lg): 3 columns
```

## Color Usage

```
Background Colors:
- Primary Background: White (#FFFFFF)
- Hover/Secondary: Gray (#F3F4F6)
- Section Backgrounds: Light Gray (#F9FAFB)

Text Colors:
- Primary (Headings): Gray-900 (#111827)
- Secondary (Body): Gray-700 (#374151)
- Tertiary (Helpers): Gray-600 (#4B5563)
- Light (On colored): Gray-100 (#F3F4F6)

Accent Colors:
- Primary Blue: #3B82F6 (main CTA, links)
- Success Green: #10B981 (positive metrics)
- Warning Orange: #F59E0B (medium badges)
- Error Red: #EF4444 (negative, hard badges)
- Info Sky: #0EA5E9 (info, messages)

Gradient (Hero):
- from-blue-600 to-indigo-700
```

## Typography

```
Headings:
- H1 (Hero): 48px (2.5rem) font-bold
- H2 (Section): 36px (2rem) font-bold
- H3 (Subsection): 30px (1.875rem) font-bold
- H4 (Card): 18px (1.125rem) font-bold

Body:
- Large: 18px (1.125rem) text-gray-600
- Regular: 16px (1rem) text-gray-700
- Small: 14px (0.875rem) text-gray-600
- Tiny: 12px (0.75rem) text-gray-500

Font Family: Inter (System Font)
```

## States & Interactions

### Button States
- **Default**: Blue background, white text
- **Hover**: Darker blue background
- **Active/Focus**: Blue ring outline
- **Disabled**: Gray background, reduced opacity

### Card States
- **Default**: White with subtle shadow
- **Hover**: Lifted shadow, scale transform
- **Loading**: Gray overlay with spinner
- **Empty**: Placeholder icon + message

### Filter States
- **Active**: Blue text/border
- **Inactive**: Gray text/border
- **Hover**: Light gray background

### Badge States
- **Easy**: Green background (#D1FAE5), green text
- **Medium**: Yellow background (#FEF3C7), yellow text
- **Hard**: Red background (#FEE2E2), red text
- **Active**: Blue background, blue text
- **Closed**: Orange background, orange text
- **Archived**: Slate background, slate text

## Animation & Transitions

- **Page Transition**: Smooth fade-in
- **Card Hover**: Lift shadow + scale 1.02
- **Image Hover**: Scale 1.05 (zoom)
- **Button Click**: Ripple effect on press
- **Loading**: Spinning loader (smooth rotation)
- **Scroll**: Smooth scrolling behavior

## Accessibility Features

- ✅ Semantic HTML (nav, main, section, footer)
- ✅ ARIA labels on dynamic content
- ✅ Focus visible states (blue outline)
- ✅ Color contrast ratios (WCAG AA)
- ✅ Keyboard navigation support
- ✅ Alt text on images
- ✅ Form labels on inputs
- ✅ Skip links (future enhancement)
- ✅ Screen reader friendly

## Responsive Breakpoints

```
Mobile (default): 0 - 640px
Tablet (sm): 640px - 768px
Medium (md): 768px - 1024px
Large (lg): 1024px - 1280px
XL (xl): 1280px+

Used in this project:
- ChallengeCard: 1 col → 2 cols → 3 cols
- Header: Mobile menu → Desktop nav
- Sections: Full width → max-w-7xl container
```

---

This UI/UX documentation provides a complete visual reference for the current implementation and future feature additions.
