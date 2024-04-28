import { useEffect, useState } from "react";
import { useAuth } from "../../hooks"
import { useNavigate } from "react-router-dom";


export const ErrorPage: React.FC = () => {

    const { tokens, error } = useAuth();
    const [ errorMessage, setErrorMessage ] = useState<string | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        return () => {
            setErrorMessage(null);
        }
    }, []);

    useEffect(() => {
        if(!error)
            !tokens ? navigate('/login') : navigate('/home');
        else
            setErrorMessage(error);
    }, [error, tokens, navigate]);

    return(
        <>
            <h1>Error Occurred</h1>
            <p>{errorMessage}</p>
        </>
    )
}