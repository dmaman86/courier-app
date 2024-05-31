import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { useAuth } from "@/hooks";

export const ErrorPage = () => {

    const { tokens } = useAuth();
    const [ errorMessage, setErrorMessage ] = useState<string | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        return () => {
            setErrorMessage(null);
        }
    }, []);

    return(
        <>
            <h1>Error Occurred</h1>
            <p>{errorMessage}</p>
        </>
    )
}