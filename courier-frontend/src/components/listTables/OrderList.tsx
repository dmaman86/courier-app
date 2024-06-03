import { useAuth } from "@/hooks";
import { Action, Order } from "@/types";
import { Stack, TableBody, TableCell, TableRow } from "@mui/material";
import { useEffect, useState } from "react";


export const OrderList = ({ data, actions }: { data: Order[], actions?: Action<Order>[]}) => {

    const { userDetails } = useAuth();

    const [ isAdmin, setIsAdmin ] = useState<boolean>(false);


    useEffect(() => {
        if(userDetails){
            const userRoles = userDetails.roles;
            setIsAdmin(userRoles.some(userRole => userRole.name === 'ROLE_ADMIN'));
        }
    }, [userDetails]);

    return (
        <>
            {
                userDetails && (
                    <TableBody>
                        {
                            data.map(order => (
                                <TableRow key={order.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                    <TableCell>
                                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                                            <span>{order.client.name} {order.client.lastName}</span>
                                            <span>{order.client.phone} {order.client.email}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                                            <span>{order.originOffice.name}</span>
                                            <span>{order.originBranch.city} {order.originBranch.address}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                                            {order.destinationOffice && <span>{order.destinationOffice.name}</span>}
                                            {order.destinationBranch ? <span>{order.destinationBranch.city} {order.destinationBranch.address}</span> : <span>{order.destinationAddress}</span>}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        {order.currentStatus?.status.name}
                                    </TableCell>
                                    {
                                        isAdmin && (
                                            <TableCell>
                                                <Stack spacing={2} direction='row'>
                                                    {actions?.map(action => (
                                                        <button key={action.label} className={action.classNameButton} onClick={() => action.method(order)}>
                                                            <i className={action.classNameIcon}></i>
                                                        </button>
                                                    ))}
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