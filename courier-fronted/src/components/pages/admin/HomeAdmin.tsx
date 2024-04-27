import React, { useEffect } from "react"
import { RoutesProps } from "../../../types"


export const HomeAdmin: React.FC<RoutesProps> = ({tokens, user}) => {

    useEffect(() => {
        if(user) console.log('Home Admin: ', user);
    }, [user]);

    return(
        <>
            <h1>Home Admin {user?.name}</h1>
        </>
    )
}