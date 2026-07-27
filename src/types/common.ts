/**
 * Common/shared utility type definitions.
 *
 * These are general-purpose types used across the entire application.
 * They are not tied to any specific domain or feature.
 *
 * @example
 * import type { Maybe, Nullable, DeepPartial } from "@/types/common";
 */

// ─── Option/Maybe Pattern ─────────────────────────────────

/** A value that may be `undefined`. */
export type Maybe<T> = T | undefined;

/** A value that may be `null` or `undefined`. */
export type Nullable<T> = T | null | undefined;

/** A value that may be a promise. */
export type Awaitable<T> = T | Promise<T>;

// ─── Object Deep Utilities ───────────────────────────────

/** Deep partial — makes all nested properties optional. */
export type DeepPartial<T> = T extends object
  ? { [P in keyof T]?: DeepPartial<T[P]> }
  : T;

/** Deep readonly — makes all nested properties readonly. */
export type DeepReadonly<T> = T extends object
  ? { readonly [P in keyof T]: DeepReadonly<T[P]> }
  : T;

/** Deep required — makes all nested properties required. */
export type DeepRequired<T> = T extends object
  ? { [P in keyof T]-?: DeepRequired<T[P]> }
  : T;

// ─── Union/Intersection Helpers ──────────────────────────

/** Extracts the value type from a const object. */
export type ValueOf<T> = T[keyof T];

/** Picks keys from T that extend a specific type. */
export type PickByType<T, V> = { [K in keyof T as T[K] extends V ? K : never]: T[K] };

/** Omit keys from T that extend a specific type. */
export type OmitByType<T, V> = { [K in keyof T as T[K] extends V ? never : K]: T[K] };

/** Makes specified keys required. */
export type WithRequired<T, K extends keyof T> = Omit<T, K> & Required<Pick<T, K>>;

/** Makes specified keys optional. */
export type WithOptional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

// ─── Function Types ──────────────────────────────────────

/** Async function returning a promise. */
export type AsyncFn<T = void> = (...args: unknown[]) => Promise<T>;

/** Void callback. */
export type Callback = () => void;

/** Function with a single argument. */
export type UnaryFn<T, R> = (arg: T) => R;

// ─── Key/Value Types ─────────────────────────────────────

/** Generic key-value pair. */
export type KeyValue<K extends string | number = string, V = unknown> = {
  key: K;
  value: V;
};

/** Generic dictionary/map. */
export type Dict<T = unknown> = Record<string, T>;

// ─── State Types ─────────────────────────────────────────

/** Standard loading/error/data state for async operations. */
export type AsyncState<T, E = Error> =
  | { status: "idle"; data?: never; error?: never }
  | { status: "loading"; data?: never; error?: never }
  | { status: "success"; data: T; error?: never }
  | { status: "error"; data?: never; error: E };

/** Generic fetch/query state. */
export interface QueryState<T> {
  data: Maybe<T>;
  isLoading: boolean;
  isError: boolean;
  error: Nullable<Error>;
}

// ─── Sorting & Pagination ────────────────────────────────

/** Sort direction. */
export type SortDirection = "asc" | "desc";

/** Generic sort configuration. */
export interface SortConfig<T = string> {
  field: T;
  direction: SortDirection;
}
