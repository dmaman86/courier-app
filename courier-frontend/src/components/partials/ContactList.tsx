import { useEffect, useState } from "react";
import { useAuth } from "../../hooks"
import { Action, Contact } from "../../types"
import { Box, Divider, Stack, TableBody, TableCell, TableRow } from "@mui/material";


export const ContactList = ({ data, actions }: { data: Contact[], actions?: Action<Contact>[]}) => {

    const { userDetails } = useAuth();
    const [ isAdmin, setIsAdmin ] = useState<boolean>(false);

    useEffect(() => {
        if(userDetails){
            setIsAdmin(userDetails.roles.some(role => role.name === 'ROLE_ADMIN'));
        }
    }, [userDetails]);

    return(
        <>
            {
                userDetails && (
                    <TableBody>
                        {
                            data.map(contact => (
                                <TableRow key={contact.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                    <TableCell>{contact.name} {contact.lastName}</TableCell>
                                    <TableCell>{contact.phone}</TableCell>
                                    <TableCell>{contact.office.name}</TableCell>
                                    <TableCell>
                                        {
                                            contact.branches.map((branch, index) => (
                                                <Box key={branch.id}>
                                                    <div>{branch.address}</div>
                                                    <div>{branch.city}</div>
                                                    {index < contact.branches.length - 1 && <Divider />}
                                                </Box>
                                            ))
                                        }
                                    </TableCell>
                                    {
                                        (isAdmin && actions) && (
                                            <TableCell>
                                                <Stack spacing={2} direction='row'>
                                                    {
                                                        actions.map(action => (
                                                            <button key={action.label} className={action.classNameButton} onClick={() => action.method(contact)}>
                                                                <i className={action.classNameIcon}></i>
                                                            </button>
                                                        ))
                                                    }
                                                </Stack>
                                            </TableCell>
                                        )
                                    }
                                </TableRow>
                            ))
                        }
                    </TableBody>
                )
            }
        </>
    )
}