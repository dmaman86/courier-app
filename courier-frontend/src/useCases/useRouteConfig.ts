import React from "react";

import { privateRoutes, publicRoutes } from "@/routes";
import { useAuth } from "@/hooks";
import { RouteConfig } from "@/domain";

export const useRouteConfig = () => {

    const { userDetails, isLoading } = useAuth();

    const checkPermission = (allowedRoles: string[]): boolean => {
        if(!userDetails || !userDetails.roles.length) return false;
        const userRoles = userDetails.roles;

        return allowedRoles.length === 0 || userRoles.some(userRole => 
                                    allowedRoles.some(allowedRole => userRole.name === allowedRole));
    }

    const createRouteElement = (route: RouteConfig) => {
        return typeof route.element === 'function' ?
                React.createElement(route.element) :
                route.element;
    }

    const getRoutesPublic = () => {
        return publicRoutes(isLoading).map(route => ({
            ...route,
            element: createRouteElement(route)
        }));
    }

    const getRoutesPrivate = () => {
        return privateRoutes.filter(route => checkPermission(route.allowedRoles))
                        .map(route => ({
                            ...route,
                            element: createRouteElement(route)
                        }));
    }

    const getRoutes = () => {
        if(!userDetails){
            return publicRoutes(isLoading).map(route => ({
                ...route,
                element: createRouteElement(route)
            }));
        }
        return privateRoutes.filter(route => checkPermission(route.allowedRoles))
                        .map(route => ({
                            ...route,
                            element: createRouteElement(route)
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
        getRoutesPublic,
        getRoutesPrivate, 
        getLinks
    };
}