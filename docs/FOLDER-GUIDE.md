# Folder Structure Guide

> A comprehensive guide to every folder in the project, explaining its purpose, contents, and conventions.

---

## Root Directory

```
nextJs-universal-template/
├── .husky/             # Git hooks (pre-commit runs lint-staged)
├── .vscode/            # VS Code workspace settings
├── docs/               # Project documentation
├── public/             # Static assets (images, fonts, robots.txt)
├── scripts/            # Utility scripts (db seed, etc.)
├── src/                # Application source code
├── .dockerignore       # Files to exclude from Docker build
├── .env.example        # Template for environment variables
├── .eslintignore       # Files excluded from ESLint
├── .gitignore          # Files excluded from Git
├── .prettierrc         # Prettier configuration
├── .prettierignore     # Files excluded from Prettier
├── docker-compose.yml  # Docker Compose (app + MongoDB)
├── Dockerfile          # Production Docker image
├── Dockerfile.dev      # Development Docker image
├── next.config.ts      # Next.js configuration
├── package.json        # Dependencies and scripts
├── postcss.config.mjs  # PostCSS configuration (Tailwind)
├── tailwind.config.ts  # Tailwind CSS configuration
└── tsconfig.json       # TypeScript configuration
```

---

## `src/` — Application Source Code

### `src/app/` — Next.js App Router Pages

**Purpose**: Defines all routes, layouts, and page components. This is the entry point for the application.

```
app/
├── (auth)/                  # Auth route group (no layout inheritance)
│   ├── forgot-password/     # Forgot password page
│   ├── login/               # Login page
│   ├── register/            # Registration page
│   ├── reset-password/      # Password reset page
│   └── verify-email/        # Email verification page
│
├── (dashboard)/             # Dashboard route group
│   └── dashboard/           # Dashboard routes
│       ├── layout.tsx       # Dashboard layout (sidebar + navbar + breadcrumbs)
│       ├── page.tsx         # Dashboard home (widgets, stats)
│       ├── analytics/       # Analytics page
│       ├── profile/         # User profile page
│       └── settings/        # User settings page
│
├── (marketing)/             # Public marketing route group
│   ├── page.tsx             # Landing page
│   ├── about/               # About page
│   ├── contact/             # Contact page
│   ├── faq/                 # FAQ page
│   ├── pricing/             # Pricing page
│   ├── privacy/             # Privacy policy
│   └── terms/               # Terms of service
│
├── api/                     # API route handlers
│   ├── auth/                # Auth.js API routes [...nextauth]
│   ├── health/              # Health check endpoint
│   ├── upload/avatar/       # Avatar upload endpoint
│   └── webhooks/            # Webhook handlers
│
├── error.tsx                # 500 error page (Client Component)
├── global-error.tsx         # Critical error page (own <html>)
├── layout.tsx               # Root layout (fonts, metadata, providers)
├── loading.tsx              # Global loading state
├── not-found.tsx            # 404 page
├── robots.ts                # Dynamic robots.txt
└── sitemap.ts               # Dynamic sitemap.xml
```

**Conventions:**

- Route groups `(name)` organize pages without affecting URLs
- Page files are `page.tsx`, layouts are `layout.tsx`
- API routes are `route.ts` inside `api/*`
- Error pages are `error.tsx` (500) and `not-found.tsx` (404)

---

### `src/components/` — Shared UI Components

**Purpose**: Reusable components that are not specific to any feature.

```
components/
├── ui/                  # Design system primitives (shadcn/ui style)
│   ├── avatar.tsx       # User avatar with fallback
│   ├── badge.tsx        # Status/category badge
│   ├── button.tsx       # Button with variants (primary, secondary, ghost, etc.)
│   ├── card.tsx         # Card container
│   ├── dialog.tsx       # Modal dialog
│   ├── input.tsx        # Form input with label + error
│   ├── label.tsx        # Form label
│   ├── loader.tsx       # Loading spinner
│   ├── skeleton.tsx     # Skeleton loading placeholder
│   └── table.tsx        # Data table
│
├── layout/              # Layout components
│   ├── breadcrumb.tsx   # Auto-generated breadcrumb navigation
│   ├── container.tsx    # Max-width content container
│   ├── footer.tsx       # Site footer
│   ├── grid.tsx         # Responsive grid layout
│   ├── navbar.tsx       # Top navigation bar
│   ├── page-header.tsx  # Page title + description header
│   ├── section.tsx      # Content section wrapper
│   └── sidebar.tsx      # Collapsible sidebar navigation
│
└── common/              # Common reusable composites
    ├── confirm-dialog.tsx  # Confirmation dialog
    ├── data-table.tsx      # Data table with sorting/pagination
    ├── empty-state.tsx     # Empty state display
    ├── error-state.tsx     # Error state display
    ├── loading-spinner.tsx # Loading spinner with optional message
    ├── pagination.tsx      # Page navigation controls
    ├── search-input.tsx    # Search input with debounce
    ├── skeleton.tsx        # Skeleton loading screen
    └── status-badge.tsx    # Status indicator badge
```

**Conventions:**

- UI components are dumb — no business logic
- All UI components accept `className` for styling overrides
- Components use `cn()` from `@/lib/utils` for class merging
- Layout components manage positioning and spacing

---

### `src/config/` — Centralized Configuration

**Purpose**: Every configurable value in the application. Nothing should be hardcoded.

```
config/
├── app.ts           # Application metadata (name, URL, description)
├── auth.ts          # Authentication settings (providers, callbacks)
├── cors.ts          # CORS configuration (origins, methods, headers)
├── database.ts      # MongoDB connection settings
├── email.ts         # Email provider settings (Resend)
├── env.ts           # Zod-validated environment variables
├── features.ts      # Feature flags (togglable modules)
├── index.ts         # Barrel export
├── pagination.ts    # Pagination defaults
├── security.ts      # Security configuration (headers, CSRF, rate limits)
├── seo.ts           # SEO defaults (title, description, OG, Twitter)
├── upload.ts        # Upload settings (max size, formats, Cloudinary)
└── validator.ts     # Cross-config validation
```

**Conventions:**

- Import configs via `@/config` or `@/config/<name>`
- Environment variables are validated in `env.ts` at startup (fail-fast)
- Feature flags can be toggled via environment variables

---

### `src/constants/` — Reusable Constants

**Purpose**: Centralizes all constants to prevent typos and ensure consistency.

```
constants/
├── api-status.ts       # HTTP status codes and status messages
├── cookie-keys.ts      # Cookie name constants + cookie config defaults
├── index.ts            # Barrel export
├── messages.ts         # All user-facing messages (success, error, validation)
├── permissions.ts      # Permission definitions
├── regex.ts            # Regular expression patterns (email, password, URL, etc.)
├── roles.ts            # Role definitions (admin, user, etc.)
├── routes.ts           # Route path constants
└── storage-keys.ts     # localStorage/sessionStorage key constants
```

**Conventions:**

- Constants are `as const` for type safety
- Grouped by domain with section comments
- Import via `@/constants` or `@/constants/<name>`

---

### `src/features/` — Isolated Feature Modules

**Purpose**: Self-contained modules, each owning its complete business logic.

```
features/
├── auth/           # Authentication (login, register, password reset, email verification)
├── dashboard/      # Dashboard widgets, hooks, routes
├── email/          # Transactional email templates + sending
├── errors/         # Error boundaries, error pages, error logging
├── logging/        # API logging, audit logging, dev logging
├── security/       # HTTP security headers, CSRF, rate limiting, sanitization, cookies
├── seo/            # Metadata generation, sitemap, robots, structured data
├── theme/          # Theme toggle (light/dark/system)
├── upload/         # File uploads (Cloudinary)
└── users/          # User profiles, settings, account management
```

#### Standard Feature Structure

```
features/<feature>/
├── actions/        # Server actions
├── components/     # Feature-specific React components
├── config/         # Feature configuration
├── constants/      # Feature-specific constants
├── hooks/          # Client-side hooks
├── models/         # Mongoose models (if feature owns data)
├── repository/     # Data access layer
├── schemas/        # Zod validation schemas
├── services/       # Business logic services
├── types/          # TypeScript types
├── utils/          # Feature-specific utilities
├── index.ts        # Barrel export (public API)
├── permissions.ts  # Permission checks
└── routes.ts       # Route constants
```

---

### `src/hooks/` — Global Shared Hooks

**Purpose**: Reusable React hooks used across features.

```
hooks/
├── use-click-outside.ts       # Detect clicks outside an element
├── use-copy-to-clipboard.ts   # Copy text to clipboard
├── use-debounce.ts            # Debounce a value
├── use-intersection-observer.ts # Intersection Observer hook
├── use-local-storage.ts       # localStorage with SSR safety
└── use-media-query.ts         # Responsive media query hook
```

**Conventions:**

- Feature-specific hooks live in `features/<feature>/hooks/`
- Only globally reusable hooks go here

---

### `src/lib/` — Infrastructure Layer

**Purpose**: Core infrastructure that supports all features.

```
lib/
├── api/                  # API infrastructure
│   ├── action.ts         # createAction factory (validation + auth + handler)
│   ├── errors.ts         # API error classes (ApiError, NotFoundError, etc.)
│   ├── handler.ts        # Route handler wrappers (withAuth, withValidation)
│   ├── index.ts          # Barrel export
│   └── response.ts       # Response builders (ok, error, paginated, etc.)
│
├── db/                   # Database infrastructure
│   ├── base-repository.ts # Generic CRUD repository
│   ├── connection.ts     # MongoDB connection singleton
│   ├── errors.ts         # Database-specific errors
│   ├── helpers.ts        # Database helper utilities
│   ├── index.ts          # Barrel export
│   ├── indexes.ts        # Database index definitions
│   └── transactions.ts   # Transaction helper
│
├── validation/           # Validation infrastructure
│   ├── fields.ts         # Reusable Zod field builders
│   ├── index.ts          # Barrel export
│   ├── refinements.ts    # Common Zod refinements
│   └── utils.ts          # Validation utility functions
│
├── auth.ts               # Auth.js configuration
├── db.ts                 # Database connection wrapper
└── utils.ts              # Shared utility (cn, etc.)
```

---

### `src/providers/` — React Context Providers

**Purpose**: Global React context providers for cross-cutting concerns.

```
providers/
├── confirm-provider.tsx    # Confirm dialog context
├── index.tsx               # Combined Providers wrapper
├── loading-provider.tsx    # Global loading state
├── session-provider.tsx    # Auth.js session context
├── theme-provider.tsx      # Theme (light/dark/system)
└── toast-provider.tsx      # Toast notification context (sonner)
```

**Conventions:**

- Providers are composed in `index.tsx` and wrapped around the root layout
- Only globally necessary contexts live here
- Feature-specific contexts stay in their feature module

---

### `src/styles/` — Global Styles

```
styles/
└── globals.css   # Tailwind directives + global CSS variables + base styles
```

---

### `src/types/` — Global TypeScript Types

**Purpose**: Shared type definitions used across the entire project.

```
types/
├── api.ts              # API response types (ApiResponse, PaginatedResponse)
├── common.ts           # Common shared types (PaginationParams, etc.)
├── global.d.ts         # Global type augmentations
├── index.ts            # Barrel export
├── models.ts           # Generic model types
├── next-auth.d.ts      # Auth.js type augmentation
├── next.ts             # Next.js utility types
├── theme.ts            # Theme types
└── user.ts             # User-related types
```

**Conventions:**

- Feature-specific types live in `features/<feature>/types/`
- Only globally shared types go here

---

### `src/utils/` — Reusable Utilities

**Purpose**: Pure utility functions organized by domain.

```
utils/
├── array/              # Array helpers (chunk, unique, groupBy, shuffle)
├── date/               # Date helpers (format, relative, range, timezone)
├── encryption/         # Encryption/decryption utilities
├── formatter/          # Formatting helpers (currency, percentage, ordinal)
├── number/             # Number helpers (clamp, round, random, range)
├── object/             # Object helpers (pick, omit, deepMerge, deepClone)
├── slug/               # Slug generation utilities
├── string/             # String helpers (truncate, sanitize, case conversion)
├── token/              # Token generation utilities
├── errors.ts           # AppError class hierarchy
├── formatter.ts        # General formatting utilities
├── index.ts            # Barrel export
├── logger.ts           # Structured logger (console-based)
├── pagination.ts       # Pagination calculation helpers
└── response.ts         # Response formatters
```

**Conventions:**

- Pure functions only — no side effects
- Organized by domain into subdirectories
- Each subdirectory has an `index.ts` barrel export
- Feature-specific utilities stay in their feature module

---

### Root Files in `src/`

```
src/
├── middleware.ts    # Next.js middleware (auth + security headers)
└── (directories listed above)
```

#### `middleware.ts`

Handles two concerns:

1. **Authentication** — redirects unauthenticated users, checks roles
2. **Security Headers** — applies CSP, HSTS, X-Frame-Options, etc. to every response

The middleware runs on every request except static files and Next.js internals. It uses a lazy-cached singleton for security headers to avoid rebuilding on every request.

---

## Documentation Files

```
docs/
├── ARCHITECTURE.md     # Architecture Decision Document (ADD)
├── CONTRIBUTING.md     # Contribution guidelines
├── DEPLOYMENT.md       # Deployment instructions
└── FOLDER-GUIDE.md     # This file
```

---

## Configuration Files

| File                 | Purpose                            |
| -------------------- | ---------------------------------- |
| `.env.example`       | Environment variable template      |
| `.eslintrc.json`     | ESLint configuration (flat config) |
| `.gitignore`         | Git exclusion rules                |
| `.prettierrc`        | Prettier formatting rules          |
| `.prettierignore`    | Files excluded from formatting     |
| `docker-compose.yml` | Docker Compose services            |
| `Dockerfile`         | Production build                   |
| `Dockerfile.dev`     | Development build with hot reload  |
| `next.config.ts`     | Next.js configuration              |
| `package.json`       | Dependencies, scripts, metadata    |
| `postcss.config.mjs` | PostCSS + Tailwind                 |
| `tailwind.config.ts` | Tailwind theme customization       |
| `tsconfig.json`      | TypeScript compiler options        |
