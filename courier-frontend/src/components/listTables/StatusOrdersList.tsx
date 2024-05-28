import { Stack, TableBody, TableCell, TableRow } from "@mui/material"
import { Action, StatusOrder } from "../../types"

export const StatusOrdersList = ({ data, actions }: { data: StatusOrder[], actions?: Action<StatusOrder>[]}) => {

    return(
        <>
            <TableBody>
                {
                    data.map(statusOrder => (
                        <TableRow key={statusOrder.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                            <TableCell>{statusOrder.name}</TableCell>
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