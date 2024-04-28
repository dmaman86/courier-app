import { Navigate, Outlet, Route, Routes } from "react-router-dom";

import { Token } from "../types";
import { useAuth, useRouteConfig } from "../hooks";
import React from "react";

interface PrivateRouteProp{
    tokens?: Token | null;
    children: JSX.Element;
}

export const PrivateRoutes: React.FC = () => {

    const { tokens, userDetails } = useAuth();
    const { getRoutes } = useRouteConfig();
    const allowedRoutes = getRoutes();

    return(
        <Routes>
            <Route path='/' element={
                    userDetails ? (
                        <PrivateRoute tokens={tokens} children={<Outlet />}/>
                    ): (<div>Loading user data...</div>)
            }>
                {
                    allowedRoutes.map((route, index) => (
                        <Route key={index} path={route.path} element={route.element} />
                    ))
                }
            </Route>
        </Routes>
    );
}

const PrivateRoute = ({tokens, children}: PrivateRouteProp) => {

    return tokens ? children : <Navigate to="/login" replace/>;
}