import { Navigate, Outlet, Route, Routes } from "react-router-dom";

import { Client, User } from "@/domain";
import { useRouteConfig } from "@/useCases";

interface PrivateRoutesProps {
    userDetails: User | Client | null;
}

export const PrivateRoutes = ({ userDetails }: PrivateRoutesProps) => {

    const { getRoutes } = useRouteConfig();
    const allowedRoutes = getRoutes();

    return(
        <Routes>
            <Route path='/' element={userDetails ? <Outlet /> : <Navigate to='/login' replace />}>
                {
                    allowedRoutes.map((route, index) => (
                        <Route key={index} path={route.path} element={route.element} />
                    ))
                }
            </Route>
        </Routes>
    );
}