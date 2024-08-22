import { HomeAdmin } from "@/components";
import { HomeClient } from "./client/HomeClient";
import { HomeCourier } from "./courier/HomeCourier";
import { useAuth } from "@/hooks";
import { User } from "@/types";
import { useEffect, useState } from "react";
import React from "react";


export const Home = () => {

    const { userDetails } = useAuth();
    const [ components, setComponents ] = useState<JSX.Element[]>([]);

    useEffect(() => {
        console.log(userDetails);
    }, [userDetails]);

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