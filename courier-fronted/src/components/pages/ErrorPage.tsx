import { useEffect, useState } from "react";
import { useAuth } from "../../hooks";
import { useNavigate } from "react-router-dom";
import { AxiosError } from "axios";


export const ErrorPage = () => {

    const { error } = useAuth();
    const [ errorMessage, setErrorMessage ] = useState<string | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        return () => {
            setErrorMessage(null);
        }
    }, []);

    useEffect(() => {
        if(error){
            const { error: err, cancelled, needLogout } = error;
            if(needLogout){
                navigate('/login', { replace: true });
            }

            if(err instanceof AxiosError && err.response)
                setErrorMessage(err.response.data);
        }
    }, [error, navigate]);

    return(
        <>
            <h1>Error Occurred</h1>
            <p>{errorMessage}</p>
        </>
    )
}