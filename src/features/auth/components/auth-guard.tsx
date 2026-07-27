/**
 * Route guard that redirects unauthenticated users to login.
 */
export function AuthGuard({ children }: { children: React.ReactNode }) {
  // TODO: Implement auth check with redirect
  return <>{children}</>;
}
