import React, { useState, useEffect } from "react";
import { NavLink, Link } from "react-router-dom";
import { useAuth, useFetch } from "../../hooks";

export const Navbar: React.FC = () => {

    const { logout} = useAuth();

    const [ toogle, setToogle ] = useState(false);
    const [ show, setShow ] = useState('');
    const [ user, setUser ] = useState(null);
    const [ isLoggingOut, setIsLoggingOut ] = useState(false);
    const { data, loading, error, updateUrl, updateOptions } = useFetch('/courier/users/me');
    

    const toogleMenu = () => setToogle(!toogle);


    useEffect(() => {
        return () => {
            setToogle(false);
            setUser(null);
            setIsLoggingOut(false);
        }
    }, []);

    useEffect(() => {
        setShow((!toogle) ? '' : 'show');
    }, [toogle]);

    useEffect(() => {
        if(user !== null) console.log(user);
    }, [user]);

    useEffect(() => {
        if(user === null && !isLoggingOut){
            if(!loading && error === null){
                setUser(data);
            }
        }
    }, [data, error, isLoggingOut, loading, user]);

    useEffect(() => {
        if(isLoggingOut){
            if(!loading && error === null){
                logout();
            }
        }
    }, [error, isLoggingOut, loading, logout]);

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


    return(
        <>
            <nav className="navbar navbar-expand-lg navbar-light bg-light">
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
                                <div className={"collapse navbar-collapse" + show}>
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