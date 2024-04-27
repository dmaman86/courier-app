import { Role, RoutesProps } from "../types";
import { routes } from "../routes";
import { Navigate } from "react-router-dom";

export const useRouteConfig = (userRoles: Role[]) => {

    const getRoutes = () => {
        if(!userRoles.length){
            return [{path: '/login', label: 'Login', element: <Navigate to='/login' replace/>, allowedRoles: []}];
        }
        return routes.filter(route => checkPermission(route.allowedRoles))
                        .map(route => ({
                            ...route,
                            element: (props?: RoutesProps) => {
                                if (typeof route.element === 'function') {
                                    return route.element(props);
                                } else {
                                    return route.element;
                                }
                            }
                        }));
    }

    const getLinks = () => {
        if(!userRoles.length){
            return [{ path: '/login', label: 'Login' }];
        }
        return routes.filter(route => route.path !== '/login' && route.path !== '/home' && route.path !== '*' && checkPermission(route.allowedRoles))
                            .map(route => ({
                                path: route.path,
                                label: route.label
                            }));
    }

    const checkPermission = (allowedRoles: string[]): boolean => {
        return allowedRoles.some(allowedRole => 
            userRoles.some(userRole => userRole.name === allowedRole)
        );
    }

    return { 
        getRoutes, 
        getLinks
    };
}