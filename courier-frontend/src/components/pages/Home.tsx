import { User } from "../../types";
import { HomeAdmin } from "./admin/HomeAdmin";
import { HomeClient } from "./client/HomeClient";
import { HomeCourier } from "./courier/HomeCourier";
import { useAuth } from "../../hooks";

export const Home = () => {

    const { userDetails } = useAuth();

    const getComponent = (localUser: User) => {
        const roles = localUser.roles.map(role => role.name);

        if(roles.includes('ROLE_ADMIN')) return [<HomeAdmin key='admin'/>];

        const components = [];
        if(roles.includes('ROLE_COURIER')) components.push(<HomeCourier key='courier'/>);
        if(roles.includes('ROLE_CLIENT')) components.push(<HomeClient key='client'/>);

        return components;
    }

    return(
        <>
            { userDetails ? (
                <>
                    { getComponent(userDetails).map(component => component)}
                </>
            ) : <div>Loading user data...</div>}
        </>
    )
}