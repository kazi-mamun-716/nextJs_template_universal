/**
 * Welcome email template content.
 * Separated from the component for service usage without React rendering.
 */
export function getWelcomeEmailContent(name: string, loginUrl: string) {
  return {
    subject: `Welcome to the platform, ${name}!`,
    html: `<h1>Welcome, ${name}!</h1><p>Get started by logging in.</p>`,
  };
}
