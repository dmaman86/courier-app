import React from "react";
import { useEffect, useState } from "react";

import { HomeAdmin } from "./HomeAdmin";
import { HomeClient } from "./HomeClient";
import { HomeCourier } from "./HomeCourier";
import { useAuth } from "@/hooks";


export const Home = () => {

    const { userDetails } = useAuth();
    const [ components, setComponents ] = useState<JSX.Element[]>([]);

    useEffect(() => {
        if(userDetails){
            const roles = userDetails.roles.map(role => role.name);
            const newComponents = [];

            if (roles.includes('ROLE_ADMIN')) {
                newComponents.push(<HomeAdmin key='admin' />);
            }
            if (roles.includes('ROLE_COURIER')) {
                newComponents.push(<HomeCourier key='courier' />);
            }
            if (roles.includes('ROLE_CLIENT')) {
                newComponents.push(<HomeClient key='client' />);
            }

            setComponents(newComponents);
        }
    }, [userDetails]);

    if(!userDetails) return <div>Loading user data...</div>;

    return(
        <>
            { components.map((component, index) => (
                <React.Fragment key={index}>{component}</React.Fragment>
            )) }
        </>
    )
}