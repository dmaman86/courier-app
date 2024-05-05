import React from "react";
import { useAuth } from "../../../hooks";


export const HomeAdmin = () => {

    const { userDetails } = useAuth();

    return(
        <>
            <h1>Home Admin {userDetails?.name}</h1>
        </>
    )
}