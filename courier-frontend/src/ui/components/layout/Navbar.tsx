import { Link, useLocation } from "react-router-dom";

import { useFetchAndLoad } from "@/hooks";
import { CustomDialog, NavbarLinks, UserDetails } from "@/ui";
import { useRouteConfig, useNavbar } from "@/useCases";
import { User } from "@/domain";
import { useEffect, useState } from "react";

interface NavbarProps {
    userDetails: User | null;
    logout: () => void;
}

export const Navbar = ({ userDetails, logout }: NavbarProps) => {

    const { links } = useRouteConfig();

    const { callEndPoint } = useFetchAndLoad();
    const location = useLocation();


    const { state, dispatch } = useNavbar(userDetails, logout, callEndPoint);

    const [ titleNavbar, setTittleNavbar ] = useState('');


    useEffect(() => {
        setTittleNavbar(userDetails ? 'Home' : '');
    }, [userDetails]);


    return(
        <>
            <nav className="navbar navbar-expand-lg bg-body-tertiary">
                <div className="container-fluid">
                    <Link to="/" className="navbar-brand">{ titleNavbar }</Link>
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
                                        <NavbarLinks links={links} />
                                    </ul>
                                    <div className="d-flex logout">
                                        <UserDetails userDetails={userDetails} dispatch={dispatch}/>
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
            <CustomDialog 
                open={state.showAlertDialog} 
                onClose={() => dispatch({ type: 'CANCEL_LOGOUT' })} 
                            // onConfirm={() => dispatch({ type: 'START_LOGOUT' })} 
                title="Are your sure you want to logout?"
                actions={
                    <>
                        <button onClick={() => dispatch({ type: 'CANCEL_LOGOUT' })} className="btn btn-secondary">Cancel</button>
                        <button onClick={() => dispatch({ type: 'START_LOGOUT' })} className="btn btn-danger">Sure</button>
                    </>
                }
            />
        </>
    );
}
