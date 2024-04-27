import { Navigate, Outlet, Route, Routes } from "react-router-dom";

import { Token, RoutesProps } from "../types";
import { useRouteConfig } from "../hooks";
import React from "react";

interface PrivateRouteProp{
    tokens?: Token | null;
    children: JSX.Element;
}

export const PrivateRoutes: React.FC<RoutesProps> = (props) => {

    const { tokens, user } = props;

    const { getRoutes } = useRouteConfig(user?.roles || []);

    return(
        <Routes>
            <Route path='/' element={
                    user ? (
                        <PrivateRoute tokens={tokens} children={<Outlet />}/>
                    ): (<div>Loading user data...</div>)
            }>
                {
                    getRoutes().map((route, index) => (
                        <Route key={index} path={route.path} element={
                            typeof route.element === 'function'
                            ? route.element({ tokens, user })
                            : route.element
                        } />
                    ))
                }
            </Route>
        </Routes>
    );
}

const PrivateRoute = ({tokens, children}: PrivateRouteProp) => {

    return tokens ? children : <Navigate to="/login" replace/>;
}