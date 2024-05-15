import React, { useState } from "react";
import { useAuth } from "../../hooks";
import { Role, User } from "../../types";
import { GenericModal, UpdatePassword, UserForm } from "../modal";

export const Profile = () => {

    const { userDetails } = useAuth();
    const [ showModalPassword, setShowModalPassword ] = useState(false);
    const [ showModalDetails, setShowModalDetails ] = useState(false);


    const toogleModalPassword = () => setShowModalPassword(!showModalPassword);

    const toogleModalDetails = () => setShowModalDetails(!showModalDetails);

    const handleFormSubmit = (user: User) => {
        console.log(user);
    }

    const extractRoleNames = () => {
        const formattedRoles = userDetails?.roles.map((role: Role) => {
            return role.name.replace(/^ROLE_/, '');
        });
        return `[${formattedRoles?.join(', ')}]`;
    }

    const capitalizeFirstLetter = (word: string | undefined) => {
        return word ? word.replace(/^\w/, (c) => c.toUpperCase()) : '';
    }

    return(
        <>
            <div className="container pt-5">
                <div className="row">
                    <div className="col-lg-10 offset-lg-1">
                        <div className="bg-white shadow rounded">
                            <div className="row justify-content-center">
                                <div className="col-md-7 pe-0">
                                    <div className="form-left h-100 py-5 px-5">
                                        <form className="row g-4 text-center">
                                            <h1>Acccount Overview</h1>
                                            <div className="col-12">
                                                <h4>Email: <span>{ userDetails?.email }</span></h4>
                                            </div>
                                            <div className="col-12">
                                                <h4>Full name: <span>{ capitalizeFirstLetter(userDetails?.name) + ' ' + capitalizeFirstLetter(userDetails?.lastName) }</span></h4>
                                            </div>
                                            <div className="col-12">
                                                <h4>Phone: <span>{ userDetails?.phone }</span></h4>
                                            </div>
                                            <div className="col-12">
                                                <h4>Roles: <span>{ extractRoleNames() }</span></h4>
                                            </div>

                                            <div className="col pt-3 text-center">
                                                <button type="button" className="btn btn-primary" onClick={(event) => {
                                                    event.preventDefault();
                                                    toogleModalDetails();
                                                }}>
                                                        Update details
                                                </button>
                                                <button type="button" className="btn btn-primary" onClick={(event) => {
                                                    event.preventDefault();
                                                    toogleModalPassword();
                                                }}>
                                                        Update password
                                                </button>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {                
                showModalPassword && <GenericModal title="Generic modal" body={<UpdatePassword user={userDetails} onClose={toogleModalPassword} />} show={showModalPassword} onClose={toogleModalPassword} />
            }
            {
                showModalDetails && <GenericModal title="Update details" body={<UserForm user={userDetails} onSubmit={handleFormSubmit}/>} show={showModalDetails} onClose={toogleModalDetails}/>
            }
        </>
    );
}