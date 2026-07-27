# Testing Architecture

> Comprehensive guide to testing in the Universal Next.js Boilerplate.

---

## Table of Contents

1. [Testing Philosophy](#1-testing-philosophy)
2. [Test Pyramid](#2-test-pyramid)
3. [Tooling Overview](#3-tooling-overview)
4. [Vitest Configuration](#4-vitest-configuration)
5. [Test Utilities](#5-test-utilities)
6. [Component Testing (Testing Library)](#6-component-testing-testing-library)
7. [Hook Testing](#7-hook-testing)
8. [Server Action Testing](#8-server-action-testing)
9. [API Route Testing](#9-api-route-testing)
10. [Utility Testing](#10-utility-testing)
11. [E2E Testing (Playwright)](#11-e2e-testing-playwright)
12. [Test Structure Conventions](#12-test-structure-conventions)
13. [Coverage](#13-coverage)
14. [Best Practices](#14-best-practices)
15. [Troubleshooting](#15-troubleshooting)

---

## 1. Testing Philosophy

### Goals

- **Catch regressions early** — Every pull request should run the full suite before merge.
- **Document behavior** — Tests should serve as executable documentation for how code works.
- **Enable refactoring** — A good test suite gives confidence to restructure code.
- **Balance speed and confidence** — Unit tests are fast (milliseconds). E2E tests are slow (seconds). Prioritize unit tests.

### What to Test

| Layer                     | Priority             | Tools                       | Environment |
| ------------------------- | -------------------- | --------------------------- | ----------- |
| Utility functions         | ✅ Always            | Vitest                      | `node`      |
| Components (logic)        | ✅ Always            | Vitest + Testing Library    | `jsdom`     |
| Components (visual)       | 🟡 When complex      | Storybook (future)          | `jsdom`     |
| Hooks                     | ✅ Always            | Vitest + Testing Library    | `jsdom`     |
| Server Actions            | ✅ Always            | Vitest (mocked auth)        | `node`      |
| API Routes                | ✅ Always            | Vitest (mocked next/server) | `node`      |
| Services / Business Logic | ✅ Always            | Vitest                      | `node`      |
| Data Access (Repository)  | 🟡 Integration tests | Vitest + in-memory DB       | `node`      |
| E2E Flows                 | 🟡 Critical paths    | Playwright                  | Browser     |
| Visual Regression         | 🔴 Future            | Playwright Screenshot       | Browser     |

---

## 2. Test Pyramid

```
        ╱╲
       ╱  ╲         E2E (Playwright)
      ╱    ╲        Critical user journeys
     ╱──────╲
    ╱        ╲      Integration
   ╱          ╲     Feature interactions, API routes, services
  ╱────────────╲
 ╱              ╲   Unit (Vitest + Testing Library)
╱                ╲  Utilities, helpers, components, hooks, actions
```

- **Base**: Fast unit tests covering utilities, components, hooks, server actions
- **Middle**: Integration tests covering API routes, service layers, data access
- **Top**: A few critical E2E flows (auth, payments, core CRUD)

---

## 3. Tooling Overview

| Tool                                            | Purpose                        | Configuration                            |
| ----------------------------------------------- | ------------------------------ | ---------------------------------------- |
| [Vitest](https://vitest.dev/)                   | Unit & integration test runner | `vitest.config.ts`                       |
| [Testing Library](https://testing-library.com/) | Component & hook testing       | Via `@/test/render-utils`                |
| [Playwright](https://playwright.dev/)           | E2E browser testing            | `playwright.config.ts`                   |
| [jsdom](https://github.com/jsdom/jsdom)         | DOM environment for components | Per-file via `@vitest-environment jsdom` |

### Scripts

```bash
# Run all unit/integration tests
npm run test

# Watch mode
npm run test:watch

# With coverage
npm run test:coverage

# E2E tests (requires build)
npm run test:e2e

# E2E with UI mode
npm run test:e2e:ui
```

---

## 4. Vitest Configuration

The configuration is defined in `vitest.config.ts`:

### Key Settings

```typescript
export default defineConfig({
  test: {
    globals: true, // No need to import describe/it/expect
    include: ["src/**/*.test.{ts,tsx}"], // Test file discovery
    environment: "node", // Default environment
    setupFiles: ["./src/test/setup-node.ts"], // Global setup
    testTimeout: 10_000,
    clearMocks: true, // Auto-clear between tests
    restoreMocks: true, // Auto-restore between tests
    coverage: {
      provider: "v8",
      reporter: ["text", "html", "lcov"],
      thresholds: {
        statements: 80,
        branches: 75,
        functions: 80,
        lines: 80,
      },
    },
  },
});
```

### Environment Override

Add this comment at the **top** of any test file that needs a DOM environment:

```typescript
// @vitest-environment jsdom
```

### Path Aliases

All `tsconfig.json` path aliases are available in tests:

```typescript
import { auth } from "@/lib/auth"; // src/lib/auth
import { render } from "@/test/render-utils"; // src/test/render-utils
import { mockUser } from "@/test"; // src/test
```

---

## 5. Test Utilities

The `src/test/` directory provides shared utilities for all tests.

### 5.1 Render Utilities (`src/test/render-utils.tsx`)

Provides a custom `render` function that wraps components with necessary providers.

```typescript
import { render, screen } from "@/test/render-utils";

it("renders with providers", () => {
  render(<MyComponent />);
  expect(screen.getByText("Hello")).toBeInTheDocument();
});
```

**Included providers:**

- `ThemeProvider` (next-themes) — for theme-aware components
- `ToastProvider` (sonner) — for toast notifications

**Explicitly omitted** (add manually when needed):

- `SessionProvider` — mock at test level with `vi.mock()`
- `ConfirmProvider` — only needed if testing confirm dialogs
- `LoadingProvider` — only needed if testing loading state

**User-event integration:**

```typescript
const { user } = render(<MyForm />);
await user.type(screen.getByLabelText("Name"), "John");
await user.click(screen.getByRole("button", { name: /submit/i }));
```

### 5.2 DOM Setup (`src/test/setup-dom.ts`)

Automatically loaded when any test file uses `@vitest-environment jsdom`. Provides mocks for:

| Mock                          | Reason                                |
| ----------------------------- | ------------------------------------- |
| `IntersectionObserver`        | Used by infinite scroll components    |
| `ResizeObserver`              | Used by responsive components         |
| `window.matchMedia`           | Used by next-themes, responsive hooks |
| `scrollTo` / `scrollIntoView` | Used by scroll-to behaviors           |

### 5.3 Node Setup (`src/test/setup-node.ts`)

Loaded for all test environments (including jsdom). Provides:

- **Fetch mock**: Clear error if `fetch` is used without mocking
- **Console error filtering**: Suppress expected error patterns
- **NODE_ENV**: Always `"test"`

### 5.4 Mock Factories (`src/test/mock-factories.ts`)

```typescript
import { mockUser, mockSession, mockRequest, mockApiResponse } from "@/test";

// User & Session
const user = mockUser({ role: "admin" });
const session = mockSession({ user: { role: "admin" } });

// NextRequest-like object
const req = mockRequest({ url: "/api/users", method: "POST" });

// API Response shapes
const res = mockApiResponse({ success: true, data: { id: "123" } });

// Pagination
const pagination = mockPagination({ page: 1, total: 50 });

// FormData (for server action tests)
const formData = createFormData({ name: "John", email: "john@example.com" });

// MongoDB ObjectId
const id = mockObjectId();
```

### 5.5 Test Data Builders (`src/test/test-data.ts`)

```typescript
import { buildUser, buildAdmin, buildArticle, buildCategory } from "@/test";

const user = buildUser(); // Unique email each call
const admin = buildAdmin(); // role: "admin"
const article = buildArticle({ authorId: user.id });
const category = buildCategory();
```

**Always start from this module when you need test data.** Never manually construct test objects inline.

---

## 6. Component Testing (Testing Library)

### 6.1 File Location and Naming

```
src/components/ui/button.tsx
src/components/ui/__tests__/button.test.tsx    ← ✅ Co-located in __tests__ dir

src/components/common/empty-state.tsx
src/components/common/__tests__/empty-state.test.tsx
```

### 6.2 Basic Pattern

```typescript
// @vitest-environment jsdom
import { describe, it, expect } from "vitest";
import { render, screen } from "@/test/render-utils";
import { Button } from "../button";

describe("Button", () => {
  it("renders children text", () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole("button", { name: /click me/i })).toBeInTheDocument();
  });

  it("applies variant classes", () => {
    render(<Button variant="destructive">Delete</Button>);
    const button = screen.getByRole("button");
    expect(button.className).toContain("bg-destructive");
  });
});
```

### 6.3 User Interaction

```typescript
// @vitest-environment jsdom
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@/test/render-utils";
import { Button } from "../button";

describe("Button", () => {
  it("calls onClick when clicked", async () => {
    const onClick = vi.fn();
    const { user } = render(<Button onClick={onClick}>Click</Button>);

    await user.click(screen.getByRole("button"));
    expect(onClick).toHaveBeenCalledTimes(1);
  });
});
```

### 6.4 Testing Stateful Components

```typescript
// @vitest-environment jsdom
import { describe, it, expect } from "vitest";
import { render, screen } from "@/test/render-utils";
import { Counter } from "./counter";

describe("Counter", () => {
  it("starts at 0", () => {
    render(<Counter />);
    expect(screen.getByText("0")).toBeInTheDocument();
  });

  it("increments on click", async () => {
    const { user } = render(<Counter />);
    await user.click(screen.getByRole("button", { name: /increment/i }));
    expect(screen.getByText("1")).toBeInTheDocument();
  });
});
```

### 6.5 Testing Empty/Error/Loading States

```typescript
// @vitest-environment jsdom
import { describe, it, expect } from "vitest";
import { render, screen } from "@/test/render-utils";
import { EmptyState } from "./empty-state";

describe("EmptyState", () => {
  it("renders title and description", () => {
    render(
      <EmptyState
        title="No results"
        description="Try adjusting your search."
      />,
    );
    expect(screen.getByText("No results")).toBeInTheDocument();
    expect(screen.getByText("Try adjusting your search.")).toBeInTheDocument();
  });

  it("renders action when provided", () => {
    render(
      <EmptyState
        title="No items"
        action={<button>Create new</button>}
      />,
    );
    expect(screen.getByRole("button", { name: /create new/i })).toBeInTheDocument();
  });

  it("renders without action when not provided", () => {
    render(<EmptyState title="No items" />);
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });
});
```

---

## 7. Hook Testing

### 7.1 Custom Render Hook Pattern

Test hooks by writing a small component that uses the hook:

```typescript
// @vitest-environment jsdom
import { describe, it, expect } from "vitest";
import { render, screen } from "@/test/render-utils";
import { useDebounce } from "./use-debounce";

function TestComponent({ value, delay }: { value: string; delay: number }) {
  const debouncedValue = useDebounce(value, delay);
  return <div data-testid="output">{debouncedValue}</div>;
}

describe("useDebounce", () => {
  it("returns initial value immediately", () => {
    render(<TestComponent value="hello" delay={500} />);
    expect(screen.getByTestId("output")).toHaveTextContent("hello");
  });

  it("delays value update", async () => {
    vi.useFakeTimers();
    const { rerender } = render(<TestComponent value="hello" delay={500} />);

    rerender(<TestComponent value="world" delay={500} />);

    // Still old value before timeout
    expect(screen.getByTestId("output")).toHaveTextContent("hello");

    vi.advanceTimersByTime(500);

    expect(screen.getByTestId("output")).toHaveTextContent("world");

    vi.useRealTimers();
  });
});
```

### 7.2 Testing Hooks with Providers

Some hooks require context providers. The custom `render` already wraps with `ThemeProvider` and `ToastProvider`:

```typescript
// @vitest-environment jsdom
import { describe, it, expect } from "vitest";
import { render } from "@/test/render-utils";
import { useMediaQuery } from "./use-media-query";

function TestComponent({ query }: { query: string }) {
  const matches = useMediaQuery(query);
  return <div data-testid="output">{String(matches)}</div>;
}

describe("useMediaQuery", () => {
  it("returns false by default", () => {
    render(<TestComponent query="(min-width: 768px)" />);
    // Default mock returns false for most queries
  });
});
```

---

## 8. Server Action Testing

### 8.1 Mock Dependencies

Server actions typically depend on `auth()` and database calls. Mock them:

```typescript
import { describe, it, expect, vi, beforeEach } from "vitest";

const mockAuth = vi.fn();
vi.mock("@/lib/auth", () => ({
  auth: () => mockAuth(),
}));

const mockDb = vi.fn();
vi.mock("@/features/users/services/user-service", () => ({
  updateUser: (...args: unknown[]) => mockDb(...args),
}));
```

### 8.2 Test the Action

```typescript
import { createAction } from "@/lib/api/action";
import { z } from "zod";

describe("updateProfileAction", () => {
  const schema = z.object({ name: z.string().min(2) });

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("rejects unauthenticated requests", async () => {
    mockAuth.mockResolvedValueOnce({ user: null });

    const action = createAction({
      schema,
      handler: vi.fn(),
    });

    const result = await action(null, createFormData({ name: "John" }));
    expect(result.success).toBe(false);
    expect(result.message).toContain("not authorized");
  });

  it("updates user profile when authenticated", async () => {
    mockAuth.mockResolvedValueOnce({
      user: { id: "user_123", role: "user" },
    });
    mockDb.mockResolvedValueOnce({ id: "user_123", name: "John" });

    const action = createAction({
      schema,
      handler: async (data, { userId }) => {
        return { success: true, message: "Updated", data: { userId, ...data } };
      },
    });

    const result = await action(null, createFormData({ name: "John" }));
    expect(result.success).toBe(true);
  });
});
```

Refer to `src/lib/api/__tests__/action.test.ts` for the complete pattern.

---

## 9. API Route Testing

### 9.1 Mock Next.js Server

```typescript
vi.mock("next/server", () => {
  class MockNextResponse {
    body: unknown;
    status: number;
    headers: Record<string, string>;

    constructor(body: unknown, init?: { status?: number; headers?: Record<string, string> }) {
      this.body = body;
      this.status = init?.status ?? 200;
      this.headers = init?.headers ?? {};
    }

    static json(body: unknown, init?: { status?: number; headers?: Record<string, string> }) {
      return new MockNextResponse(body, init);
    }

    async json() {
      return this.body;
    }
  }

  return { NextResponse: MockNextResponse };
});
```

### 9.2 Test a Route Handler

```typescript
describe("GET /api/users", () => {
  it("returns 401 when not authenticated", async () => {
    mockAuth.mockResolvedValueOnce({ user: null });

    const handler = withAuth(async () => ok([]));
    const request = new NextRequest("http://localhost:3000/api/users");
    const response = (await handler(request)) as unknown as { status: number };

    expect(response.status).toBe(401);
  });

  it("returns paginated users", async () => {
    mockAuth.mockResolvedValueOnce({
      user: { id: "admin_1", role: "admin" },
    });

    const handler = withAuth(async () => {
      return ok([{ id: "1", name: "User" }]);
    });

    const request = new NextRequest("http://localhost:3000/api/users");
    const response = (await handler(request)) as unknown as {
      status: number;
      body: Record<string, unknown>;
    };

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
  });
});
```

Refer to `src/lib/api/__tests__/handler.test.ts` for the complete pattern.

---

## 10. Utility Testing

### 10.1 Pure Functions (Node Environment)

Purely functional utilities need no mocking or DOM:

```typescript
import { describe, it, expect } from "vitest";
import { capitalize } from "./capitalize";

describe("capitalize()", () => {
  it("capitalizes the first letter", () => {
    expect(capitalize("hello")).toBe("Hello");
  });

  it("handles empty string", () => {
    expect(capitalize("")).toBe("");
  });

  it("handles single character", () => {
    expect(capitalize("a")).toBe("A");
  });
});
```

### 10.2 File Location

Tests for utility functions live next to their source:

```
src/utils/string/capitalize.ts
src/utils/string/__tests__/capitalize.test.ts
```

---

## 11. E2E Testing (Playwright)

### 11.1 Configuration

Playwright is configured in `playwright.config.ts`:

- Tests in `tests/e2e/` with `.spec.ts` extension
- Three browser targets: Chromium, Firefox, WebKit
- Two mobile targets: Pixel 5, iPhone 13
- Automatic web server (build + start) on port 3000
- Trace, screenshot, and video capture on failure

### 11.2 Running E2E Tests

```bash
# Install browsers (first time only)
npx playwright install

# Run all E2E tests
npm run test:e2e

# Run with UI mode
npm run test:e2e:ui

# Run a specific test
npx playwright test login --headed
```

### 11.3 Writing E2E Tests

```typescript
import { test, expect } from "@playwright/test";

test.describe("Feature Name", () => {
  test("user can complete a flow", async ({ page }) => {
    await page.goto("/my-page");
    await expect(page.getByRole("heading")).toBeVisible();
    await page.getByRole("button", { name: /submit/i }).click();
    await expect(page.getByText("Success")).toBeVisible();
  });
});
```

### 11.4 Auth Setup

Use `tests/e2e/auth.setup.ts` for authenticated tests:

```typescript
import { test as base } from "../auth.setup";

const test = base;

test("dashboard loads for authenticated user", async ({ authedPage }) => {
  await authedPage.goto("/dashboard");
  await expect(authedPage.locator("text=Dashboard")).toBeVisible();
});
```

### 11.5 Test Organization

```
tests/e2e/
├── auth.setup.ts           # Auth helpers and authenticated fixture
├── auth-flow.spec.ts       # Login, register, protected routes
├── profile.spec.ts         # Profile editing flow
└── api/
    └── health.spec.ts      # API endpoint tests
```

---

## 12. Test Structure Conventions

### 12.1 Directory Layout

```
src/
├── lib/
│   ├── api/
│   │   ├── action.ts
│   │   └── __tests__/
│   │       ├── action.test.ts       ← ✅
│   │       ├── errors.test.ts
│   │       ├── handler.test.ts
│   │       └── response.test.ts
│   └── validation/
│       └── __tests__/
│           └── ...                  ← ✅ Expected
├── utils/
│   ├── string/
│   │   ├── capitalize.ts
│   │   └── __tests__/
│   │       └── capitalize.test.ts   ← ✅ Expected
│   └── array/
│       └── __tests__/
│           └── ...                  ← ✅ Expected
├── components/
│   ├── ui/
│   │   ├── button.tsx
│   │   └── __tests__/
│   │       └── button.test.tsx      ← ✅ Expected
│   └── common/
│       └── __tests__/
│           └── ...                  ← ✅ Expected
└── hooks/
    └── __tests__/
        └── ...                      ← ✅ Expected

tests/
└── e2e/
    ├── auth-flow.spec.ts
    └── ...                          ← ✅ E2E tests
```

### 12.2 Naming

| Test Type | Pattern                       | Example             |
| --------- | ----------------------------- | ------------------- |
| Unit test | `*.test.ts` or `*.test.tsx`   | `button.test.tsx`   |
| E2E test  | `*.spec.ts` (in `tests/e2e/`) | `auth-flow.spec.ts` |

### 12.3 Test Structure

```typescript
// Group by logical unit
describe("ComponentName", () => {
  describe("render", () => {
    it("renders with default props", () => { ... });
    it("renders with custom className", () => { ... });
  });

  describe("interaction", () => {
    it("calls onClick when clicked", () => { ... });
    it("disables button when disabled prop is true", () => { ... });
  });

  describe("variants", () => {
    it("applies primary variant classes", () => { ... });
    it("applies secondary variant classes", () => { ... });
  });
});
```

---

## 13. Coverage

### 13.1 Current Thresholds

| Metric     | Threshold |
| ---------- | --------- |
| Statements | 80%       |
| Branches   | 75%       |
| Functions  | 80%       |
| Lines      | 80%       |

### 13.2 Generating Coverage Reports

```bash
npm run test:coverage
```

Creates:

- Terminal summary — quick overview
- `coverage/index.html` — detailed report (open in browser)
- `coverage/lcov.info` — CI integration

### 13.3 What Should Have Coverage

- ✅ All utility functions (`src/utils/`)
- ✅ All shared hooks (`src/hooks/`)
- ✅ All infrastructure code (`src/lib/`)
- ✅ All UI components (`src/components/ui/`)
- ✅ All common components (`src/components/common/`)
- ✅ All server actions (`src/features/*/actions/`)
- ✅ All services (`src/features/*/services/`)
- 🔴 E2E critical paths (login, register, profile)

---

## 14. Best Practices

### 14.1 Do's

✅ **Test behavior, not implementation**

```typescript
// ✅ Good: test what the user sees/does
it("shows error on invalid email", async () => {
  render(<LoginForm />);
  await user.type(screen.getByLabelText(/email/i), "bad");
  await user.click(screen.getByRole("button"));
  expect(screen.getByText(/invalid email/i)).toBeVisible();
});

// ❌ Bad: test internal state
it("sets error state", () => {
  const { result } = renderHook(() => useLoginForm());
  act(() => result.current.setError("bad email"));
  expect(result.current.error).toBe("bad email");
});
```

✅ **Use `findBy*` for async elements**

```typescript
// ✅ Good: waits for element to appear
const submitButton = await screen.findByRole("button", { name: /submit/i });

// ❌ Bad: element might not be rendered yet
const submitButton = screen.getByRole("button", { name: /submit/i });
```

✅ **Start mock filenames with `mock`**

```typescript
// ✅ Good
vi.mock("@/lib/auth", () => ({ auth: vi.fn() }));

// ❌ Bad
vi.mock("@/lib/some-deep-dependency");
```

✅ **Use `toBeInTheDocument()` for presence checks**
✅ **Use `not.toBeInTheDocument()` for absence checks**
✅ **Use `toHaveTextContent()` for text content checks**
✅ **Use `toHaveClass()` for class assertions**
✅ **Use `toHaveAttribute()` for attribute assertions**

### 14.2 Don'ts

❌ **Don't test implementation details**

```typescript
// ❌ Don't test internal state
expect(component.state().isLoading).toBe(true);

// ❌ Don't test private methods
expect(myService._formatData()).toEqual(...);
```

❌ **Don't test `console.log` or `console.error` calls** (unless the component explicitly uses them)
❌ **Don't test `className` strings from `cn()`** (test semantic roles instead)
❌ **Don't use `data-testid` as a crutch** — prefer `getByRole`, `getByLabelText`, `getByText`
❌ **Don't test the same thing in unit + E2E** — pick one layer
❌ **Don't mock what you don't own** — mock only your code, not third-party libraries

### 14.3 Testing Patterns Reference

| Pattern             | Method                                                          |
| ------------------- | --------------------------------------------------------------- |
| Find by role        | `getByRole("button", { name: /submit/i })`                      |
| Find by label       | `getByLabelText(/email/i)`                                      |
| Find by placeholder | `getByPlaceholderText(/enter name/i)`                           |
| Find by text        | `getByText("Hello World")`                                      |
| Find by test ID     | `getByTestId("my-element")` (last resort)                       |
| Query for absence   | `queryByText("Not here")` (returns null)                        |
| Async find          | `findByRole("dialog")` (waits up to timeout)                    |
| Multiple elements   | `getAllByRole("listitem")`                                      |
| Within container    | `within(element).getByText("Nested")`                           |
| User click          | `user.click(element)`                                           |
| User type           | `user.type(input, "text")`                                      |
| User select         | `user.selectOptions(select, "option")`                          |
| Wait for loading    | `waitForElementToBeRemoved(() => screen.getByText(/loading/i))` |

---

## 15. Troubleshooting

### 15.1 Common Issues

| Issue                                 | Solution                                                                     |
| ------------------------------------- | ---------------------------------------------------------------------------- |
| `window is not defined`               | Add `// @vitest-environment jsdom` to file                                   |
| `fetch is not mocked`                 | Use `vi.fn()` or mock the module that calls fetch                            |
| `matchMedia is not defined`           | Covered by `src/test/setup-dom.ts`                                           |
| `IntersectionObserver is not defined` | Covered by `src/test/setup-dom.ts`                                           |
| `TextEncoder is not defined`          | Covered by jsdom environment                                                 |
| Test timeout                          | Increase timeout in `vitest.config.ts` or use `{ timeout: 20000 }` in `it()` |
| Module resolution fails               | Ensure path alias is defined in both `tsconfig.json` and `vitest.config.ts`  |

### 15.2 Debugging Tests

```bash
# Run a single test file
npx vitest run src/utils/string/__tests__/capitalize.test.ts

# Run tests matching a pattern
npx vitest run -t "capitalize"

# Watch mode with UI
npx vitest --ui
```

### 15.3 CI Integration

Tests run automatically in CI. The `.github/workflows/ci.yml` (if configured) runs:

```bash
npm run typecheck
npm run lint
npm run test
```

Coverage reports are generated and can be uploaded to Codecov or similar services.
