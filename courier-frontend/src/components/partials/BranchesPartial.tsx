import { paths } from "@/helpers";
import { serviceRequest } from "@/services";
import { BranchResponse, PageResponse, ValueColumn } from "@/types"
import { BranchForm } from "@/components/modal";
import { ItemsPage } from "@/components/shared";
import { BranchList } from "@/components/listTables";
import { useAuth } from "@/hooks";
import { useEffect, useState } from "react";


const branchColumns: ValueColumn[] = [
    { key: 'branch', label: 'Branch' },
    { key: 'name', label: 'Office Name' }
]

export const BranchesPartial = () => {

    const { userDetails } = useAuth();

    const [ isAdmin, setIsAdmin ] = useState<boolean>(false);

    const fetchBranches = (page: number, size: number) => serviceRequest.getItem<PageResponse<BranchResponse[]>>(`${paths.courier.branches}?page=${page}&size=${size}`);

    const createOrUpdateBranch = (branch: BranchResponse) => branch.id ? serviceRequest.putItem<BranchResponse>(`${paths.courier.branches}${branch.id}`, branch) :
                                                            serviceRequest.postItem<BranchResponse>(paths.courier.branches, branch);

    const deleteBranch = (branchId: number) => serviceRequest.deleteItem<string>(`${paths.courier.branches}id/${branchId}`);

    const searchBranch = (query: string, page: number, size: number) => serviceRequest.getItem<PageResponse<BranchResponse[]>>(`${paths.courier.branches}search?query=${query}&page=${page}&size=${size}`);

    useEffect(() => {
        if(userDetails){
            const userRoles = userDetails.roles;
            setIsAdmin(userRoles.some(userRole => userRole.name === 'ROLE_ADMIN'));
        }
    }, [userDetails]);

    const branchAllowedRoles = {
        create: ['ROLE_ADMIN'],
        update: ['ROLE_ADMIN'],
        delete: ['ROLE_ADMIN']
    }

    return(
        <>
            {
                userDetails && (
                    <ItemsPage<BranchResponse>
                        userDetails={userDetails}
                        title="Branches"
                        placeholder="Search branch..."
                        buttonName="Create Branch"
                        fetchItems={fetchBranches}
                        createOrUpdateItem={createOrUpdateBranch}
                        deleteItem={deleteBranch}
                        searchItem={searchBranch}
                        renderItemForm={(branchId, onSubmit) => <BranchForm branchId={branchId} onSubmit={onSubmit} />}
                        columns={branchColumns}
                        renderItemList={({ data, actions }) => <BranchList data={data} actions={actions}/>}
                        showSearch={true}
                        allowedRoles={branchAllowedRoles}
                    />
                )
            }
        </>
    )
}