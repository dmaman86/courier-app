import { Navigate, Outlet, Route, Routes } from "react-router-dom";
import { Login } from "../components";

import { useAuth } from "../hooks";
import { Token } from "../types/token.type";

export const PublicRoutes = () => {

    const { tokens } = useAuth();

    return(
        <Routes>
            <Route path='/' element={<PublicRoute tokens={tokens} children={<Outlet />}/>}>
                <Route index element={<Navigate to="/login" replace />} />
                <Route path="login" element={<Login />} />

                <Route path="*" element={<Navigate to="/login" replace />} />
            </Route>
        </Routes>
    );
}

const PublicRoute = ({children, tokens}: {children: JSX.Element; tokens: Token | null}) => {

    return !tokens ? children : <Navigate to="/home" replace/>;
}