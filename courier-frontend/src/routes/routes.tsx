import { lazy } from 'react';
import { Navigate } from "react-router-dom";

import { RouteConfig } from "@/types";

const Home = lazy(() => import('@/components/pages/Home').then(module => ({ default: module.Home })));
// import { Home } from '@/components/pages/Home';
import { Login } from '@/components/pages/Login';
import { SignUp } from '@/components/pages/SignUp';
import { Profile } from '@/components/common/Profile';
import { SettingsAdmin } from '@/components/pages/admin/SettingsAdmin';
import { UsersPage } from '@/components/pages/admin/UsersPage';
import { ContactsPage } from '@/components/common/ContactsPage';
import { OfficesPage } from '@/components/common/OfficesPage';

export const publicRoutes: RouteConfig[] = [
    {
        path: '/login',
        label: 'Login',
        element: <Login />,
        allowedRoles: []
    },
    {
        path: '/signup',
        label: 'Sign Up',
        element: <SignUp />,
        allowedRoles: []
    },
    {
        path: '*',
        label: '',
        element: <Navigate to="/login" replace />,
        allowedRoles: []
    }
]

export const privateRoutes: RouteConfig[] = [
    {
        path: '/home',
        label: 'Home',
        element: <Home />,
        allowedRoles: ['ROLE_ADMIN', 'ROLE_COURIER', 'ROLE_CLIENT']
    },
    {
        path: '/users',
        label: 'Users',
        element: <UsersPage />,
        allowedRoles: ['ROLE_ADMIN']
    },
    {
        path: '/contacts',
        label: 'Contacts',
        element: <ContactsPage />,
        allowedRoles: ['ROLE_ADMIN', 'ROLE_COURIER']
    },
    {
        path: '/offices',
        label: 'Offices',
        element: <OfficesPage />,
        allowedRoles: ['ROLE_ADMIN', 'ROLE_COURIER']
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
        path: '*',
        label: '',
        element: <Navigate to="/home" replace />,
        allowedRoles: ['ROLE_ADMIN', 'ROLE_COURIER', 'ROLE_CLIENT']
    }
]