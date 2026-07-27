/**
 * Auth service — orchestrates authentication business logic.
 * Sits between server actions and repositories.
 */
export const authService = {
  /**
   * Authenticates a user and returns a session.
   */
  async login(email: string, password: string) {
    // TODO: Implement
    return null;
  },

  /**
   * Creates a new user account.
   */
  async register(data: unknown) {
    // TODO: Implement
    return null;
  },

  /**
   * Verifies a password reset token and updates the password.
   */
  async resetPassword(token: string, newPassword: string) {
    // TODO: Implement
    return null;
  },
};
