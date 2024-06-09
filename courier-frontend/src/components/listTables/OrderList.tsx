import { Stack, TableBody, TableCell, TableRow, Tooltip } from "@mui/material";
import { useEffect, useState } from "react";

import { Action, Order, User } from "@/types";


export const OrderList = ({ data, actions, userDetails }: { data: Order[], actions?: Action<Order>[], userDetails?: User}) => {

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
                data.length > 0 && (
                    <TableBody>
                        {
                            data.map(order => (
                                <TableRow key={order.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                    <TableCell>
                                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                                            <span>{order.client?.name} {order.client?.lastName}</span>
                                            <span>{order.client?.phone}</span>
                                            <span>{order.client?.email}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                                            <span>{order.originBranch?.office.name}</span>
                                            <span>{order.originBranch?.city} {order.originBranch?.address}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                                            {order.destinationBranch && <span>{order.destinationBranch.office.name}</span>}
                                            {order.destinationBranch ? <span>{order.destinationBranch.city} {order.destinationBranch.address}</span> : <span>{order.destinationAddress}</span>}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div style={{ display: 'flex', alignItems: 'center' }}>
                                            {order.currentStatus?.name}
                                            <Tooltip title={order.currentStatus?.description || ''}>
                                                <i className='fas fa-info-circle' style={{ marginLeft: '5px' }}></i>
                                            </Tooltip>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                                <Stack spacing={2} direction='row'>
                                                    {actions?.map(action => (
                                                        <button key={action.label} className={action.classNameButton} onClick={() => action.method(order)}>
                                                            <i className={action.classNameIcon}></i>
                                                        </button>
                                                    ))}
                                                </Stack>
                                    </TableCell>
                                </TableRow>
                            ))
                        }
                    </TableBody>
                )
            }
        </>
    )
}