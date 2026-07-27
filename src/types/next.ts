/**
 * Next.js type extensions and helpers.
 *
 * Provides strongly-typed versions of Next.js App Router types
 * for page props, layout props, search params, and more.
 *
 * @example
 * import type { PageProps, LayoutProps } from "@/types/next";
 *
 * export default function Page({ params, searchParams }: PageProps<{ id: string }>) {
 *   // params.id is typed as string
 * }
 */

// ─── Page Props ──────────────────────────────────────────

/** Typed search parameters for pages. */
export type SearchParams = Promise<Record<string, string | string[] | undefined>>;

/** Typed params for dynamic route pages. */
export type Params<T extends Record<string, string> = Record<string, string>> = Promise<T>;

/** Typed page component props (App Router). */
export type PageProps<TParams extends Record<string, string> = Record<string, string>> = {
  params: Params<TParams>;
  searchParams: SearchParams;
};

/** Typed page component props without dynamic params. */
export type StaticPageProps = {
  params: Promise<Record<string, never>>;
  searchParams: SearchParams;
};

// ─── Layout Props ────────────────────────────────────────

/** Typed layout component props (App Router). */
export type LayoutProps<TParams extends Record<string, string> = Record<string, string>> = {
  params: Params<TParams>;
  children: React.ReactNode;
};

/** Typed layout without dynamic params. */
export type StaticLayoutProps = {
  params: Promise<Record<string, never>>;
  children: React.ReactNode;
};

// ─── Error & Loading ─────────────────────────────────────

/** Typed error page props (App Router). */
export interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

/** Typed not-found page props. */
export type NotFoundPageProps = Record<string, never>;

// ─── Route Handler ───────────────────────────────────────

/** Typed API route handler context. */
export type RouteContext<TParams extends Record<string, string> = Record<string, string>> = {
  params: TParams;
};

/** Typed API route handler with params. */
export type RouteHandler<TParams extends Record<string, string> = Record<string, string>> = (
  request: Request,
  context: RouteContext<TParams>,
) => Response | Promise<Response>;

// ─── Metadata ────────────────────────────────────────────

/** Typed generateMetadata params. */
export type GenerateMetadataProps<TParams extends Record<string, string> = Record<string, string>> = {
  params: Params<TParams>;
  searchParams: SearchParams;
};
