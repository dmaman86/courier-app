import React, { useState } from "react";
import { useAuth } from "../../hooks";
import { Role, User } from "../../types";
import { GenericModal } from "../modal/GenericModal";
import { UpdatePassword } from "../modal/UpdatePassword";

export const Profile: React.FC = () => {

    const { userDetails } = useAuth();
    const [ showModal, setShowModal ] = useState(false);


    const toogleModal = () => setShowModal(!showModal);

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        toogleModal();
    }

    const extractRoleNames = (user: User) => {
        const formattedRoles = user.roles.map((role: Role) => {
            return role.name.replace(/^ROLE_/, '');
        });
        return `[${formattedRoles.join(', ')}]`;
    }

    const capitalizeFirstLetter = (word: string) => {
        return word.replace(/^\w/, (c) => c.toUpperCase());
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
                                        <form onSubmit={ handleSubmit } className="row g-4 text-center">
                                            <h1>Acccount Overview</h1>
                                            <div className="col-12">
                                                <h4>Email: {(userDetails !== null) && <span>{ userDetails.email }</span>}</h4>
                                            </div>
                                            <div className="col-12">
                                                <h4>Full name: {(userDetails !== null) && <span>{ capitalizeFirstLetter(userDetails.name) + ' ' + capitalizeFirstLetter(userDetails.lastName) }</span>}</h4>
                                            </div>
                                            <div className="col-12">
                                                <h4>Phone: {(userDetails !== null) && <span>{ userDetails.phone }</span>}</h4>
                                            </div>
                                            <div className="col-12">
                                                <h4>Roles: {(userDetails !== null) && <span>{ extractRoleNames(userDetails) }</span>}</h4>
                                            </div>

                                            <div className="col pt-3 text-center">
                                                <button 
                                                    type="submit" 
                                                    className="btn btn-primary">
                                                        Update Password?
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
                showModal && <GenericModal title="Generic modal" body={<UpdatePassword user={userDetails} onClose={toogleModal} />} show={showModal} onClose={toogleModal} />
            }
        </>
    );
}