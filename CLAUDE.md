# CLAUDE.md - AI Context & Development Rules

## Project Vision: KPT Retrospective Analyzer
AI 기반 분기별 회고 분석 서비스. 팀원들의 KPT(Keep, Problem, Try) 데이터를 분석하여 팀 성장을 위한 인사이트 리포트 제공.

## Technical Stack
- **Framework**: Next.js 14+ (App Router)
- **Styling**: Tailwind CSS (Mobile-first Responsive Design)
- **Language**: TypeScript (Strict Mode)
- **Backend/DB**: Supabase (Authentication & Database)
- **AI Engine**: Claude 3.5 Sonnet (Anthropic SDK)

## Code Style & Guidelines
- **Components**: Functional components with Tailwind for responsiveness.
- **Naming**: 
  - Components: PascalCase (e.g., `RetrospectiveCard.tsx`)
  - Functions/Variables: camelCase (e.g., `analyzeKptData`)
- **State Management**: React Context API or simple Props drilling for lightweight state.
- **Responsiveness**: Use `sm:`, `md:`, `lg:` prefixes consistently. Mobile-first approach is mandatory.

## Common Commands
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm test` - Run unit tests (Vitest)
- `npm run lint` - Run ESLint check

## Project Structure
- `/app`: Next.js App Router (Pages & API Routes)
- `/components`: Reusable UI components
- `/lib`: Utility functions and AI prompt templates
- `/types`: TypeScript definitions