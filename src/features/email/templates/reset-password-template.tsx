/**
 * Password reset email template content.
 */
export function getResetPasswordEmailContent(resetLink: string) {
  return {
    subject: "Reset Your Password",
    html: `<p>Click <a href="${resetLink}">here</a> to reset your password.</p>`,
  };
}
