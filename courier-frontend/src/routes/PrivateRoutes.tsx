import { Navigate, Outlet, Route, Routes } from "react-router-dom";

import { Token } from "@/types";
import { useRouteConfig } from "@/hooks";

interface PrivateRoutesProps {
    tokens: Token | null
}

export const PrivateRoutes = ({ tokens }: PrivateRoutesProps) => {

    const { getRoutes } = useRouteConfig();
    const allowedRoutes = getRoutes();

    return(
        <Routes>
            <Route path='/' element={tokens ? <Outlet /> : <Navigate to='/login' replace />}>
                {
                    allowedRoutes.map((route, index) => (
                        <Route key={index} path={route.path} element={route.element} />
                    ))
                }
            </Route>
        </Routes>
    );
}