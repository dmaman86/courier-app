import {
  SignIn,
  SignUp,
  Home,
  Forbidden,
  Users,
  Settings,
  Offices,
  Contacts,
} from "@/ui";
import { Navigate } from "react-router";
import { ROLES, PublicRouteConfig, PrivateRouteConfig } from "@/models";

export const publicRoutes = (): PublicRouteConfig[] => [
  {
    path: "/signin",
    label: "Sign In",
    element: <SignIn />,
    allowedRoles: [],
  },
  {
    path: "/signup",
    label: "Sign Up",
    element: <SignUp />,
    allowedRoles: [],
  },
  {
    path: "*",
    label: "",
    element: <Navigate to="/signin" replace />,
    allowedRoles: [],
  },
];

export const privateRoutes = (): PrivateRouteConfig[] => [
  {
    path: "/home",
    label: "Home",
    element: <Home />,
    allowedRoles: [ROLES.ADMIN, ROLES.COURIER, ROLES.CLIENT],
  },
  {
    path: "/users",
    label: "Users",
    element: (actions) => <Users allowedActions={actions} />,
    allowedRoles: [ROLES.ADMIN],
    actions: {
      create: [ROLES.ADMIN],
      update: [ROLES.ADMIN],
      delete: [ROLES.ADMIN],
    },
  },
  {
    path: "/offices",
    label: "Offices",
    element: (actions) => <Offices allowedActions={actions} />,
    allowedRoles: [ROLES.ADMIN, ROLES.COURIER],
    actions: {
      create: [ROLES.ADMIN],
      update: [ROLES.ADMIN],
      delete: [ROLES.ADMIN],
    },
  },
  {
    path: "/contacts",
    label: "Contacts",
    element: (actions) => <Contacts allowedActions={actions} />,
    allowedRoles: [ROLES.ADMIN, ROLES.COURIER],
    actions: {
      create: [ROLES.ADMIN],
      update: [ROLES.ADMIN],
      delete: [ROLES.ADMIN],
    },
  },
  {
    path: "/settings",
    label: "Settings",
    element: <Settings />,
    allowedRoles: [ROLES.ADMIN, ROLES.COURIER, ROLES.CLIENT],
  },
  {
    path: "/forbidden",
    label: "Forbidden",
    element: <Forbidden />,
    allowedRoles: [],
  },
  {
    path: "*",
    label: "",
    element: <Navigate to="/home" replace />,
    allowedRoles: [ROLES.ADMIN, ROLES.COURIER, ROLES.CLIENT],
  },
];
