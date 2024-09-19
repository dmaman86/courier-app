import { Route, Routes } from "react-router-dom";

import { useRouteConfig } from "@/useCases";


export const ProtectedRoutes = () => {

    const { routes: allowedRoutes } = useRouteConfig();

    return (
        <Routes>
            {
                allowedRoutes.map((route, index) => (
                    <Route key={index} path={route.path} element={route.element} />
                ))
            } 
        </Routes>
    );


}