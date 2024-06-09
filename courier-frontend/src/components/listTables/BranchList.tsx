import { useEffect, useState } from "react";
import { Stack, TableBody, TableCell, TableRow } from "@mui/material";

import { BranchResponse, ListProps } from "@/types";

export const BranchList = ({ data, actions }: ListProps<BranchResponse>) => {

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
                            <TableCell>
                                <Stack spacing={2} direction='row'>
                                    {actions?.map(action => (
                                        <button key={action.label} className={action.classNameButton} onClick={() => action.method(branch)}>
                                            <i className={action.classNameIcon}></i>
                                        </button>
                                    ))}
                                </Stack>
                            </TableCell>
                        </TableRow>
                    ))
                }
            </TableBody>
        </>
    )
}