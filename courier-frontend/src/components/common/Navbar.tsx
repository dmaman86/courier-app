import React, { useEffect, useReducer, useCallback } from "react";
import { NavLink, Link, useLocation } from "react-router-dom";
import { useErrorBoundary } from "react-error-boundary";

import { useAsync, useFetchAndLoad, useRouteConfig } from "@/hooks";
import { Client, FetchResponse, User } from "@/types";
import { paths } from "@/helpers";
import { serviceRequest } from "@/services";
import { AlertDialog } from "@/components/shared";
import { useAuth } from "@/hooks";

interface State {
    toggle: boolean;
    show: string;
    isLoggingOut: boolean;
    showAlertDialog: boolean;
}

const initialState: State = {
    toggle: false,
    show: '',
    isLoggingOut: false,
    showAlertDialog: false
}

type Action = | { type: 'TOGGLE_MENU' } | { type: 'START_LOGOUT' } | { type: 'CANCEL_LOGOUT' } | { type: 'SHOW_ALERT_DIALOG' };

const reducer = (state: State, action: Action): State => {
    switch(action.type){
        case 'TOGGLE_MENU':
            return { ...state, toggle: !state.toggle, show: !state.toggle ? 'show' : '' };
        case 'START_LOGOUT':
            return { ...state, isLoggingOut: true };
        case 'CANCEL_LOGOUT':
            return { ...state, showAlertDialog: false, isLoggingOut: false };
        case 'SHOW_ALERT_DIALOG':
            return { ...state, showAlertDialog: true };
        default:
            return state;
    }
}

export const Navbar = () => {

    const { userDetails, tokens, saveUser, logout } = useAuth();

    const { showBoundary } = useErrorBoundary();

    const { getLinks } = useRouteConfig();

    const { loading, callEndPoint } = useFetchAndLoad();
    const location = useLocation();
    const [ state, dispatch ] = useReducer(reducer, initialState);

    const fetchUserDetails = async () => {
        if(!userDetails && tokens){
            return await callEndPoint(serviceRequest.getItem<User | Client>(`${paths.courier.users}me`));
        }
        return Promise.resolve({ data: null, error: null });
    }

    const handleUserDetails = (response: FetchResponse<User | Client>) => {
        if(!userDetails && tokens){
            const { data, error } = response;
            if(data && !error) saveUser(data);
            else showBoundary(error);
        }
    }

    useAsync(fetchUserDetails, handleUserDetails, () => {}, [userDetails, tokens]);


    useEffect(() => {
        if(!loading && userDetails && state.isLoggingOut){
            initiateLogout();
        }
    }, [state.isLoggingOut, loading]);

    const initiateLogout = async () => {
        const result = await callEndPoint(serviceRequest.postItem(paths.auth.logout));
        if(result.error){
            console.error('Error logging out:', result.error);
            return;
        }
        dispatch({ type: 'CANCEL_LOGOUT' });
        logout();
    }

    

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        dispatch({ type: 'SHOW_ALERT_DIALOG' });
    }

    const handleConfirmLogout = () => {
        dispatch({ type: 'START_LOGOUT' });
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

    const renderUserDetails = useCallback(() => (
        userDetails && <>
            Logged user: <span>{capitalizeFirstLetter(userDetails.name) + ' ' + capitalizeFirstLetter(userDetails.lastName)}</span>
            &nbsp;
            Roles: <span>{ extractRoleNames(userDetails) }</span>
            &nbsp;
            <form onSubmit={ handleSubmit }>
                <input type="submit" className="btn btn-sm btn-outline-danger" value="Logout"/>
            </form>
        </>
    ), [userDetails]);

    const renderLinks = useCallback(() => (
        getLinks().length > 0 && getLinks().map((link, index) => (
            <li key={index} className="nav-item">
                <NavLink
                    to={link.path}
                    className={ ({ isActive }) => 'nav-link ' + ( isActive ? 'active' : '')}
                >
                    {link.label}
                </NavLink>
            </li>
        ))
    ), [getLinks]);


    return(
        <>
            <nav className="navbar navbar-expand-lg bg-body-tertiary">
                <div className="container-fluid">
                    <Link to="/" className="navbar-brand">Navbar</Link>
                    {
                        userDetails ? (
                            <>
                                <button
                                    className="navbar-toggler" 
                                    type="button" 
                                    onClick={() => dispatch({ type: 'TOGGLE_MENU' })}
                                    aria-expanded={state.toggle}
                                    aria-label="Toggle navigation"
                                    >
                                    <span className="navbar-toggler-icon"></span>
                                </button>
                                <div className={"collapse navbar-collapse" + (state.show ? " show" : "")}>
                                    <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                                        { renderLinks() }
                                    </ul>
                                    <div className="d-flex logout">
                                        { renderUserDetails() }
                                    </div>
                                </div>
                            </>
                        ) : (
                            <div className="d-flex ml-auto">
                                { location.pathname !== '/login' && (<Link to='/login' className="btn btn-sm btn-outline-primary">Login</Link>) }
                                { location.pathname !== '/signup' && (<Link to='/signup' className="btn btn-sm btn-outline-secondary ml-2">Signup</Link>) }
                            </div>
                        )
                    }
                </div>
            </nav>
            {
                state.showAlertDialog && (
                    <AlertDialog open={state.showAlertDialog} onClose={() => dispatch({ type: 'CANCEL_LOGOUT' })} onConfirm={handleConfirmLogout} title="Are your sure you want to logout?"/>
                )
            }
        </>
    );
}
