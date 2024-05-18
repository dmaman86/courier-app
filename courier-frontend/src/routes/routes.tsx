import { Navigate } from "react-router-dom";
import { Home, Login, Profile, SettingsAdmin, UsersPageAdmin } from "../components";
import { RouteConfig } from "../types";


export const routes: RouteConfig[] = [
    {
        path: '/home',
        label: 'Home',
        element: <Home />,
        allowedRoles: ['ROLE_ADMIN', 'ROLE_COURIER', 'ROLE_CLIENT']
    },
    {
        path: '/users',
        label: 'Users',
        element: <UsersPageAdmin />,
        allowedRoles: ['ROLE_ADMIN']
    },
    {
        path: '/profile',
        label: 'Profile',
        element: <Profile />,
        allowedRoles: ['ROLE_ADMIN', 'ROLE_COURIER', 'ROLE_CLIENT']
    },
    {
        path: '/settings',
        label: 'Settings',
        element: <SettingsAdmin />,
        allowedRoles: ['ROLE_ADMIN']
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