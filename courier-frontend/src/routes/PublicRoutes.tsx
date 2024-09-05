import { Navigate, Outlet, Route, Routes } from "react-router-dom";

import { Client, User } from "@/domain";
import { useRouteConfig } from "@/useCases";

export const PublicRoutes = ({ userDetails }: { userDetails: User | Client | null }) => {
    const { getRoutes } = useRouteConfig();
    const allowedRoutes = getRoutes();

    return (
        <Routes>
            <Route path="/" element={!userDetails ? <Outlet /> : <Navigate to='/home' replace />}>
                {
                    allowedRoutes.map((route, index) => (
                        <Route key={index} path={route.path} element={route.element} />
                    ))
                }
            </Route>
        </Routes>
    );
};