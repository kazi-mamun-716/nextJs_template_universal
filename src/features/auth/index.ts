/**
 * Auth Feature — Public API
 *
 * Only exports what other features are allowed to consume.
 * Internal implementation details (services, repositories, schemas) are not exported.
 */

// Components
export { LoginForm } from "./components/login-form";
export { RegisterForm } from "./components/register-form";
export { ForgotPasswordForm } from "./components/forgot-password-form";
export { OAuthButtons } from "./components/oauth-buttons";
export { AuthGuard } from "./components/auth-guard";

// Server Actions
export { login } from "./actions/login";
export { register } from "./actions/register";
export { logout } from "./actions/logout";
export { resetPassword } from "./actions/reset-password";

// Types
export type { LoginFormValues, RegisterFormValues, IAuthResponse, IUserSession } from "./types";

// Hooks
export { useAuth } from "./hooks/use-auth";
export { useSession } from "./hooks/use-session";
export { useLoginForm } from "./hooks/use-login-form";

// Constants & Routes
export { AUTH_MESSAGES, AUTH_ERRORS } from "./constants";
export { AUTH_ROUTES } from "./routes";
export type { AuthRoute } from "./routes";

// Permissions
export { canManageUsers, canModerateContent, canAccessAdminPanel } from "./permissions";
