import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../hooks";

export const PrivateRoute = () => {
    const { tokens } = useAuth();

    return tokens ? <Outlet /> : <Navigate to="/login" replace/>;
}