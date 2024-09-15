import { useEffect, useState } from "react";

import { paths } from "@/helpers";
import { serviceRequest } from "@/services";
import { BranchResponse, PageResponse, ValueColumn } from "@/domain"
import { BranchForm, BranchList, ItemsPage } from "@/ui";
import { PartialProps } from "./interface";

export const BranchesPartial = ({ userDetails }: PartialProps) => {

    const initialBranch: BranchResponse = {
        id: 0,
        city: '',
        address: '',
        office: { id: 0, name: '' }
    }

    const getBranches = (page: number, size: number) => serviceRequest.getItem<PageResponse<BranchResponse[]>>(`${paths.courier.branches}?page=${page}&size=${size}`);

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
        if(userDetails.roles.some(role => role.name === 'ROLE_ADMIN')){
            setBranchColumns([...branchColumns, { key: 'actions', label: '' }]);
        }
    }, [userDetails]);

    const branchAllowedRoles = {
        create: ['ROLE_ADMIN'],
        update: ['ROLE_ADMIN'],
        delete: ['ROLE_ADMIN']
    }

    const formatMessage = (branch: BranchResponse) => {
        return `Are you sure you want to delete:
                Branch: ${branch.city} - ${branch.address},`
    }

    return(
        <>
            <ItemsPage<BranchResponse>
                userDetails={userDetails}
                header={{
                    title: 'Branches',
                    placeholder: 'Search branch...',
                    buttonName: 'Create Branch'
                }}
                getItems={getBranches}
                actions={{
                    createOrUpdateItem: createOrUpdateBranch,
                    deleteItem: deleteBranch,
                    searchItem: searchBranch
                }}
                list={{
                    columns: branchColumns,
                    itemList: (data, actions) => <BranchList data={data} actions={actions}/>,
                    itemForm: (item, onSubmit, onClose) => <BranchForm item={item} onSubmit={onSubmit} onClose={onClose}/>
                }}
                options={{
                    showSearch: true,
                    allowedRoles: branchAllowedRoles
                }}
                initialItem={initialBranch}
                formatMessage={formatMessage}
            />
        </>
    )
}