import { Navigate, Outlet, Route, Routes } from "react-router-dom";

import { Token } from "@/types";
import { useRouteConfig } from "@/hooks";

export const PublicRoutes = ({ tokens }: { tokens: Token | null}) => {
    const { getRoutes } = useRouteConfig();
    const allowedRoutes = getRoutes();

    return (
        <Routes>
            <Route path="/" element={!tokens ? <Outlet /> : <Navigate to='/home' replace />}>
                {
                    allowedRoutes.map((route, index) => (
                        <Route key={index} path={route.path} element={route.element} />
                    ))
                }
            </Route>
        </Routes>
    );
};