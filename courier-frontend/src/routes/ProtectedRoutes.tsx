import { Navigate, Outlet } from "react-router";
import { useAuth } from "@/hooks";

export const ProtectedRoutes = ({
  allowedRoles,
}: {
  allowedRoles: string[];
}) => {
  const { auth } = useAuth();

  if (!auth.id) {
    return <Navigate to="/signin" replace />;
  }

  if (!auth.roles.some((role) => allowedRoles.includes(role.name))) {
    return <Navigate to="/forbidden" replace />;
  }

  return <Outlet />;
};
