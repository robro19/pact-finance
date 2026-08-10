import { Navigate, useLocation } from "react-router-dom";
import { currentUser, usePact } from "@/lib/store";
import type { Role } from "@/lib/types";

export const RequireAuth = ({
  role,
  children,
}: {
  role: Role;
  children: React.ReactNode;
}) => {
  const db = usePact();
  const user = currentUser(db);
  const location = useLocation();

  if (!user) return <Navigate to="/signin" state={{ from: location.pathname }} replace />;
  if (user.role !== role) return <Navigate to={user.role === "tenant" ? "/app" : "/landlord"} replace />;
  if (user.role === "tenant" && !user.onboarded && location.pathname !== "/onboarding")
    return <Navigate to="/onboarding" replace />;

  return <>{children}</>;
};