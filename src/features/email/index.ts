/**
 * Email Feature — Public API
 */

// Components
export { EmailWrapper } from "./components/email-wrapper";
export { WelcomeEmail } from "./components/welcome-email";
export { ResetPasswordEmail } from "./components/reset-password-email";

// Services
export { emailService } from "./services/email-service";

// Types
export type { IEmailPayload, IEmailResponse, EmailTemplate } from "./types";

// Config
export { emailFeatureConfig } from "./config";

// Constants
export { EMAIL_MESSAGES } from "./constants";
