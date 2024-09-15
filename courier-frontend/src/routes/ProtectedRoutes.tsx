import { Route, Routes } from "react-router-dom";

import { useAuth } from "@/hooks";
import { useRouteConfig } from "@/useCases";
import { useEffect, useState } from "react";


export const ProtectedRoutes = () => {

    const { userDetails } = useAuth();
    const { getRoutesPublic, getRoutesPrivate } = useRouteConfig();
    const [ allowedRoutes, setAllowedRoutes ] = useState(getRoutesPublic());
    
    useEffect(() => {
        if(userDetails){
            setAllowedRoutes(getRoutesPrivate());
        }else{
            setAllowedRoutes(getRoutesPublic());
        }
    }, [userDetails]);

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