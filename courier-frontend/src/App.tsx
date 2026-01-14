import { useCallback } from "react";
import { Route, Routes } from "react-router";

import { useAuth } from "@/hooks";
import { publicRoutes, privateRoutes, ProtectedRoutes } from "@/routes";
import { WithLoadingLayout } from "@/ui";

export const App = () => {
  const { auth, getId } = useAuth();

  const getRoutes = useCallback(() => {
    if (!auth.id && !getId()) {
      return publicRoutes().map(({ path, element }) => (
        <Route key={path} path={path} element={element} />
      ));
    }
    return privateRoutes().map(({ path, element, allowedRoles, actions }) => (
      <Route
        key={path}
        element={<ProtectedRoutes allowedRoles={allowedRoles} />}
      >
        <Route
          path={path}
          element={typeof element === "function" ? element(actions) : element}
        />
      </Route>
    ));
  }, [auth.id, getId]);

  return (
    <Routes>
      <Route element={<WithLoadingLayout />}>{getRoutes()}</Route>
    </Routes>
  );
};
