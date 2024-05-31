import React from "react";

import { privateRoutes, publicRoutes } from "@/routes";
import { useAuth } from "./useAuth";

export const useRouteConfig = () => {

    const { userDetails } = useAuth();

    const checkPermission = (allowedRoles: string[]): boolean => {
        if(!userDetails || !userDetails.roles.length) return false;
        const userRoles = userDetails.roles;

        return allowedRoles.length === 0 || userRoles.some(userRole => 
                                    allowedRoles.some(allowedRole => userRole.name === allowedRole));
    }

    const getRoutes = () => {
        if(!userDetails){
            return publicRoutes.map(route => ({
                ...route,
                element: typeof route.element === 'function' ? React.createElement(route.element) : route.element
            }));
        }
        return privateRoutes.filter(route => checkPermission(route.allowedRoles))
                        .map(route => ({
                            ...route,
                            element: typeof route.element === 'function' ? React.createElement(route.element) : route.element
                        }));
    }

    const getLinks = () => {
        const routes = userDetails ? privateRoutes : [];
        return routes.filter(route => route.path !== '/home' && route.path !== '*' && checkPermission(route.allowedRoles))
                            .map(route => ({
                                path: route.path,
                                label: route.label
                            }));
    }

    return { 
        getRoutes, 
        getLinks
    };
}