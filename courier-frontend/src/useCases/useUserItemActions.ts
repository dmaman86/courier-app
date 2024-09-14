import { useCallback, useMemo } from "react";

import { Action, User } from "@/domain";

export const useUserItemActions = <T extends { id: number }>(
    userDetails: User,
    allowedRoles: { create: string[], update: string[], delete: string[] },
    handleEditItem: (item: T) => void,
    handleDeleteItem: (item: T) => void
): { userHasRole: (roles: string[]) => boolean, actionsItem: Action<T>[] } => {

    const userHasRole = useCallback((roles: string[]) => {
        return userDetails.roles.some(userRole => roles.includes(userRole.name));
    }, [userDetails]);

    const actionsItem: Action<T>[] = useMemo(() => {
        const itemActions: Action<T>[] = [];

        if (userHasRole(allowedRoles.update)) {
            itemActions.push({ label: 'Edit', classNameButton: 'btn btn-outline-warning', classNameIcon: 'fas fa-edit', method: handleEditItem });
        }
        if (userHasRole(allowedRoles.delete)) {
            itemActions.push({ label: 'Delete', classNameButton: 'btn btn-outline-danger', classNameIcon: 'fas fa-trash-alt', method: handleDeleteItem });
        }

        return itemActions;
    }, [userHasRole, allowedRoles, handleEditItem, handleDeleteItem]);
    
    return { userHasRole, actionsItem };
}