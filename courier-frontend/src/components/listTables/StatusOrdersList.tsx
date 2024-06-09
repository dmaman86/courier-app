import { Stack, TableBody, TableCell, TableRow } from "@mui/material"
import { Action, StatusOrder, User, ListProps } from "@/types"

export const StatusOrdersList = ({ data, actions }: ListProps<StatusOrder>) => {

    return(
        <>
            <TableBody>
                {
                    data.map(statusOrder => (
                        <TableRow key={statusOrder.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                            <TableCell>{statusOrder.name}</TableCell>
                            <TableCell>{statusOrder.description}</TableCell>
                            {actions && (
                                <TableCell>
                                    <Stack spacing={2} direction='row'>
                                        {actions.map(action => (
                                            <button key={action.label} className={action.classNameButton} onClick={() => action.method(statusOrder)}>
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