import { Box, Divider, Stack, TableBody, TableCell, TableRow, Tooltip } from "@mui/material";
import { useEffect, useState } from "react";

import { ListProps, Order } from "@/domain";
import { useAuth } from "@/hooks";


export const OrderList = ({ data, actions }: ListProps<Order>) => {

    const { userDetails } = useAuth();
    const [ isClient, setIsClient ] = useState<boolean>(false);

    useEffect(() => {
        if(userDetails){
            const userRoles = userDetails.roles;
            setIsClient(userRoles.some(userRole => userRole.name === 'ROLE_CLIENT'));
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
                                        {order.client ? (
                                                <div style={{ display: 'flex', flexDirection: 'column' }}>
                                                    <span>{order.client.name} {order.client.lastName}</span>
                                                    <span>{order.client.phone}</span>
                                                    <span>{order.client.email}</span>
                                                </div>
                                            ) : (
                                                <div>Client information is missing</div>
                                            )}
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
                                    {
                                        !isClient && order.couriers.map((courier, index) => (
                                                        <Box key={courier.id}>
                                                            <div>{courier.name} {courier.lastName}</div>
                                                            <div>{courier.phone}</div>
                                                            {index < order.couriers.length - 1 && <Divider />}
                                                        </Box>
                                                    ))
                                    }
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