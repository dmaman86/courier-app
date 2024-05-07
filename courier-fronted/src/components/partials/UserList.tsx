import { useEffect, useState } from "react";
import { useAuth } from "../../hooks";
import { Action, User } from "../../types";


export const UserList = ({ data, actions }: { data: User[], actions?: Action<User>[]}) => {

    const { userDetails } = useAuth();

    const [ isAdmin, setIsAdmin ] = useState<boolean>(false);
    const [ isSameUser, setIsSameUser ] = useState<boolean>(false);


    useEffect(() => {
        if(userDetails){
            const userRoles = userDetails.roles;
            setIsAdmin(userRoles.some(userRole => userRole.name === 'ROLE_ADMIN'));
        }
    }, [userDetails]);

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
                    <tbody>
                        {data.map(item => (
                            <tr key={item.id}>
                                <td>{item.name} {item.lastName}</td>
                                <td>{item.email}, {item.phone}</td>
                                <td>{extractRoleNames(item)}</td>
                                {actions && (
                                    <td>
                                        {isAdmin && userDetails.id !== item.id && actions.map(action => (
                                            <button key={action.label} onClick={() => action.method(item)}>
                                                {action.label}
                                            </button>
                                        ))}
                                    </td>
                                )}
                            </tr>
                        ))}
                    </tbody>
                )
            }
        </>
    );
}