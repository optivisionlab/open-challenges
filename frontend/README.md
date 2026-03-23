# Open Challenges Frontend

A modern Next.js 14 web application for the Open Challenges platform - an AI/ML competition platform with real-time leaderboards and challenge management.

## Features

- 🎯 **Challenge Browsing**: View all available AI/ML challenges with rich filtering and search
- 🏆 **Real-time Leaderboards**: Live rankings and team statistics
- 📊 **Metrics Display**: Visualize scores and performance metrics
- 👥 **Team Management**: Create and manage teams
- 📤 **Solution Submission**: Easy-to-use submission interface
- 🎨 **Beautiful UI**: Modern, responsive design with Tailwind CSS
- ♿ **Accessible**: WCAG 2.1 compliant components
- ⚡ **Fast**: Optimized Next.js App Router with server components

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Custom components + Material-UI ready
- **HTTP Client**: Axios
- **Package Manager**: npm

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repo-url>
cd open-challenges/frontend
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

Update `.env.local` with your configuration:
```bash
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000/api/v1
NEXT_PUBLIC_WS_URL=ws://localhost:8000/ws
NEXT_PUBLIC_APP_NAME=Open Challenges
```

### Development

Start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Build

Build for production:

```bash
npm run build
npm run start
```

## Project Structure

```
frontend/
├── public/                 # Static assets
├── src/
│   ├── app/               # Next.js App Router
│   │   ├── page.tsx       # Home page
│   │   ├── layout.tsx     # Root layout
│   │   ├── globals.css    # Global styles
│   │   └── challenges/    # Challenge routes
│   ├── components/        # Reusable components
│   │   ├── layout/        # Header, Footer components
│   │   └── challenges/    # Challenge-related components
│   ├── types/             # TypeScript type definitions
│   ├── utils/             # Utility functions and API services
│   └── contexts/          # React Context providers
├── package.json
├── tsconfig.json
├── tailwind.config.ts
├── next.config.js
└── Dockerfile
```

## Components

### Layout Components

- **Header**: Navigation bar with links to main sections
- **Footer**: Footer with links and information

### Challenge Components

- **ChallengeCard**: Individual challenge card display
- **ChallengeList**: Grid of challenges with filtering and pagination
- **ChallengeDetail**: Detailed challenge information page (coming soon)
- **SubmissionForm**: Form for submitting solutions (coming soon)

## Pages

- `/` - Home page with featured challenges
- `/challenges` - All challenges with filtering
- `/challenges/[id]` - Challenge details (coming soon)
- `/leaderboard` - Global leaderboards (coming soon)
- `/auth/login` - Login page (coming soon)
- `/auth/register` - Registration page (coming soon)

## Styling

We use Tailwind CSS for styling. Custom components are in `src/app/globals.css`.

### Useful Tailwind Utilities

- `.btn-primary`, `.btn-secondary`, `.btn-outline` - Button styles
- `.card` - Card styling
- `.badge` - Badge styling
- `.line-clamp-*` - Text truncation

## Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run type-check   # Check TypeScript types
npm run format       # Format code with Prettier
npm run format:check # Check code formatting
```

## API Integration

API calls are handled through services in `src/utils/`:

- `ChallengeService` - Challenge-related API calls
- More services coming...

### Mock Data

Currently using mock data from `mockChallenges` in `src/utils/challenges.ts`. To connect to the real API, uncomment API calls and update endpoints.

## Environment Variables

### Public Variables (NEXT_PUBLIC_)

These are exposed in the browser:

- `NEXT_PUBLIC_API_BASE_URL` - Backend API URL
- `NEXT_PUBLIC_WS_URL` - WebSocket URL
- `NEXT_PUBLIC_APP_NAME` - Application name
- `NEXT_PUBLIC_APP_URL` - Frontend URL
- `NEXT_PUBLIC_ENABLE_ANALYTICS` - Enable/disable analytics

## Performance Best Practices

- ✅ Server Components by default (App Router)
- ✅ Image optimization with Next.js Image
- ✅ Code splitting and lazy loading
- ✅ Dynamic imports for heavy components
- ✅ CSS minification via Tailwind

## Browser Support

- Modern browsers (Chrome, Firefox, Safari, Edge)
- Mobile responsive design
- Progressive enhancement

## Contributing

1. Create a feature branch
2. Make your changes
3. Run `npm run format` to format code
4. Run `npm run type-check` to check types
5. Run `npm run lint` to check for issues
6. Commit and push

## Deployment

### Docker

Build and run in Docker:

```bash
docker build -t open-challenges-frontend .
docker run -p 3000:3000 open-challenges-frontend
```

### Vercel (Recommended)

Deploy directly to Vercel:

```bash
npm install -g vercel
vercel
```

### Next.js Standalone

For self-hosted deployment:

```bash
npm run build
npm run start
```

## Common Issues

### Issue: `NEXT_PUBLIC_API_BASE_URL` is not defined

**Solution**: Make sure you created `.env.local` file with the required environment variables.

### Issue: Port 3000 already in use

**Solution**: Use a different port:
```bash
npm run dev -- -p 3001
```

### Issue: Images not loading

**Solution**: Add the image domain to `next.config.js` in the `images.domains` array.

## Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [TypeScript Documentation](https://www.typescriptlang.org/docs)
- [React Documentation](https://react.dev)

## License

Apache License 2.0 - See LICENSE file in the root directory

## Support

For issues and questions, please open an issue on GitHub or contact us at support@openchallenges.com
