import { useEffect, useState } from "react";
import { Box, Divider, Stack, TableBody, TableCell, TableRow } from "@mui/material";

import { Action, Contact, User, ListProps } from "@/types";


export const ContactList = ({ data, actions }: ListProps<Contact>) => {

    useEffect(() => {
        if(data) console.log(data);
    }, [data]);

    return(
        <>
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
                                    <TableCell>
                                        <Stack spacing={2} direction='row'>
                                            {
                                                actions?.map(action => (
                                                    <button key={action.label} className={action.classNameButton} onClick={() => action.method(contact)}>
                                                        <i className={action.classNameIcon}></i>
                                                    </button>
                                                ))
                                            }
                                        </Stack>
                                    </TableCell>
                                </TableRow>
                            ))
                        }
                    </TableBody>
        </>
    )
}