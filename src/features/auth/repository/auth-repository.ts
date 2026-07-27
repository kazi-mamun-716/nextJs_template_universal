/**
 * Auth repository — handles database operations for authentication.
 * All Mongoose queries for auth belong here.
 */
export const authRepository = {
  async findByEmail(email: string) {
    // TODO: Implement Mongoose query
    return null;
  },

  async create(data: unknown) {
    // TODO: Implement Mongoose create
    return null;
  },

  async updatePassword(userId: string, hashedPassword: string) {
    // TODO: Implement Mongoose update
    return null;
  },
};
