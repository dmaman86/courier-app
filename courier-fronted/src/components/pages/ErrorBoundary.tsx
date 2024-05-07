import React, { useEffect } from "react";
import { useAuth } from "../../hooks";
import { useNavigate } from "react-router-dom";

interface ErrorBoundaryProps {
    children: React.ReactNode;
}

export const ErrorBoundary = ({ children }: ErrorBoundaryProps): React.ReactNode => {

    const { tokens, error } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if(!tokens && error){
            const { cancelled, needLogout } = error;
            if(cancelled)
                navigate('/error', { replace: true });
            else if(needLogout){
                navigate('/login', { replace: true });
            }
        }
    }, [error, navigate, tokens]);

    return children;
}