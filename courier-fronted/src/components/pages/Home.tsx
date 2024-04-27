import React from "react";
import { RoutesProps, User } from "../../types";
import { HomeAdmin } from "./admin/HomeAdmin";
import { HomeClient } from "./client/HomeClient";
import { HomeCourier } from "./courier/HomeCourier";

export const Home: React.FC<RoutesProps> = ({tokens, user}) => {

    const getComponent = (localUser: User) => {
        for(const role of localUser.roles)
            return page(role.name);
    }

    const page = (role: string) => ({
        "ROLE_ADMIN": <HomeAdmin tokens={tokens} user={user} />,
        "ROLE_COURIER": <HomeCourier tokens={tokens} user={user} />,
        "ROLE_CLIENT": <HomeClient tokens={tokens} user={user} />
    })[role];

    return(
        <>
            { user ? getComponent(user) : <div>Loading user data...</div>}
        </>
    )
}