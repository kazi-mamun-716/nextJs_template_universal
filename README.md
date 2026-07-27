# Universal Next.js Boilerplate

A production-ready, feature-isolated Next.js boilerplate for building scalable web applications.

## Architecture

Feature-based architecture where each business domain owns its own components, actions, types, validation, services, and configuration.

```
src/
├── app/                      # Routing orchestration layer
├── features/                 # Domain & feature modules
│   ├── auth/                 # Authentication & authorization
│   ├── users/                # User management
│   ├── email/                # Email notifications
│   ├── upload/               # File uploads (Cloudinary)
│   ├── dashboard/            # Dashboard UI
│   ├── seo/                  # SEO utilities
│   └── theme/                # Theming
├── components/               # Shared UI components
│   ├── ui/                   # shadcn/ui primitives
│   ├── layout/               # Global layout components
│   └── common/               # Reusable composite components
├── hooks/                    # Global shared hooks
├── utils/                    # Pure utility functions
├── lib/                      # Third-party client initialization
├── config/                   # All configurable values
├── constants/                # Global constants
├── types/                    # Global type definitions
├── providers/                # React context providers
└── styles/                   # Global styles
```

## Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript (strict mode)
- **Styling:** Tailwind CSS v4 + shadcn/ui
- **Validation:** Zod + React Hook Form
- **Auth:** Auth.js v5
- **Database:** MongoDB + Mongoose
- **File Upload:** Cloudinary
- **Email:** Resend
- **Animations:** Framer Motion
- **Theming:** next-themes
- **Containerization:** Docker + Docker Compose

## Getting Started

### Prerequisites

- Node.js >= 20
- Docker (optional, for local MongoDB)

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd universal-nextjs-boilerplate

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env.local

# Fill in your environment variables
```

### Development

```bash
# Start development server (with Turbopack)
npm run dev

# Or with Docker (includes MongoDB)
docker compose up
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Commands

| Command                | Description                           |
| ---------------------- | ------------------------------------- |
| `npm run dev`          | Start development server              |
| `npm run build`        | Production build                      |
| `npm run start`        | Start production server               |
| `npm run lint`         | Run ESLint                            |
| `npm run lint:fix`     | Run ESLint with auto-fix              |
| `npm run format`       | Format code with Prettier             |
| `npm run format:check` | Check code formatting                 |
| `npm run typecheck`    | Run TypeScript type checking          |
| `npm run check`        | Run all checks (type + lint + format) |

## Adding a New Feature

```bash
# Create the feature structure
mkdir -p src/features/<feature-name>/{components,actions,services,repository,schemas,types,hooks,config,constants}
```

Each feature should follow the standard structure:

```
src/features/<feature>/
├── components/       # Feature-specific UI components
├── actions/          # Server Actions ("use server")
├── services/         # Business logic
├── repository/       # Data access layer (Mongoose queries)
├── schemas/          # Zod validation schemas
├── types/            # TypeScript interfaces
├── hooks/            # Feature-specific React hooks
├── config/           # Feature-specific configuration
├── constants/        # Feature-specific constants
├── permissions.ts    # Permission checks
├── routes.ts         # Route path constants
└── index.ts          # Public API barrel
```

## Coding Standards

- **Files:** Single responsibility, max ~200 lines
- **Functions:** Small, meaningful names, no abbreviations
- **Components:** Server-first, client only when needed
- **Imports:** External → Internal → Relative (with blank line separation)
- **Validation:** Zod schemas in every feature, shared between client and server
- **Errors:** Structured with custom `AppError` classes
- **Configuration:** Every value in `config/`, never hardcoded

## License

MIT
