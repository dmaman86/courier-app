import React, { useState, useEffect } from "react";
import { NavLink, Link } from "react-router-dom";
import { useFetch } from "../../hooks";
import { Token, User } from "../../types"; 

interface NavbarProps {
    tokens: Token | null;
    logout: () => void;
    user: User | null;
    setUser: (user: User | null) => void;
}

export const Navbar: React.FC<NavbarProps> = (props) => {

    const { tokens, logout, user, setUser } = props;

    const [ toogle, setToogle ] = useState(false);
    const [ show, setShow ] = useState('');
    const [ isLoggingOut, setIsLoggingOut ] = useState(false);
    const { data, loading, error, updateUrl, updateOptions } = useFetch('');
    

    const toogleMenu = () => {
        setToogle(!toogle);
    }


    useEffect(() => {
        return () => {
            setToogle(false);
            setUser(null);
            setIsLoggingOut(false);
        }
    }, []);

    useEffect(() => {
        if(tokens){
            updateUrl('/courier/users/me');
        }
    }, [tokens, updateUrl]);

    useEffect(() => {
        setShow((!toogle) ? '' : 'show');
    }, [toogle]);

    useEffect(() => {
        if(user !== null) console.log(user);
    }, [user]);

    useEffect(() => {
        if(user === null && !isLoggingOut){
            if(!loading && error === null && isUserData(data)){
                setUser(data);
            }
        }
    }, [data, error, isLoggingOut, loading, setUser, user]);

    useEffect(() => {
        if(isLoggingOut){
            if(!loading && error === null){
                setUser(null);
                logout();
            }
        }
    }, [error, isLoggingOut, loading, logout, setUser]);

    const changeSource = () => {
        updateUrl('/auth/logout');
        updateOptions({
            method: 'POST'
        });
        setIsLoggingOut(true);
    }

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        changeSource();
    }

    const isUserData = (data: unknown): data is User => {
        return (data as User).id !== undefined && (data as User).email !== undefined;
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
                                        <li className="nav-item">
                                            <NavLink
                                                to="/profile"
                                                className={ ({ isActive }) => 'nav-link ' + ( isActive ? 'active' : '')}
                                            >
                                                Profile
                                            </NavLink>
                                        </li>
                                        
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