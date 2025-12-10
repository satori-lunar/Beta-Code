interface ProtectedRouteProps {
  children: React.ReactNode;
}

// TEMPORARY: Authentication bypassed for demo/testing
// To re-enable auth, restore the original code from git
export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  return <>{children}</>;
}
