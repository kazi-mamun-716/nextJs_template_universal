# Contributing Guide

> Guidelines for contributing to the Universal Next.js Boilerplate.

---

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Code Standards](#code-standards)
- [Adding a New Feature](#adding-a-new-feature)
- [Adding a New Page](#adding-a-new-page)
- [Adding a New API Route](#adding-a-new-api-route)
- [Testing](#testing)
- [Pull Request Process](#pull-request-process)
- [Commit Conventions](#commit-conventions)

---

## Code of Conduct

This project follows a **Contributor Covenant** code of conduct. Be respectful, constructive, and inclusive.

---

## Getting Started

### Prerequisites

- **Node.js** >= 20
- **npm** >= 10
- **MongoDB** (local, Atlas, or via Docker)
- (Optional) Cloudinary and Resend accounts for upload/email features

### Setup

```bash
# Clone the repository
git clone <repo-url>
cd nextJs-universal-template

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env.local

# Fill in your .env.local values
# At minimum: NEXT_PUBLIC_APP_URL, MONGODB_URI, AUTH_SECRET

# Start development server
npm run dev
```

### Development Scripts

| Script                 | Purpose                               |
| ---------------------- | ------------------------------------- |
| `npm run dev`          | Start dev server with Turbopack       |
| `npm run build`        | Production build                      |
| `npm run start`        | Start production server               |
| `npm run lint`         | Run ESLint                            |
| `npm run lint:fix`     | Auto-fix ESLint issues                |
| `npm run format`       | Format all files with Prettier        |
| `npm run format:check` | Check formatting (CI)                 |
| `npm run typecheck`    | TypeScript type checking              |
| `npm run check`        | Full check: typecheck + lint + format |
| `npm run db:seed`      | Seed demo data                        |

---

## Development Workflow

### 1. Create a Branch

```bash
git checkout -b feat/my-feature
git checkout -b fix/issue-description
git checkout -b docs/add-documentation
```

### 2. Make Changes

Follow the [Code Standards](#code-standards) below.

### 3. Run Checks Locally

```bash
npm run check
```

All checks must pass before committing.

### 4. Commit

```bash
git add -A
git commit -m "feat: add my feature"
```

Husky will run lint-staged (ESLint + Prettier) on staged files.

### 5. Push

```bash
git push origin feat/my-feature
```

---

## Code Standards

### TypeScript

- **Strict mode** enabled — avoid `any`, `as` casts, and `@ts-ignore`
- Use `type` over `interface` for union types; prefer `interface` for object shapes
- All exported functions must have typed parameters and return types
- Use `const` assertions (`as const`) for constants and enums
- Prefer `import type { ... }` for type-only imports

### Naming Conventions

| Construct            | Convention              | Example               |
| -------------------- | ----------------------- | --------------------- |
| **Files**            | kebab-case              | `user-profile.tsx`    |
| **Folders**          | kebab-case              | `user-profile/`       |
| **Components**       | PascalCase              | `UserProfile`         |
| **Functions**        | camelCase               | `getUserProfile()`    |
| **Variables**        | camelCase               | `userProfile`         |
| **Constants**        | UPPER_SNAKE_CASE        | `MAX_LOGIN_ATTEMPTS`  |
| **Types/Interfaces** | PascalCase              | `UserProfile`         |
| **React Hooks**      | camelCase, `use` prefix | `useUserProfile`      |
| **Server Actions**   | camelCase               | `updateProfileAction` |

### File Organization

- **One component per file** — no exceptions
- **One server action per file** — keep focused
- **Barrel exports** (`index.ts`) for every directory with multiple files
- **Colocate types** with their feature — global types only in `src/types/`

### Component Rules

- Separate UI from business logic
- Server Components by default, Client Components only when necessary
- Use `cn()` from `@/lib/utils` for conditional class names
- All reusable UI goes in `components/ui/`
- Feature components go in `features/<feature>/components/`

### Server Action Rules

```typescript
import { createAction } from "@/lib/api/action";
import { z } from "zod";

export const myAction = createAction({
  schema: z.object({ name: z.string().min(2) }),
  handler: async (input, context) => {
    // input is validated and typed
    // context.user has session data
    return { data: result };
  },
});
```

### API Route Handler Rules

```typescript
import { withAuth } from "@/lib/api/handler";
import { ok, notFound } from "@/lib/api/response";

export const GET = withAuth(async (request, context) => {
  const data = await getData(context.user.id);
  if (!data) return notFound();
  return ok(data);
});
```

### Import Order

```typescript
// 1. Node.js built-ins
import { randomBytes } from "crypto";

// 2. Third-party libraries
import { z } from "zod";
import { NextResponse } from "next/server";

// 3. Project infrastructure
import { appConfig } from "@/config";
import { auth } from "@/lib/auth";
import { cn } from "@/lib/utils";

// 4. Feature modules
import { authService } from "@/features/auth";

// 5. Constants & types
import { MESSAGES } from "@/constants/messages";
import type { User } from "@/types/user";

// 6. Relative imports (within same feature)
import { MyComponent } from "./my-component";
```

---

## Adding a New Feature

### Step 1: Create the Feature Module

```bash
mkdir -p src/features/my-feature/{components,actions,services,repository,models,schemas,hooks,types,constants}
```

### Step 2: Define Types

```typescript
// src/features/my-feature/types/index.ts
export interface MyFeatureData {
  id: string;
  name: string;
}
```

### Step 3: Implement Business Logic

```typescript
// src/features/my-feature/services/my-feature-service.ts
export const myFeatureService = {
  async doSomething(input: string): Promise<MyFeatureData> {
    // Business logic here
  },
};
```

### Step 4: Create Server Actions

```typescript
// src/features/my-feature/actions/my-action.ts
export const myAction = createAction({
  schema: z.object({ name: z.string() }),
  handler: async (input) => {
    return myFeatureService.doSomething(input.name);
  },
});
```

### Step 5: Create Components

```typescript
// src/features/my-feature/components/my-feature-form.tsx
"use client";
// Client Component with form
```

### Step 6: Create Barrel Export

```typescript
// src/features/my-feature/index.ts
export { myFeatureService } from "./services/my-feature-service";
export { myAction } from "./actions/my-action";
export { MyFeatureForm } from "./components/my-feature-form";
export type { MyFeatureData } from "./types";
```

### Step 7: Register Configuration (if needed)

```typescript
// src/config/features.ts — add feature flag
export const FEATURE_FLAGS = {
  "my-feature": false,
  // ...
};
```

### Step 8: Create Pages

```typescript
// src/app/(dashboard)/dashboard/my-feature/page.tsx
import { MyFeatureForm } from "@/features/my-feature";

export default function MyFeaturePage() {
  return <MyFeatureForm />;
}
```

---

## Adding a New Page

### Marketing Page

```bash
# Create the page
src/app/(marketing)/my-page/page.tsx

# Add to public routes in middleware.ts
const PUBLIC_ROUTES = new Set(["/", "/about", "/my-page", ...]);
```

### Dashboard Page

```bash
# Create authenticated page
src/app/(dashboard)/dashboard/my-section/page.tsx
```

### Authentication Page

```bash
# Create auth page
src/app/(auth)/login/page.tsx    # Already exists
src/app/(auth)/my-auth-page/page.tsx

# Add to AUTH_ROUTES in middleware.ts
```

---

## Adding a New API Route

```bash
# Create route handler
src/app/api/my-resource/route.ts
```

```typescript
import { withAuth, withErrorHandling } from "@/lib/api/handler";
import { ok } from "@/lib/api/response";

export const GET = withErrorHandling(async (request) => {
  const data = { message: "Hello" };
  return ok(data);
});
```

---

## Testing

### Unit Tests (Coming Soon)

Unit tests should be added alongside the code they test:

```
features/<feature>/__tests__/
├── my-service.test.ts
└── my-action.test.ts
```

### Manual Testing Checklist

Before submitting a PR:

- [ ] `npm run check` passes (typecheck + lint + format)
- [ ] App runs without console errors
- [ ] Auth flow works (login, register, protected routes)
- [ ] Forms validate correctly
- [ ] Error states display properly
- [ ] Mobile responsive layout works
- [ ] Dark mode doesn't break UI

---

## Pull Request Process

1. **Create a branch** from `main` with a descriptive name
2. **Make your changes** following the code standards
3. **Run `npm run check`** to ensure quality
4. **Update documentation** if adding/changing features
5. **Create a pull request** with:
   - Clear title and description
   - What was changed and why
   - Screenshots for UI changes
   - Any migration steps needed
6. **Address review feedback** — iterate until approved
7. **Merge** once approved (squash merge preferred)

### PR Title Format

```
feat: add user profile page
fix: resolve login redirect loop
docs: update architecture document
refactor: extract auth service
chore: update dependencies
```

---

## Commit Conventions

This project follows [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <description>

[optional body]
```

### Types

| Type       | Usage                   |
| ---------- | ----------------------- |
| `feat`     | New feature             |
| `fix`      | Bug fix                 |
| `docs`     | Documentation           |
| `refactor` | Code restructuring      |
| `test`     | Adding/updating tests   |
| `chore`    | Build, deps, tooling    |
| `style`    | Formatting only         |
| `perf`     | Performance improvement |

### Examples

```
feat(auth): add Google OAuth login
fix(middleware): correct redirect loop for public routes
docs: update folder structure guide
refactor(api): extract response builders into separate file
chore: upgrade next to 15.2.0
```

---

## Adding Environment Variables

1. Add the variable to `.env.example` with a comment
2. Add validation in `src/config/env.ts`
3. Add the variable to the configuration object in the relevant config file
4. Add documentation in `docs/DEPLOYMENT.md`

---

## Code Review Checklist

Reviewers will check for:

- [ ] Follows coding standards and conventions
- [ ] No `any` or `@ts-ignore` without justification
- [ ] Functions are small and focused
- [ ] No duplicate logic
- [ ] Error handling is implemented
- [ ] Input validation is present (Zod for forms/actions)
- [ ] Feature is properly exported through barrel
- [ ] Documentation is updated if needed
- [ ] No hardcoded values — uses config/constants
- [ ] TypeScript types are properly defined
- [ ] Server/Client component boundary is correct

---

## Questions?

If you have questions about the architecture or contribution process, check the existing documentation in `docs/` or open an issue.
