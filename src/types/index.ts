/**
 * Global type definitions barrel export.
 *
 * Re-exports all shared types from a single location.
 * Feature-specific types remain in their respective feature folders.
 *
 * @example
 * import type { ApiResponse, IUser, PageProps } from "@/types";
 */

// API
export type {
  ApiResponse,
  ApiErrorResponse,
  ApiSuccessResponse,
  PaginatedResponse,
  PaginationMeta,
  PaginationParams,
  SortParams,
  QueryParams,
  ApiHandlerResult,
  UploadResponse,
  WebhookPayload,
} from "./api";

// Common
export type {
  Maybe,
  Nullable,
  Awaitable,
  DeepPartial,
  DeepReadonly,
  DeepRequired,
  ValueOf,
  PickByType,
  OmitByType,
  WithRequired,
  WithOptional,
  AsyncFn,
  Callback,
  UnaryFn,
  KeyValue,
  Dict,
  AsyncState,
  QueryState,
  SortDirection,
  SortConfig,
} from "./common";

// Models
export type {
  ITimestamp,
  ISoftDelete,
  IBaseModel,
  IBaseModelWithSoftDelete,
  IAuditable,
  ContentStatus,
  AccountStatus,
  VerificationStatus,
  IConfigEntry,
  IVersioned,
} from "./models";

// Next.js
export type {
  SearchParams,
  Params,
  PageProps,
  StaticPageProps,
  LayoutProps,
  StaticLayoutProps,
  ErrorPageProps,
  NotFoundPageProps,
  RouteContext,
  RouteHandler,
  GenerateMetadataProps,
} from "./next";

// Theme
export type {
  ThemeMode,
  ResolvedTheme,
  ThemeConfig,
  ThemeCSSVariables,
  HSLColor,
  ThemeColors,
  Breakpoint,
  ResponsiveValue,
} from "./theme";

// User
export type {
  IUser,
  IUserProfile,
  IUserPreferences,
  IUserSession,
  IAuthResponse,
  IJwtPayload,
  ICreateUserPayload,
  IUpdateUserPayload,
  IUserQueryParams,
} from "./user";
