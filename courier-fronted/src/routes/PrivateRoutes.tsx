import { Navigate, Outlet, Route, Routes } from "react-router-dom";
import { Home, Profile } from "../components";

import { useAuth } from "../hooks";
import { Token } from "../types/token.type";

export const PrivateRoutes = () => {

    const { tokens } = useAuth();

    return(
        <Routes>
            <Route path='/' element={<PrivateRoute tokens={tokens} children={<Outlet />}/>}>
                <Route index element={<Navigate to="/home" replace />} />
                <Route path="home" element={<Home />} />
                <Route path="profile" element={<Profile />} />

                <Route path="*" element={<Navigate to="/home" replace />} />
            </Route>
        </Routes>
    );
}

const PrivateRoute = ({children, tokens}: {children: JSX.Element; tokens: Token | null}) => {

    return tokens ? children : <Navigate to="/login" replace/>;
}