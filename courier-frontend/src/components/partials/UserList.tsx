import { useEffect, useState } from "react";
import { TableBody, TableCell, TableRow, Stack } from "@mui/material";


import { useAuth } from "../../hooks";
import { Action, User } from "../../types";


export const UserList = ({ data, actions }: { data: User[], actions?: Action<User>[]}) => {

    const { userDetails } = useAuth();

    const [ isAdmin, setIsAdmin ] = useState<boolean>(false);


    useEffect(() => {
        if(userDetails){
            const userRoles = userDetails.roles;
            setIsAdmin(userRoles.some(userRole => userRole.name === 'ROLE_ADMIN'));
        }
    }, [userDetails]);

    const extractRoleNames = (item: User) => {
        const formattedRoles = item.roles.map((role) => {
            return role.name.replace(/^ROLE_/, '');
        });
        return `[${formattedRoles.join(', ')}]`;
    }

    return(
        <>
            {
                userDetails && (
                    <TableBody>
                        {data.map(item => (
                            <TableRow key={item.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                <TableCell>{item.name} {item.lastName}</TableCell>
                                <TableCell>
                                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                                        <span>{item.email}</span>
                                        <span>{item.phone}</span>
                                    </div>
                                </TableCell>
                                { isAdmin && <TableCell>{extractRoleNames(item)}</TableCell> }
                                {actions && (
                                    <TableCell>
                                        <Stack spacing={2} direction='row'>
                                            {isAdmin && userDetails.id !== item.id && actions.map(action => (
                                                <button key={action.label} className={action.classNameButton} onClick={() => action.method(item)}>
                                                    <i className={action.classNameIcon}></i>
                                                </button>
                                            ))}
                                        </Stack>
                                    </TableCell>
                                )}
                            </TableRow>
                        ))}
                    </TableBody>
                )
            }
        </>
    );
}