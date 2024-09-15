import React from "react";
import { useEffect, useState } from "react";

import { HomeAdmin } from "./HomeAdmin";
import { HomeClient } from "./HomeClient";
import { HomeCourier } from "./HomeCourier";
import { PageProps } from "../interface";
import { withLoading } from "@/hoc";


const Home = ({ userDetails }: PageProps) => {

    const roles = userDetails.roles.map(role => role.name);

    const [ components, setComponents ] = useState<JSX.Element[]>([]);


    useEffect(() => {
        const buildComponents = () => {
            const newComponents = [];

            if (roles.includes('ROLE_ADMIN')) {
                newComponents.push(<HomeAdmin key='admin' userDetails={userDetails}/>);
            }
            if (roles.includes('ROLE_COURIER')) {
                newComponents.push(<HomeCourier key='courier' userDetails={userDetails}/>);
            }
            if (roles.includes('ROLE_CLIENT')) {
                newComponents.push(<HomeClient key='client' userDetails={userDetails}/>);
            }

            setComponents(newComponents);
        }

        if(!components.length) buildComponents();
    }, [components]);

    if(!components.length) return <div>Loading data...</div>;
    

    return(
        <>
            { components.map((component, index) => (
                <React.Fragment key={index}>{component}</React.Fragment>
            )) }
        </>
    )
}

export default withLoading(Home);