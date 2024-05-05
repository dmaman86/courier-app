import React from "react";
import { routes } from "../routes";
import { useAuth } from "./useAuth";

export const useRouteConfig = () => {

    const { userDetails } = useAuth();

    const getRoutes = () => {
        return routes.filter(route => route.allowedRoles.length === 0 || checkPermission(route.allowedRoles))
                        .map(route => ({
                            ...route,
                            element: typeof route.element === 'function' ? React.createElement(route.element) : route.element
                        }));
    }

    const getLinks = () => {
        return routes.filter(route => route.path !== '/login' && route.path !== '/home' && route.path !== '*' && checkPermission(route.allowedRoles))
                            .map(route => ({
                                path: route.path,
                                label: route.label
                            }));
    }

    const checkPermission = (allowedRoles: string[]): boolean => {
        if(!userDetails || !userDetails.roles.length) return false;
        const userRoles = userDetails.roles;

        return allowedRoles.some(allowedRole => 
            userRoles.some(userRole => userRole.name === allowedRole)
        );
    }

    return { 
        getRoutes, 
        getLinks
    };
}