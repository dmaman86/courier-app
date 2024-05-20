import { Navigate, Outlet, Route, Routes } from "react-router-dom";
import { Login, SignUp } from "../components";
import { Token } from "../types";
import { useAuth } from "../hooks";

export const PublicRoutes = () => {
    const { tokens } = useAuth();

    return (
        <Routes>
            <Route path="/" element={<PublicRoute tokens={tokens} />}>
                <Route index element={<Navigate to="/login" replace />} />
                <Route path="login" element={<Login />} />
                <Route path="signup" element={<SignUp />} />
                <Route path="*" element={<Navigate to="/login" replace />} />
            </Route>
        </Routes>
    );
};

const PublicRoute = ({ tokens }: { tokens: Token | null }) => {
    return !tokens ? <Outlet /> : <Navigate to="/home" replace />;
};