# Architecture Decision Document (ADD)

> **Universal Next.js Boilerplate**
> A production-ready, feature-isolated Next.js boilerplate for building scalable web applications.

---

## Table of Contents

1. [Overview](#1-overview)
2. [Principles](#2-principles)
3. [Folder Architecture](#3-folder-architecture)
4. [Dependency Flow](#4-dependency-flow)
5. [Module Architecture](#5-module-architecture)
6. [Data Flow](#6-data-flow)
7. [API Layer](#7-api-layer)
8. [Database Layer](#8-database-layer)
9. [State Management](#9-state-management)
10. [Authentication Flow](#10-authentication-flow)
11. [Security Architecture](#11-security-architecture)
12. [Scalability Strategy](#12-scalability-strategy)
13. [Future Expansion](#13-future-expansion)

---

## 1. Overview

This document explains the architectural decisions made in the Universal Next.js Boilerplate. The goal is to create a codebase that remains **maintainable, scalable, and readable** after several years and across multiple developers.

### Core Philosophy

> **"Business logic should be the only thing that changes between projects."**

Every piece of reusable infrastructure (auth, database, email, uploads, SEO, security, error handling, logging) is pre-built and documented. A new project using this boilerplate only needs to implement its unique business logic.

---

## 2. Principles

### 2.1 Feature-Based Architecture

Each feature is a **self-contained module** with its own components, actions, services, types, and constants. Features do not import directly from other features' internal files — they communicate through barrel exports (`index.ts`).

**Why:** Encapsulation prevents tight coupling. A feature can be modified, removed, or replaced without affecting others.

### 2.2 Separation of Concerns

- **UI Components** never contain business logic
- **Services** never contain UI logic
- **Repository** layer isolates database operations
- **Server Actions** handle request lifecycle (validate → auth → execute → respond)

### 2.3 Single Responsibility

Every file has exactly one responsibility:

- A component renders UI
- A service implements business logic
- A repository accesses the database
- A constant defines a value
- A type defines a contract

### 2.4 Composition over Inheritance

React components are composed from smaller primitives. Server actions use middleware-style composition (`withAuth`, `withValidation`, `withErrorHandling`).

### 2.5 Convention over Configuration

Project structure follows predictable patterns. Every feature module mirrors the same internal structure (`components/`, `services/`, `types/`, `constants/`, `index.ts`).

---

## 3. Folder Architecture

```
src/
├── app/                    # Next.js App Router — pages, layouts, API routes
├── components/             # Shared UI components (not feature-specific)
│   ├── ui/                 # Design system primitives (Button, Input, Card, etc.)
│   ├── layout/             # Layout components (Sidebar, Navbar, Footer, etc.)
│   └── common/             # Reusable composite components (DataTable, EmptyState, etc.)
├── config/                 # Centralized configuration (env, app, auth, etc.)
├── constants/              # Reusable constants (routes, roles, messages, regex, etc.)
├── features/               # Isolated feature modules
│   ├── auth/               # Authentication (login, register, password reset, email verification)
│   ├── dashboard/          # Dashboard pages, widgets, layout
│   ├── email/              # Transactional email templates & sending
│   ├── errors/             # Error boundaries, error pages, error logging
│   ├── logging/            # API logging, audit logging, dev logging
│   ├── security/           # HTTP headers, CSRF, rate limiting, sanitization, cookie service
│   ├── seo/                # Metadata, sitemap, robots, structured data
│   ├── theme/              # Theme toggle (light/dark/system)
│   ├── upload/             # File uploads via Cloudinary
│   └── users/              # User profiles, settings, account management
├── hooks/                  # Global shared React hooks
├── lib/                    # Infrastructure layer
│   ├── api/                # API helpers (response, errors, route handlers, action factory)
│   ├── db/                 # MongoDB connection, repository, transactions, indexes
│   └── validation/         # Zod field builders, refinements, utilities
├── providers/              # React context providers (Theme, Session, Toast, Confirm, Loading)
├── styles/                 # Global CSS (Tailwind imports)
├── types/                  # Global TypeScript types & interfaces
├── utils/                  # Reusable utility functions (date, slug, encryption, etc.)
└── middleware.ts           # Next.js middleware (auth, security headers)
```

### Key Decisions

| Decision                            | Rationale                                                                                                                         |
| ----------------------------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| **No top-level `shared/` folder**   | Prevents dumping ground for unrelated code. Shared code lives in `components/`, `lib/`, `utils/`, or `config/` depending on type. |
| **Feature modules own their types** | Types colocated with usage prevent type drift and make features portable.                                                         |
| **Config is centralized**           | Every configurable value lives in `config/` to prevent hardcoding.                                                                |
| **Barrel exports only**             | Features export a public API through `index.ts`. Internal files are implementation details.                                       |

---

## 4. Dependency Flow

```
┌────────────────────────────────────────────────────────────────────┐
│                         Pages (app/)                                │
│  Server Components ← → Client Components                           │
└────────────────────────────────┬───────────────────────────────────┘
                                 │ imports from
                                 ▼
┌────────────────────────────────────────────────────────────────────┐
│                      Features (features/)                           │
│  Each feature exposes: components, actions, services, types, hooks │
│                                                                     │
│  Rule: Features import only from:                                   │
│  • Shared infrastructure (components/ui, lib/, utils/, config/)     │
│  • Other features' barrel exports (features/*/index.ts)             │
└────────────────────────────────┬───────────────────────────────────┘
                                 │ imports from
                                 ▼
┌────────────────────────────────────────────────────────────────────┐
│                    Shared Infrastructure                             │
│                                                                     │
│  components/ ← ui/ → lib/ → config/ → constants/ → utils/ → types/ │
│             ← layout/                                               │
│             ← common/                                               │
└────────────────────────────────────────────────────────────────────┘
                                 │ imports from
                                 ▼
┌────────────────────────────────────────────────────────────────────┐
│                     Third-Party Libraries                           │
│  next, react, mongoose, next-auth, zod, resend, cloudinary, etc.   │
└────────────────────────────────────────────────────────────────────┘
```

---

## 5. Module Architecture

### 5.1 Feature Module Structure

Every feature module follows this standard structure:

```
features/<feature>/
├── actions/          # Server actions (business logic entry points)
├── components/       # Feature-specific React components
├── config/           # Feature-specific configuration (optional)
├── constants/        # Feature-specific constants
├── hooks/            # Feature-specific React hooks
├── models/           # Mongoose models (if feature owns data)
├── repository/       # Data access layer (if feature owns data)
├── schemas/          # Zod validation schemas
├── services/         # Business logic services
├── types/            # Feature-specific types
├── index.ts          # Barrel export (public API)
├── permissions.ts    # Permission definitions (optional)
└── routes.ts         # Route constants (optional)
```

### 5.2 Feature Communication Rules

1. Features **cannot** import direct internal paths from other features
2. Features **can** import from other features' `index.ts` (barrel export)
3. Features **can** import from shared infrastructure (`components/`, `lib/`, `utils/`, `config/`)
4. Features **should not** import from `app/`

### 5.3 Example: Auth Feature

```
features/auth/
├── actions/
│   ├── login.ts           # Login server action
│   ├── register.ts        # Register server action
│   ├── forgot-password.ts # Forgot password action
│   ├── reset-password.ts  # Reset password action
│   └── verify-email.ts    # Email verification action
├── components/
│   ├── login-form.tsx     # Login form (Client Component)
│   ├── register-form.tsx  # Registration form (Client Component)
│   ├── forgot-password-form.tsx
│   ├── reset-password-form.tsx
│   └── verify-email-form.tsx
├── hooks/
│   └── use-auth.ts        # Auth state hook
├── models/
│   ├── user.model.ts      # User Mongoose model
│   └── verification-token.model.ts
├── repository/
│   ├── user.repository.ts     # User data access
│   └── verification-token.repository.ts
├── schemas/
│   └── index.ts           # Zod schemas for auth forms
├── services/
│   └── auth-service.ts    # Core auth business logic
├── types/
│   └── index.ts           # Auth-specific types
├── config/
│   └── index.ts           # Auth feature configuration
├── constants/
│   └── index.ts           # Auth-specific messages, limits
├── permissions.ts         # Auth permission helpers
├── routes.ts              # Auth route constants
└── index.ts               # Public API barrel
```

---

## 6. Data Flow

### 6.1 Server Action Flow (Recommended)

```
User Action
    │
    ▼
Server Action (features/<feature>/actions/)
    │
    ├── 1. Validate input (Zod schema)
    ├── 2. Authenticate user (Auth.js session)
    ├── 3. Authorize (role/permission check)
    ├── 4. Execute business logic (service layer)
    ├── 5. Persist data (repository layer)
    └── 6. Return response ({ success, message, data })
```

### 6.2 Route Handler Flow (API Routes)

```
HTTP Request
    │
    ▼
Route Handler (app/api/<route>/route.ts)
    │
    ├── 1. Wrapped with withAuth() / withValidation()
    ├── 2. Authenticate / validate
    ├── 3. Execute business logic
    ├── 4. Return JSON via ok() / error() / paginated()
    └── 5. Errors caught by handleApiError()
```

### 6.3 Response Structure

All server actions return consistent responses:

```typescript
// Success
{ success: true, message: "Operation completed", data: {...} }

// Error
{ success: false, message: "Something went wrong", errors?: {...} }
```

All API routes return consistent JSON:

```typescript
// Success
{ success: true, message: "", data: {...} }

// Paginated
{ success: true, message: "", data: [...], meta: { total, page, pageSize, totalPages } }

// Error
{ success: false, message: "Error message", errors?: { field: ["error"] } }
```

---

## 7. API Layer

### 7.1 Route Handler Wrappers (`lib/api/handler.ts`)

| Wrapper                           | Purpose                                              |
| --------------------------------- | ---------------------------------------------------- |
| `withAuth(handler, options?)`     | Requires authentication, optionally checks roles     |
| `withValidation(request, schema)` | Parses and validates request body against Zod schema |
| `withErrorHandling(handler)`      | Catches errors and returns consistent JSON           |

### 7.2 Response Builders (`lib/api/response.ts`)

| Builder                   | HTTP Status | Use Case                |
| ------------------------- | ----------- | ----------------------- |
| `ok(data, message?)`      | 200         | Successful GET          |
| `created(data, message?)` | 201         | Successful POST         |
| `noContent()`             | 204         | Successful DELETE       |
| `badRequest(message)`     | 400         | Invalid input           |
| `unauthorized(message)`   | 401         | Not authenticated       |
| `forbidden(message)`      | 403         | No permission           |
| `notFound(message)`       | 404         | Resource not found      |
| `conflict(message)`       | 409         | Duplicate resource      |
| `validationError(errors)` | 422         | Field validation errors |
| `rateLimited(message)`    | 429         | Rate limit exceeded     |
| `serverError(message)`    | 500         | Unexpected errors       |

### 7.3 Action Factory (`lib/api/action.ts`)

```typescript
const myAction = createAction({
  schema: z.object({ name: z.string() }),
  handler: async (input, context) => {
    // input is validated
    // context has user session
    return { data: result };
  },
});
```

---

## 8. Database Layer

### 8.1 Architecture

```
Service/Server Action
    │
    ▼
Repository (features/<feature>/repository/)
    │
    ├── Extends BaseRepository (lib/db/base-repository.ts)
    ├── Inherits CRUD operations (create, findById, findOne, findMany, update, delete)
    ├── Adds feature-specific query methods
    └── Uses Mongoose model
```

### 8.2 Base Repository (`lib/db/base-repository.ts`)

Provides standardized CRUD operations:

| Method                       | Description                             |
| ---------------------------- | --------------------------------------- |
| `create(data)`               | Create one document                     |
| `findById(id, select?)`      | Find by MongoDB ObjectId                |
| `findOne(filter, select?)`   | Find one matching document              |
| `findMany(filter, options?)` | Find many with pagination, sort, select |
| `updateById(id, data)`       | Update by ID                            |
| `deleteById(id)`             | Soft-delete by ID                       |
| `count(filter)`              | Count matching documents                |
| `exists(filter)`             | Check if any document matches           |

### 8.3 Connection (`lib/db/connection.ts`)

- Singleton MongoDB connection via Mongoose
- Connection caching for serverless environments
- Graceful error handling with retry
- Event listeners for connection status

### 8.4 Transactions (`lib/db/transactions.ts`)

```typescript
import { withTransaction } from "@/lib/db/transactions";

const result = await withTransaction(async (session) => {
  const user = await UserModel.create([{ email }], { session });
  const profile = await ProfileModel.create([{ userId: user[0]._id }], { session });
  return profile;
});
```

---

## 9. State Management

### 9.1 Guidelines

| Approach              | When to Use                                               |
| --------------------- | --------------------------------------------------------- |
| **Server Components** | Default — fetch data directly, no client state needed     |
| **Client Components** | When interactivity is required (forms, menus, toggles)    |
| **React Context**     | Global concerns only (theme, session, toasts, loading)    |
| **URL State**         | Shareable state (search params, filters, page number)     |
| **Redux/Zustand**     | Not used — avoid unless complex global state is justified |

### 9.2 Provider Architecture

```
Providers (src/providers/)
├── ThemeProvider       → next-themes (light/dark/system)
├── SessionProvider     → Auth.js session (NextAuthProvider)
├── ToastProvider       → sonner (toast notifications)
├── ConfirmProvider     → Custom confirm dialog context
├── LoadingProvider     → Global loading state context
└── index.tsx           → Combined Providers wrapper
```

---

## 10. Authentication Flow

### 10.1 Auth.js Configuration (`lib/auth.ts`)

```
Strategy: JWT (no database sessions)
Providers:
  ├── Credentials → email + password (bcrypt-verified)
  ├── Google (optional)
  └── GitHub (optional)

Callbacks:
  ├── jwt → Enriches token with user ID, role
  └── session → Enriches session with user ID, role, name, email
```

### 10.2 Authentication Flow

```
Login
  │
  ├── 1. Submit email + password
  ├── 2. Auth.js validates credentials (bcrypt.compare)
  ├── 3. JWT token created with user metadata
  ├── 4. Session stored in httpOnly cookie
  └── 5. Redirect to dashboard

Register
  │
  ├── 1. Submit email + password + name
  ├── 2. Validate with Zod schema
  ├── 3. Hash password (bcrypt, cost 12)
  ├── 4. Create user in MongoDB
  ├── 5. Optionally send verification email
  ├── 6. Auto-login via signIn("credentials")
  └── 7. Redirect to dashboard
```

### 10.3 Route Protection (`middleware.ts`)

```
Request
  │
  ├── /_next, /static, /favicon → skip
  ├── /api/auth → skip (Auth.js routes)
  ├── /login, /register, etc. → if authenticated, redirect to /dashboard
  ├── / → public
  ├── /about, /contact, etc. → public
  ├── /dashboard/* → require authentication + role check
  │   ├── /dashboard/users, /dashboard/settings → require admin
  │   └── other dashboard routes → require any authenticated user
  ├── /api/* (protected) → require authentication → JSON 401 if not
  └── All responses get security headers applied
```

---

## 11. Security Architecture

### 11.1 Layers

```
┌─────────────────────────────────────────────────────────────────────┐
│                        middleware.ts                                 │
│  Applied to every response:                                         │
│  ├─ Content-Security-Policy                                         │
│  ├─ Strict-Transport-Security (HSTS)                                │
│  ├─ X-Content-Type-Options: nosniff                                 │
│  ├─ X-Frame-Options: DENY                                           │
│  ├─ Referrer-Policy: strict-origin-when-cross-origin               │
│  └─ Permissions-Policy (24 features restricted by default)          │
├─────────────────────────────────────────────────────────────────────┤
│                        Security Services                             │
│                                                                     │
│  CSRF Service (features/security/services/csrf.ts)                  │
│  ├─ HMAC-based token generation + validation                        │
│  ├─ Timing-safe signature comparison                                │
│  └─ Protect POST/PUT/PATCH/DELETE endpoints                         │
│                                                                     │
│  Rate Limiter (features/security/services/rate-limiter.ts)          │
│  ├─ In-memory sliding window                                        │
│  ├─ 7 presets: api, auth, login, passwordReset, email, upload, dash │
│  ├─ Automatic 60s cleanup interval                                  │
│  └─ Configurable via feature flag                                   │
│                                                                     │
│  Cookie Service (features/security/services/cookie-service.ts)      │
│  ├─ Secure defaults (httpOnly, secure, sameSite)                    │
│  ├─ Session (7d) and persistent (30d) cookie helpers                │
│  └─ clearAll() for logout                                           │
│                                                                     │
│  Sanitizer (features/security/services/sanitizer.ts)                │
│  ├─ String sanitization (XSS, HTML, entities)                       │
│  ├─ Deep object sanitization (recursive, skip-keys)                 │
│  ├─ SQL injection pattern detection (12 patterns)                   │
│  └─ URL sanitization (blocks javascript:/data: URIs)               │
│                                                                     │
│  Validation (features/security/services/validation.ts)              │
│  ├─ Origin/IP validation                                            │
│  └─ Pre-sanitize + Zod validation pipeline                         │
└─────────────────────────────────────────────────────────────────────┘
```

### 11.2 API Error Classes (`lib/api/errors.ts`)

| Error               | Status | When              |
| ------------------- | ------ | ----------------- |
| `ApiError`          | Varies | Base class        |
| `BadRequestError`   | 400    | Malformed input   |
| `UnauthorizedError` | 401    | Not logged in     |
| `ForbiddenError`    | 403    | No permission     |
| `NotFoundError`     | 404    | Resource missing  |
| `ConflictError`     | 409    | Duplicate         |
| `ValidationError`   | 422    | Field validation  |
| `RateLimitError`    | 429    | Too many requests |

---

## 12. Scalability Strategy

### 12.1 Horizontal Scaling

- **Stateless Authentication**: JWT-based sessions require no server-side session store
- **Connection Pooling**: MongoDB connection is cached and reused
- **Rate Limiting**: In-memory store for single-instance; Redis adapter planned for multi-instance
- **Static Generation**: SEO pages can be statically generated

### 12.2 Codebase Scaling

- **Feature Isolation**: Adding new features never requires modifying existing ones
- **Barrel Exports**: Public API boundaries prevent internal coupling
- **Config-Driven**: Feature flags control module activation without code changes
- **Consistent Patterns**: Every feature follows the same structure — less cognitive load

### 12.3 Performance Considerations

- Server Components by default (zero client JS)
- Client Components only when interactivity is needed
- Optimized images via Next.js Image component
- Standalone output for minimal Docker images
- Turbopack for fast development builds

---

## 13. Future Expansion

The architecture is designed to accommodate future modules without restructuring:

| Module                    | Integration Point                                         |
| ------------------------- | --------------------------------------------------------- |
| **Blog**                  | New `features/blog/` module + `app/blog/` pages           |
| **Billing/Subscriptions** | New `features/billing/` module + Stripe integration       |
| **AI Features**           | New `features/ai/` module + AI provider service           |
| **Notifications**         | New `features/notifications/` module + WebSocket/polling  |
| **Analytics**             | Extend `features/dashboard/` or new `features/analytics/` |
| **CMS**                   | New `features/cms/` module + admin dashboard pages        |
| **Chat**                  | New `features/chat/` module + WebSocket integration       |
| **n8n Integration**       | New webhook handler in `app/api/webhooks/n8n/`            |

### Adding a New Feature

```bash
# 1. Create the feature module
mkdir -p src/features/my-feature/{components,actions,services,repository,models,schemas,hooks,types,constants}

# 2. Define public API in index.ts
touch src/features/my-feature/index.ts

# 3. Register routes in constants/routes.ts (if needed)
# 4. Add feature config in config/features.ts (if needed)
# 5. Create pages in app/ that import from @/features/my-feature
```

---

## Decision Records

### ADR-001: Feature-Based Architecture over Layered Architecture

- **Context**: Need to organize code for long-term maintainability
- **Decision**: Group code by feature domain, not by technical layer
- **Consequence**: Higher initial setup per feature, but lower coupling and better isolation

### ADR-002: JWT Sessions over Database Sessions

- **Context**: Authentication session storage strategy
- **Decision**: Use Auth.js JWT strategy (no database sessions)
- **Consequence**: No database query needed for session lookup; tokens can't be revoked server-side

### ADR-003: Repository Pattern over Direct Model Usage

- **Context**: Database access from services
- **Decision**: Wrap Mongoose models in repository classes
- **Consequence**: Testability, swapability, centralized query logic

### ADR-004: Server Actions over API Routes (where possible)

- **Context**: Data mutation approach
- **Decision**: Use Next.js Server Actions for mutations, API routes only for non-form clients
- **Consequence**: Progressive enhancement, less boilerplate, same validation pipeline

### ADR-005: Centralized Configuration

- **Context**: Configuration management
- **Decision**: All configurable values in `config/`, validated at startup via Zod
- **Consequence**: No hardcoded values, fail-fast on misconfiguration, single source of truth

### ADR-006: In-Memory Rate Limiting over External Store

- **Context**: Rate limiting strategy
- **Decision**: Start with in-memory store, plan Redis adapter
- **Consequence**: Simple setup for single-instance deployments; migration needed for horizontal scaling
