import { lazy } from 'react';
import { Navigate } from "react-router-dom";

import { RouteConfig } from "@/domain";
import { withLoading } from "@/hoc";


const Login = withLoading(lazy(() => import('@/ui').then(module => ({ default: module.Login }))));
const SignUp = withLoading(lazy(() => import('@/ui').then(module => ({ default: module.SignUp }))));

const Home = lazy(() => import('@/ui').then(module => ({ default: module.Home })));
const Profile = lazy(() => import('@/ui').then(module => ({ default: module.Profile })));
const SettingsAdmin = lazy(() => import('@/ui').then(module => ({ default: module.SettingsAdmin })));
const UsersPage = lazy(() => import('@/ui').then(module => ({ default: module.UsersPage })));
const ContactsPage = lazy(() => import('@/ui').then(module => ({ default: module.ContactsPage })));
const OfficesPage = lazy(() => import('@/ui').then(module => ({ default: module.OfficesPage })));
const OrdersPage = lazy(() => import('@/ui').then(module => ({ default: module.OrdersPage })));

export const publicRoutes = (isLoading: boolean): RouteConfig[] => [
    {
        path: '/login',
        label: 'Login',
        element: <Login isLoading={isLoading}/>,
        allowedRoles: []
    },
    {
        path: '/signup',
        label: 'Sign Up',
        element: <SignUp isLoading={isLoading}/>,
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
        path: '/orders',
        label: 'Orders',
        element: <OrdersPage />,
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