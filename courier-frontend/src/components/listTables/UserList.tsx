import { TableBody, TableCell, TableRow, Stack } from "@mui/material";

import { User, ListProps } from "@/types";
import { useAuth } from "@/hooks";


export const UserList = ({ data, actions }: ListProps<User>) => {

    const { userDetails } = useAuth();

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
                                <TableCell>{extractRoleNames(item)}</TableCell>
                                <TableCell>
                                    <Stack spacing={2} direction='row'>
                                        {userDetails.id !== item.id && actions?.map(action => (
                                            <button key={action.label} className={action.classNameButton} onClick={() => action.method(item)}>
                                                <i className={action.classNameIcon}></i>
                                            </button>
                                        ))}
                                    </Stack>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                )
            }
        </>
    );
}