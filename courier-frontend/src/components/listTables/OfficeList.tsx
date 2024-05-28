import { TableBody, TableCell, TableRow, Stack, Box, Divider } from "@mui/material";

import { Action, OfficeResponse } from "../../types"
import { useAuth } from "../../hooks";
import { useEffect, useState } from "react";


export const OfficeList = ({ data, actions }: { data: OfficeResponse[], actions?: Action<OfficeResponse>[] }) => {

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
                    data.map(office => (
                        <TableRow key={office.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                            <TableCell>{office.name}</TableCell>
                            <TableCell>
                                {
                                    office.branches.map((branch, index) => (
                                        <Box key={branch.id}>
                                            <div>{branch.address}</div>
                                            <div>{branch.city}</div>
                                            {index < office.branches.length - 1 && <Divider />}
                                        </Box>
                                    ))
                                }
                            </TableCell>
                            {
                                actions && (
                                    <TableCell>
                                        <Stack spacing={2} direction='row'>
                                            {
                                                isAdmin && actions.map(action => (
                                                    <button key={action.label} className={action.classNameButton} onClick={() => action.method(office)}>
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
        </>
    )
}