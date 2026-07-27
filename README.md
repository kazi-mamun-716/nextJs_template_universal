# Universal Next.js Boilerplate

> A production-ready, feature-isolated Next.js boilerplate for building scalable web applications.

This boilerplate follows **Feature-Based Architecture** with strict separation of concerns. Business logic lives inside isolated features. Shared infrastructure is minimal and purpose-built. Every major concern (auth, upload, email, SEO, dashboard, errors) has its own module with defined public API boundaries.

---

## Table of Contents

- [Tech Stack](#tech-stack)
- [Quick Start](#quick-start)
- [Folder Structure](#folder-structure)
- [Architecture](#architecture)
- [Features](#features)
- [Configuration](#configuration)
- [Development](#development)
- [Docker](#docker)
- [Scripts](#scripts)
- [Contributing](#contributing)

---

## Tech Stack

| Category        | Technology                                      |
| --------------- | ----------------------------------------------- |
| **Framework**   | Next.js 15 (App Router)                         |
| **Language**    | TypeScript 5                                    |
| **Styling**     | Tailwind CSS 3 + shadcn/ui                      |
| **Database**    | MongoDB + Mongoose                              |
| **Auth**        | Auth.js v5 (Credentials, Google, GitHub)        |
| **Validation**  | Zod + React Hook Form                           |
| **Upload**      | Cloudinary                                      |
| **Email**       | Resend + React Email templates                  |
| **Icons**       | Lucide React                                    |
| **Animations**  | Framer Motion (available)                       |
| **Forms**       | React Hook Form + @hookform/resolvers           |
| **Theme**       | next-themes (light / dark / system)             |
| **Linting**     | ESLint 9 (flat config) + Prettier               |
| **Hooks**       | Husky + lint-staged                             |
| **Container**   | Docker + Docker Compose                         |

---

## Quick Start

### Prerequisites

- **Node.js** >= 20
- **npm** >= 10
- **MongoDB** (local or Atlas) — or use `docker compose up mongo`
- **Cloudinary** account (for image uploads)
- **Resend** API key (for transactional emails — optional for development)

### 1. Clone & Install

```bash
git clone <repo-url> my-project
cd my-project
npm install
```

### 2. Environment Variables

```bash
cp .env.example .env.local
```

Fill in your values (see [Configuration](#configuration) for details).

### 3. Run

```bash
# Development (with Turbopack)
npm run dev

# Or with Docker (MongoDB + app)
docker compose up
```

Visit [http://localhost:3000](http://localhost:3000).

---

## Folder Structure

```
src/
├── app/                          # Next.js App Router pages
│   ├── (auth)/                   # Auth route group (login, register)
│   ├── (dashboard)/              # Dashboard route group
│   │   └── dashboard/
│   │       ├── layout.tsx        # Dashboard layout (sidebar + navbar)
│   │       ├── page.tsx          # Dashboard home
│   │       ├── analytics/
│   │       ├── profile/
│   │       └── settings/
│   ├── (marketing)/              # Public marketing pages
│   ├── api/                      # API route handlers
│   │   ├── auth/
│   │   ├── health/
│   │   ├── upload/avatar/
│   │   └── webhooks/
│   ├── error.tsx                 # 500 error page
│   ├── global-error.tsx          # Critical error page
│   ├── loading.tsx               # Loading page
│   ├── not-found.tsx             # 404 page
│   ├── sitemap.ts                # Dynamic sitemap.xml
│   └── robots.ts                 # Dynamic robots.txt
│
├── components/
│   ├── common/                   # Shared presentational components
│   │   ├── error-state.tsx
│   │   ├── loading-spinner.tsx
│   │   └── skeleton.tsx
│   ├── layout/                   # Layout components
│   │   ├── sidebar.tsx           # Collapsible sidebar
│   │   ├── navbar.tsx            # Responsive navbar
│   │   ├── breadcrumb.tsx        # Auto-generated breadcrumbs
│   │   ├── container.tsx         # Max-width container
│   │   └── page-header.tsx       # Page title + description
│   └── ui/                       # Design system primitives
│       ├── avatar.tsx
│       ├── badge.tsx
│       ├── button.tsx
│       ├── card.tsx
│       ├── dialog.tsx
│       ├── input.tsx
│       ├── loader.tsx
│       ├── pagination.tsx
│       ├── skeleton.tsx
│       └── table.tsx
│
├── config/                       # Centralized configuration
│   ├── app.ts                    # App name, URL, description
│   ├── auth.ts                   # Auth settings
│   ├── email.ts                  # Resend config
│   ├── env.ts                    # Zod-validated env vars
│   ├── features.ts               # Feature flags
│   ├── seo.ts                    # SEO defaults
│   ├── upload.ts                 # Upload limits & presets
│   └── validator.ts             # Cross-config validation
│
├── constants/                    # Reusable constants
│   ├── api-status.ts             # HTTP status codes + messages
│   ├── messages.ts               # All user-facing messages
│   ├── regex.ts                  # Regex patterns
│   ├── roles.ts                  # Role definitions
│   ├── routes.ts                 # Route path constants
│   └── storage-keys.ts           # localStorage keys
│
├── features/                     # Isolated feature modules
│   ├── auth/                     # Authentication
│   ├── dashboard/                # Dashboard widgets & hooks
│   ├── email/                    # Transactional emails
│   ├── errors/                   # Error handling (boundaries, pages)
│   ├── seo/                      # Metadata, sitemap, robots, JSON-LD
│   ├── theme/                    # Theme toggle
│   ├── upload/                   # File uploads (Cloudinary)
│   └── users/                    # User profile & settings
│
├── hooks/                        # Global shared hooks
├── lib/                          # Infrastructure layer
│   ├── api/                      # API helpers (response, errors, handlers)
│   ├── auth.ts                   # Auth.js configuration
│   ├── db/                       # MongoDB connection & repository
│   └── validation/               # Zod field builders & utilities
│
├── middleware.ts                 # Next.js middleware (auth + routing)
├── providers/                    # React providers
│   ├── index.ts                  # Combined provider
│   ├── session-provider.tsx
│   ├── toast-provider.tsx
│   ├── theme-provider.tsx
│   └── loading-provider.tsx
│
├── styles/
│   └── globals.css
│
├── types/                        # Global TypeScript types
│   ├── api.ts
│   ├── common.ts
│   ├── global.d.ts
│   ├── index.ts                  # Barrel export
│   └── next.ts                   # Next.js type helpers
│
└── utils/                        # Reusable utilities
    ├── array/
    ├── date/
    ├── encryption/
    ├── errors.ts                 # AppError hierarchy
    ├── formatter/
    ├── logger.ts                 # Structured logger
    ├── number/
    ├── object/
    ├── pagination/
    ├── response.ts               # Response helpers
    ├── slug/
    └── string/
```

---

## Architecture

### Feature-Based Architecture

Each feature is a self-contained module with its own:

```
features/<feature>/
├── components/       # Feature-specific React components
├── actions/          # Server actions
├── services/         # Business logic services
├── repository/       # Data access layer
├── models/           # Mongoose models (if applicable)
├── schemas/          # Zod validation schemas
├── hooks/            # Client-side hooks
├── types/            # TypeScript interfaces/types
├── constants/        # Feature-specific constants
├── config/           # Feature configuration
├── routes.ts         # Feature route constants
└── index.ts          # Barrel export (public API)
```

**Rules:**
- Features cannot import directly from other features' internal files — use the barrel export
- Shared UI lives in `components/ui/`
- Shared infrastructure (config, constants, utils, types) lives outside features
- Business logic never appears inside UI components

### Dependency Flow

```
Pages (app/)
    ↓
Features (features/)
    ↓
Shared Components (components/ui, components/layout)
    ↓
Infrastructure (lib/, config/, utils/)
```

### API Layer

```
Server Actions (features/*/actions/)
    → createAction({ schema, handler })
    → validate → auth → handler

Route Handlers (app/api/*/route.ts)
    → withAuth() / withErrorHandling() / withValidation()
    → JSON response via ok() / error() / notFound() / ...
```

---

## Features

### Authentication (`features/auth`)

- **Credentials provider** with bcrypt password hashing
- **OAuth providers** — Google, GitHub (configurable)
- Email + password registration with email verification flow
- Password reset with time-limited tokens
- Session management via Auth.js
- Role-based access control
- Middleware-protected dashboard routes

### User Management (`features/users`)

- Profile editing (name, bio, website, location)
- Avatar upload with Cloudinary
- Password change with current password verification
- Account deletion (soft-delete) with confirmation
- User settings (theme, notifications, language)

### File Upload (`features/upload`)

- Cloudinary integration with transformation presets
- `ImageUpload` component — drag & drop, preview, progress
- `FileUpload` component — generic file picker with validation
- `UploadPreview` component — metadata display + delete
- `useUpload` hook — state management for client uploads
- `POST /api/upload/avatar` — authenticated API route
- Server actions: `upload`, `deleteFile`

### Email (`features/email`)

- React-based email templates rendered via `renderToString`
- `EmailWrapper` — base layout with header, footer, branding
- Template components: `WelcomeEmail`, `ResetPasswordEmail`, `VerifyEmail`, `NotificationEmail`
- `emailService` — singleton with typed convenience send methods
- Fire-and-forget integration with auth service (non-blocking)
- Server actions: `sendWelcomeEmail`, `sendResetPasswordEmail`, etc.

### Dashboard (`features/dashboard`)

- Dashboard home with welcome card, stats grid, quick actions, recent activity
- Analytics page with summary cards and chart placeholders
- Widget library: `StatCard`, `WelcomeCard`, `ActivityItem`, `QuickActions`
- `ProfileMenu` — user dropdown with avatar, links, logout
- `MobileNav` — responsive navigation drawer
- Hooks: `useSidebar` (localStorage persistence), `useBreadcrumb` (pathname parsing)

### Error Handling (`features/errors`)

- `ErrorBoundary` — React Error Boundary with error logging
- `ErrorFallback` — inline section-level error display with retry
- `NotFoundContent` — 404 page (search + quick links + Go Back)
- `ErrorContent` — 500 page (error ID + Try Again + Go Home)
- `GlobalErrorContent` — standalone critical error UI
- `errorLogger` — structured error capture with severity levels + error IDs
- App-level pages: `error.tsx`, `not-found.tsx`, `global-error.tsx`, `loading.tsx`

### SEO (`features/seo`)

- `metadataGenerator` — factory for Next.js `Metadata` objects with OG/Twitter/robots defaults
- `sitemapGenerator` — sitemap entries for static + dynamic pages
- `robotsGenerator` — environment-aware robots.txt rules
- `JsonLd` — structured data (Organization, WebSite, BreadcrumbList, Article, FAQPage, custom)
- `MetaTags` — client-component meta tag injection
- App routes: `/sitemap.xml`, `/robots.txt`
- Structured data injected in root layout

### Theme (`features/theme`)

- Light / Dark / System mode via `next-themes`
- Theme toggle component

### Validation (`lib/validation`)

- Reusable Zod field builders: `email()`, `password()`, `name()`, `url()`, `slug()`, `objectId()`, `phone()`, `token()`, etc.
- Common refinements: `passwordsMatchRefinement`, `dateOrder`, `noHtml`, `atLeastOne`
- Utilities: `validate()`, `validateFormData()`, `withValidation()`, `formatZodError()`

### API Infrastructure (`lib/api`)

- Response builders: `success()` / `error()` / `paginated()` (server actions), `ok()` / `created()` / `notFound()` / `badRequest()` / `serverError()` etc. (route handlers)
- Error classes: `ApiError`, `BadRequestError`, `UnauthorizedError`, `NotFoundError`, `ConflictError`, `ValidationError`, `RateLimitError`
- Route handler wrappers: `withAuth()`, `withValidation()`, `withErrorHandling()`
- Action factory: `createAction()` — combines validation + auth + handler

---

## Configuration

All configuration is centralized in `src/config/`. Values come from validated environment variables.

### Environment Variables

| Variable                            | Required | Default                    | Description                     |
| ----------------------------------- | -------- | -------------------------- | ------------------------------- |
| `NEXT_PUBLIC_APP_URL`               | Yes      | `http://localhost:3000`    | Canonical application URL       |
| `NEXT_PUBLIC_APP_NAME`              | Yes      | —                          | Application display name        |
| `NEXT_PUBLIC_APP_DESCRIPTION`       | No       | —                          | Meta description                |
| `MONGODB_URI`                       | Yes      | —                          | MongoDB connection string        |
| `AUTH_SECRET`                       | Yes      | —                          | Auth.js secret (≥32 chars)      |
| `AUTH_URL`                          | No       | `http://localhost:3000`    | Auth callback URL               |
| `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` | No       | —                          | Cloudinary cloud name           |
| `CLOUDINARY_API_KEY`                | No       | —                          | Cloudinary API key              |
| `CLOUDINARY_API_SECRET`             | No       | —                          | Cloudinary API secret           |
| `RESEND_API_KEY`                    | No       | —                          | Resend transactional email key  |
| `RESEND_FROM_EMAIL`                 | No       | `noreply@example.com`      | Sender email address             |
| `ENCRYPTION_KEY`                    | No       | —                          | Encryption key (≥32 chars)      |

### Feature Flags (`src/config/features.ts`)

```typescript
export const featureFlags = {
  enableAnalytics: false,
  enableNotifications: false,
  "analytics-dashboard-v2": false,
};
```

---

## Development

### Available Scripts

| Command               | Description                     |
| --------------------- | ------------------------------- |
| `npm run dev`         | Start dev server (Turbopack)    |
| `npm run build`       | Production build                |
| `npm run start`       | Start production server         |
| `npm run lint`        | Run ESLint                      |
| `npm run lint:fix`    | Fix auto-fixable ESLint issues  |
| `npm run format`      | Format all files with Prettier  |
| `npm run typecheck`   | TypeScript type checking        |
| `npm run check`       | Run all checks (type + lint + format) |
| `npm run db:seed`     | Seed the database               |

### Code Quality

- **ESLint** flat config with Next.js + Prettier rules
- **Prettier** with Tailwind CSS plugin for class sorting
- **Husky** pre-commit hook runs `lint-staged`
- **lint-staged** runs ESLint + Prettier on staged files
- TypeScript strict mode enabled

### Adding a New Feature

1. Create `src/features/<feature>/` with the standard sub-folders
2. Define the public API in `index.ts`
3. Import from `@/features/<feature>` in pages or other features
4. Register any routes in `src/constants/routes.ts` if needed
5. Add feature-specific config to `src/config/features.ts` if needed

---

## Docker

### Development

```bash
# Start all services (app + MongoDB)
docker compose up

# Start only MongoDB (run app locally)
docker compose up mongo
```

The development Dockerfile uses hot-reload with mounted volumes.

### Production

```bash
# Build and run the standalone production image
docker build -t my-app .
docker run -p 3000:3000 --env-file .env.local my-app
```

The production Dockerfile uses Next.js `output: "standalone"` for minimal image size.

---

## Scripts

```bash
npm run        # List all available scripts
npm run dev    # Start development
npm run build  # Production build
npm run check  # Full quality check (typecheck + lint + format)
```

---

## Security

- Input validation on every server action via Zod
- Passwords hashed with bcrypt (cost factor 12)
- HTTP security headers (X-Frame-Options, X-Content-Type-Options, Referrer-Policy)
- Authentication-required middleware for `/dashboard/*` routes
- Role-based access control on protected routes
- API errors never leak internal details in production
- Secure cookies for session management
- CORS-safe image sources configured in `next.config.ts`
- Environment variables validated at startup with fail-fast

---

## License

MIT &mdash; see [LICENSE](LICENSE).

---

## Project Status

This boilerplate is actively maintained and designed for real-world use. Each feature module is fully typed, documented, and follows the same internal conventions so the project remains easy to understand after several years and across multiple developers.
