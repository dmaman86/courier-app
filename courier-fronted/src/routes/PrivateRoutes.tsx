import { Navigate, Outlet, Route, Routes } from "react-router-dom";
import { Home, Profile } from "../components";

import { Token, User } from "../types";

interface PrivateRoutesProps {
    tokens: Token | null;
    user: User | null;
}

export const PrivateRoutes = ({ tokens, user }: PrivateRoutesProps) => {

    return(
        <Routes>
            <Route path='/' element={
                    user ? (
                        <PrivateRoute tokens={tokens} children={<Outlet />}/>
                    ): (<div>Loading user data...</div>)
            }>
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