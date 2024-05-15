import React, { useEffect } from "react";
import { useAuth } from "../../hooks";
import { useNavigate } from "react-router-dom";

interface ErrorBoundaryProps {
    children: React.ReactNode;
}

export const ErrorBoundary = ({ children }: ErrorBoundaryProps): React.ReactNode => {

    const { tokens, userDetails } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if(!tokens){
            
            userDetails ? navigate('/error', { replace: true }) : navigate('/login', { replace: true });
        }
    }, [tokens, userDetails, navigate]);

    return children;
}