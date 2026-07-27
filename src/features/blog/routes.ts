/**
 * Blog feature route constants.
 */
export const BLOG_ROUTES = {
  LIST: "/blog",
  POST: "/blog", // /blog/:slug (dynamic — use buildRoute)
  DASHBOARD_POSTS: "/dashboard/blog",
  DASHBOARD_NEW_POST: "/dashboard/blog/new",
  DASHBOARD_EDIT_POST: "/dashboard/blog", // /dashboard/blog/:id/edit
} as const;

export type BlogRoute = (typeof BLOG_ROUTES)[keyof typeof BLOG_ROUTES];
