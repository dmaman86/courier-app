import React, { useEffect, useState } from "react";

import { privateRoutes, publicRoutes } from "@/routes";
import { useAuth } from "@/hooks";
import { RouteConfig, User } from "@/domain";

export const useRouteConfig = () => {

    const { userDetails, isLoading } = useAuth();
    const [ routes, setRoutes ] = useState<RouteConfig[]>([]);
    const [ links, setLinks ] = useState<{ path: string, label: string }[]>([]);

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

    const getRoutesPrivate = (userDetails: User) => {
        return privateRoutes(isLoading, userDetails).filter(route => checkPermission(route.allowedRoles))
                        .map(route => ({
                            ...route,
                            element: createRouteElement(route)
                        }));
    }

    const getPrivateLinks = (userDetails: User) => {
        return privateRoutes(isLoading, userDetails).filter(route => route.path !== '/home' && route.path !== '*' && checkPermission(route.allowedRoles))
                            .map(route => ({
                                path: route.path,
                                label: route.label
                            }));
    }

    useEffect(() => {
        const availableRoutes = userDetails ? getRoutesPrivate(userDetails) : getRoutesPublic();
        setRoutes(availableRoutes);

        const availableLinks = userDetails ? getPrivateLinks(userDetails) : [];
        setLinks(availableLinks);
    }, [userDetails]);

    return { 
        routes, 
        links
    };
}