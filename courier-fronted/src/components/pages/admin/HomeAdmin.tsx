import React from "react";
import { useAuth } from "../../../hooks";


export const HomeAdmin: React.FC = () => {

    const { userDetails } = useAuth();

    return(
        <>
            <h1>Home Admin {userDetails?.name}</h1>
        </>
    )
}