import { TableBody, TableCell, TableRow, Stack } from "@mui/material";
import { Action, Role } from "@/types";


export const RoleList = ({ data, actions }: { data: Role[], actions?: Action<Role>[] }) => {


    return (
        <>
            <TableBody>
                {
                    data.map(item => (
                        <TableRow key={item.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                            <TableCell>{item.name}</TableCell>
                            {actions && (
                                <TableCell>
                                    <Stack spacing={2} direction='row'>
                                        {actions.map(action => (
                                            <button key={action.label} className={action.classNameButton} onClick={() => action.method(item)}>
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
    );
}