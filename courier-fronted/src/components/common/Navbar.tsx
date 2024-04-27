import React, { useState, useEffect } from "react";
import { NavLink, Link } from "react-router-dom";
import { useFetch, useRouteConfig } from "../../hooks";
import { User, NavbarProps } from "../../types";

export const Navbar: React.FC<NavbarProps> = (props) => {

    const { tokens, logout, user, isLoggingIn, updateLogginIn } = props;

    const [ toogle, setToogle ] = useState(false);
    const [ show, setShow ] = useState('');
    const [ isLoggingOut, setIsLoggingOut ] = useState(false);
    const { data, loading, error, updateUrl, updateOptions } = useFetch('');


    const { getLinks } = useRouteConfig(user?.roles || []);

    const toogleMenu = () => {
        setToogle(!toogle);
    }


    useEffect(() => {
        return () => {
            setToogle(false);
            // updateLogginIn(false);
            setIsLoggingOut(false);
        }
    }, []);

    useEffect(() => {
        if(tokens){
            updateLogginIn(true);
        }
    }, [tokens, updateLogginIn]);

    useEffect(() => {
        setShow((!toogle) ? '' : 'show');
    }, [toogle]);

    useEffect(() => {
        if(user !== null) console.log(user);
    }, [user]);


    useEffect(() => {
        if(!isLoggingIn && isLoggingOut){
            if(!loading && error === null){
                logout();
            }
        }
    }, [error, isLoggingIn, isLoggingOut, loading, logout]);

    const changeSource = () => {
        updateUrl('/auth/logout');
        updateOptions({
            method: 'POST'
        });
        updateLogginIn(false);
        setIsLoggingOut(true);
    }

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        changeSource();
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
                        user && (
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
                                        Logged user: <span>{capitalizeFirstLetter(user.name) + ' ' + capitalizeFirstLetter(user.lastName)}</span>
                                        &nbsp;
                                        Roles: <span>{ extractRoleNames(user) }</span>
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