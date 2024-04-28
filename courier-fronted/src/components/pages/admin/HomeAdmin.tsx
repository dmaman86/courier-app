import React, { useEffect } from "react";
import { useAuth } from "../../../hooks";


export const HomeAdmin: React.FC = () => {

    const { userDetails } = useAuth();

    useEffect(() => {
        if(userDetails) console.log('Home Admin: ', userDetails);
    }, [userDetails]);

    return(
        <>
            <h1>Home Admin {userDetails?.name}</h1>
        </>
    )
}