import { useEffect, useState } from "react";
import { User } from "../types";
import { useFetch } from "./useFetch";


export const useUser = () => {
    
    const [ user, setUser ] = useState<User | null>(null);
    const [ isLoggingIn, setIsLoggingIn ] = useState(false);

    const { data, loading, error, updateUrl } = useFetch('');

    useEffect(() => {
        if(isLoggingIn && user === null){
            updateUrl('/courier/users/me');
        }
    }, [isLoggingIn, updateUrl, user]);

    useEffect(() => {
        if(isLoggingIn && user === null){
            if(!loading && error === null){
                setUser(data as User);
            }
        }
    }, [data, error, isLoggingIn, loading, user]);


    useEffect(() => {
        if(!isLoggingIn && user !== null){
            setUser(null);
        }
    }, [isLoggingIn, user]);

    const updateLogginIn = (loading: boolean) => {
        setIsLoggingIn(loading);
    }

    return {
        user,
        isLoggingIn,
        updateLogginIn
    }
}