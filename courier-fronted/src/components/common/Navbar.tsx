import React, { useState, useEffect } from "react";
import { NavLink, Link } from "react-router-dom";
import { useAuth, useFetchAndLoad, useRouteConfig } from "../../hooks";
import { User } from "../../types";
import { paths } from "../../helpers/paths";
import { serviceRequest } from "../../services";

export const Navbar = () => {

    const { userDetails, logout } = useAuth();
    const { getLinks } = useRouteConfig();

    const [ toogle, setToogle ] = useState(false);
    const [ show, setShow ] = useState('');
    const [ isLoggingOut, setIsLoggingOut ] = useState(false);
    const { loading, callEndPoint } = useFetchAndLoad();


    const toogleMenu = () => {
        setToogle(!toogle);
    }

    useEffect(() => {
        setShow((!toogle) ? '' : 'show');
    }, [toogle]);

    const initiateLogout = async () => {
        const result = await callEndPoint(serviceRequest.postItem(paths.auth.logout));
        if(result.error){
            console.error('Error logging out:', result.error);
            return;
        }
        setIsLoggingOut(false);
        setToogle(false);
        logout();
    }

    useEffect(() => {
        if(!loading && isLoggingOut){
            initiateLogout();
        }
    }, [isLoggingOut, loading]);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        setIsLoggingOut(true);
    }

    const extractRoleNames = (user: User) => {
        const formattedRoles = user.roles.map((role) => {
            return role.name.replace(/^ROLE_/, '');
        });
        return `[${formattedRoles.join(', ')}]`;
    }

    const capitalizeFirstLetter = (word: string) => {
        return word.replace(/^\w/, (c) => c.toUpperCase());
    }


    return(
        <>
            <nav className="navbar navbar-expand-lg bg-body-tertiary">
                <div className="container-fluid">
                    <Link to="/" className="navbar-brand">Navbar</Link>
                    {
                        userDetails && (
                            <>
                                <button
                                    className="navbar-toggler" 
                                    type="button" 
                                    onClick={toogleMenu}>
                                    <span className="navbar-toggler-icon"></span>
                                </button>
                                <div className={"collapse navbar-collapse" + (show ? " show" : "")}>
                                    <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                                        {
                                            getLinks().map((link, index) => (
                                                <li key={index} className="nav-item">
                                                    <NavLink
                                                        to={link.path}
                                                        className={ ({ isActive }) => 'nav-link ' + ( isActive ? 'active' : '')}
                                                    >
                                                        {link.label}
                                                    </NavLink>
                                                </li>
                                            ))
                                        }
                                    </ul>
                                    <div className="d-flex logout">
                                        Logged user: <span>{capitalizeFirstLetter(userDetails.name) + ' ' + capitalizeFirstLetter(userDetails.lastName)}</span>
                                        &nbsp;
                                        Roles: <span>{ extractRoleNames(userDetails) }</span>
                                        &nbsp;
                                        <form onSubmit={ handleSubmit }>
                                            <input type="submit"
                                                className="btn btn-sm btn-outline-danger"
                                                value="Logout"/>
                                        </form>
                                    </div>
                                </div>
                            </>
                        )
                    }
                </div>
            </nav>
        </>
    );
}