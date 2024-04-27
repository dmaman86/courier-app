import { Navigate } from "react-router-dom";
import { Home, Login, Profile } from "../components";
import { RouteConfig, RoutesProps } from "../types";


export const routes: RouteConfig[] = [
    {
        path: '/home',
        label: 'Home',
        element: (props?: RoutesProps) => <Home {...props}/>,
        allowedRoles: ['ROLE_ADMIN', 'ROLE_COURIER', 'ROLE_CLIENT']
    },
    {
        path: '/profile',
        label: 'Profile',
        element: (props?: RoutesProps) => <Profile {...props}/>,
        allowedRoles: ['ROLE_ADMIN', 'ROLE_COURIER', 'ROLE_CLIENT']
    },
    {
        path: '/login',
        label: 'Login',
        element: <Login />,
        allowedRoles: []
    },
    {
        path: '*',
        label: '',
        element: <Navigate to="/home" replace />,
        allowedRoles: ['ROLE_ADMIN', 'ROLE_COURIER', 'ROLE_CLIENT']
    }
];