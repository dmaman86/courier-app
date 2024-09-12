import { useEffect, useState } from "react";

import { paths } from "@/helpers";
import { serviceRequest } from "@/services";
import { BranchResponse, PageResponse, ValueColumn } from "@/domain"
import { useAuth } from "@/hooks";
import { BranchForm, BranchList, ItemsPage } from "@/ui";

export const BranchesPartial = () => {

    const { userDetails } = useAuth();

    const initialBranch: BranchResponse = {
        id: 0,
        city: '',
        address: '',
        office: { id: 0, name: '' }
    }

    const fetchBranches = (page: number, size: number) => serviceRequest.getItem<PageResponse<BranchResponse[]>>(`${paths.courier.branches}?page=${page}&size=${size}`);

    const createOrUpdateBranch = (branch: BranchResponse) => {
        if(branch.id){
            return serviceRequest.putItem<BranchResponse>(`${paths.courier.branches}${branch.id}`, branch);
        }
        return serviceRequest.postItem<BranchResponse>(paths.courier.branches, branch);
    }

    const deleteBranch = (branchId: number) => serviceRequest.deleteItem<string>(`${paths.courier.branches}id/${branchId}`);

    const searchBranch = (query: string, page: number, size: number) => serviceRequest.getItem<PageResponse<BranchResponse[]>>(`${paths.courier.branches}search?query=${query}&page=${page}&size=${size}`);

    const [ branchColumns, setBranchColumns ] = useState<ValueColumn[]>([
        { key: 'branch', label: 'Branch' },
        { key: 'name', label: 'Office Name' }
    ]);

    useEffect(() => {
        if(userDetails && userDetails.roles.some(role => role.name === 'ROLE_ADMIN')){
            setBranchColumns([...branchColumns, { key: 'actions', label: '' }]);
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
                        renderItemForm={(item, setItem, onSubmit) => <BranchForm branch={item} setBranch={setItem} onSubmit={onSubmit} />}
                        columns={branchColumns}
                        renderItemList={({ data, actions }) => <BranchList data={data} actions={actions}/>}
                        showSearch={true}
                        allowedRoles={branchAllowedRoles}
                        initialItem={initialBranch}
                    />
                )
            }
        </>
    )
}