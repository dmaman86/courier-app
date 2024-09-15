import { lazy } from 'react';
import { Navigate } from "react-router-dom";

import { RouteConfig, User } from "@/domain";
import { withLoading } from "@/hoc";


const Login = withLoading(lazy(() => import('@/ui').then(module => ({ default: module.Login }))));
const SignUp = withLoading(lazy(() => import('@/ui').then(module => ({ default: module.SignUp }))));

const Home = withLoading(lazy(() => import('@/ui').then(module => ({ default: module.Home }))));
const Profile = withLoading(lazy(() => import('@/ui').then(module => ({ default: module.Profile }))));
const SettingsAdmin = withLoading(lazy(() => import('@/ui').then(module => ({ default: module.SettingsAdmin }))));
const UsersPage = withLoading(lazy(() => import('@/ui').then(module => ({ default: module.UsersPage }))));
const ContactsPage = withLoading(lazy(() => import('@/ui').then(module => ({ default: module.ContactsPage }))));
const OfficesPage = withLoading(lazy(() => import('@/ui').then(module => ({ default: module.OfficesPage }))));
const OrdersPage = withLoading(lazy(() => import('@/ui').then(module => ({ default: module.OrdersPage }))));

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

export const privateRoutes = (isLoading: boolean, userDetails: User): RouteConfig[] => [
    {
        path: '/home',
        label: 'Home',
        element: <Home isLoading={isLoading} userDetails={userDetails}/>,
        allowedRoles: ['ROLE_ADMIN', 'ROLE_COURIER', 'ROLE_CLIENT']
    },
    {
        path: '/orders',
        label: 'Orders',
        element: <OrdersPage isLoading={isLoading} userDetails={userDetails}/>,
        allowedRoles: ['ROLE_ADMIN', 'ROLE_COURIER', 'ROLE_CLIENT']
    },
    {
        path: '/users',
        label: 'Users',
        element: <UsersPage isLoading={isLoading} userDetails={userDetails}/>,
        allowedRoles: ['ROLE_ADMIN']
    },
    {
        path: '/contacts',
        label: 'Contacts',
        element: <ContactsPage isLoading={isLoading} userDetails={userDetails}/>,
        allowedRoles: ['ROLE_ADMIN', 'ROLE_COURIER']
    },
    {
        path: '/offices',
        label: 'Offices',
        element: <OfficesPage isLoading={isLoading} userDetails={userDetails}/>,
        allowedRoles: ['ROLE_ADMIN', 'ROLE_COURIER']
    },
    {
        path: '/profile',
        label: 'Profile',
        element: <Profile isLoading={isLoading} userDetails={userDetails}/>,
        allowedRoles: ['ROLE_ADMIN', 'ROLE_COURIER', 'ROLE_CLIENT']
    },
    {
        path: '/settings',
        label: 'Settings',
        element: <SettingsAdmin isLoading={isLoading} userDetails={userDetails}/>,
        allowedRoles: ['ROLE_ADMIN']
    },
    {
        path: '*',
        label: '',
        element: <Navigate to="/home" replace />,
        allowedRoles: ['ROLE_ADMIN', 'ROLE_COURIER', 'ROLE_CLIENT']
    }
]