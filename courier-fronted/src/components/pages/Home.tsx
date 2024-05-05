import React from "react";
import { User } from "../../types";
import { HomeAdmin } from "./admin/HomeAdmin";
import { HomeClient } from "./client/HomeClient";
import { HomeCourier } from "./courier/HomeCourier";
import { useAuth } from "../../hooks";

export const Home = () => {

    const { userDetails } = useAuth();

    const getComponent = (localUser: User) => {
        for(const role of localUser.roles)
            return page(role.name);
    }

    const page = (role: string) => ({
        "ROLE_ADMIN": <HomeAdmin />,
        "ROLE_COURIER": <HomeCourier />,
        "ROLE_CLIENT": <HomeClient  />
    })[role];

    return(
        <>
            { userDetails ? getComponent(userDetails) : <div>Loading user data...</div>}
        </>
    )
}