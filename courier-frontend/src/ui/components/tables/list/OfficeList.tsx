import { TableBody, TableCell, TableRow, Stack, Box, Divider } from "@mui/material";

import { Branch, OfficeResponse, ListProps } from "@/domain"


export const OfficeList = ({ data, actions }: ListProps<OfficeResponse>) => {


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
                                        <Box key={(branch as Branch).id}>
                                            <div>{branch.address}</div>
                                            <div>{branch.city}</div>
                                            {index < office.branches.length - 1 && <Divider />}
                                        </Box>
                                    ))
                                }
                            </TableCell>
                            <TableCell>
                                <Stack spacing={2} direction='row'>
                                    {
                                        actions?.map(action => (
                                            <button key={action.label} className={action.classNameButton} onClick={() => action.method(office)}>
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