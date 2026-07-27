/**
 * Users feature route constants.
 */
export const USERS_ROUTES = {
  PROFILE: "/dashboard/profile",
  SETTINGS: "/dashboard/settings",
  ADMIN_USERS: "/dashboard/admin/users",
  ADMIN_USER_DETAIL: "/dashboard/admin/users",
} as const;

export type UsersRoute = (typeof USERS_ROUTES)[keyof typeof USERS_ROUTES];
