import { useEffect, useState } from "react";
import { useAuth } from "../../hooks";
import { Action, BranchResponse } from "../../types"
import { Stack, TableBody, TableCell, TableRow } from "@mui/material";

export const BranchList = ({ data, actions }: { data: BranchResponse[], actions?: Action<BranchResponse>[]}) => {

    const { userDetails } = useAuth();

    const [ isAdmin, setIsAdmin ] = useState<boolean>(false);


    useEffect(() => {
        if(userDetails){
            const userRoles = userDetails.roles;
            setIsAdmin(userRoles.some(userRole => userRole.name === 'ROLE_ADMIN'));
        }
    }, [userDetails]);

    return(
        <>
            <TableBody>
                {
                    data.map(branch => (
                        <TableRow key={branch.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                            <TableCell>
                                <div style={{ display: 'flex', flexDirection: 'column' }}>
                                    <span>{branch.address}</span>
                                    <span>{branch.city}</span>
                                </div>
                            </TableCell>
                            <TableCell>{branch.office.name}</TableCell>
                            {actions && (
                                    <TableCell>
                                        <Stack spacing={2} direction='row'>
                                            {isAdmin && actions.map(action => (
                                                <button key={action.label} className={action.classNameButton} onClick={() => action.method(branch)}>
                                                    <i className={action.classNameIcon}></i>
                                                </button>
                                            ))}
                                        </Stack>
                                    </TableCell>
                                )}
                        </TableRow>
                    ))
                }
            </TableBody>
        </>
    )
}