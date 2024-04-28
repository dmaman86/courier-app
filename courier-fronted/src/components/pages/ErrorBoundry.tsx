import React, { useEffect, useState } from "react";
import { useAuth } from "../../hooks";
import { useNavigate } from "react-router-dom";

interface ErrorBoundryProps {
    children: React.ReactNode;
    navigateToErrorPage: () => void;
}

export const ErrorBoundry = ({ children, navigateToErrorPage }: ErrorBoundryProps): React.ReactNode => {

    const [ hasError, setHasError ] = useState(false);
    const { tokens, error } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        return () => {
            setHasError(false);
        }
    }, []);

    useEffect(() => {
        if(error)
            setHasError(true);
    }, [error, navigate, tokens]);

    if(hasError){
        navigateToErrorPage();
    }

    return children;
}