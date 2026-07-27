/**
 * Configuration barrel export.
 *
 * Every configurable value in the application is accessed through this module.
 * Nothing should be hardcoded — always import from here or from feature configs.
 *
 * @example
 * import { appConfig, env, authConfig } from "@/config";
 * console.log(appConfig.name);
 * console.log(env.MONGODB_URI);
 */

export { env, validateEnv } from "./env";
export type { Env, ServerEnv, ClientEnv } from "./env";

export { appConfig } from "./app";
export type { AppConfig } from "./app";

export { authConfig } from "./auth";
export type { AuthConfig } from "./auth";

export { databaseConfig } from "./database";
export type { DatabaseConfig } from "./database";

export { paginationConfig } from "./pagination";
export type { PaginationConfig } from "./pagination";

export { uploadConfig } from "./upload";
export type { UploadConfig } from "./upload";

export { emailConfig } from "./email";
export type { EmailConfig } from "./email";

export { seoConfig } from "./seo";
export type { SeoConfig } from "./seo";

export { corsConfig } from "./cors";
export type { CorsConfig } from "./cors";

export { featureFlags } from "./features";
export type { FeatureFlags, FeatureFlag } from "./features";

export { validateConfig } from "./validator";
