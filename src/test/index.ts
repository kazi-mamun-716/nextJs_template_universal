/**
 * Test utilities barrel export.
 *
 * @example
 * import { mockUser, mockRequest, buildArticle } from "@/test";
 * import { render, screen } from "@/test/render-utils";
 */

// Mock factories
export {
  mockUser,
  mockSession,
  mockRequest,
  mockResponse,
  createFormData,
  mockPagination,
  mockApiResponse,
  mockObjectId,
  mockDate,
  mockApiError,
} from "./mock-factories";
export type {
  MockUserOverrides,
  MockSessionOverrides,
  MockRequestOverrides,
  MockResponseOverrides,
  MockPaginationOverrides,
  MockApiResponseOverrides,
} from "./mock-factories";

// Test data builders
export {
  buildUser,
  buildAdmin,
  buildArticle,
  buildCategory,
  buildComment,
  resetTestDataCounters,
} from "./test-data";
export type { UserTestData, ArticleTestData, CategoryTestData, CommentTestData } from "./test-data";

// Render utilities
export { render, screen, waitFor, act, fireEvent, within } from "./render-utils";
