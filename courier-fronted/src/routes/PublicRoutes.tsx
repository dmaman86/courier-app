import { Navigate, Outlet, Route, Routes } from "react-router-dom";
import { Login } from "../components";
import { Token } from "../types";

export const PublicRoutes = ({tokens}: {tokens: Token | null}) => {

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