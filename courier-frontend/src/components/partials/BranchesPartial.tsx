import { paths } from "../../helpers";
import { serviceRequest } from "../../services";
import { BranchResponse, PageRespost, ValueColumn } from "../../types"
import { BranchForm } from "../modal";
import { ItemsPage } from "../shared";
import { BranchList } from "../listTables/BranchList";


const branchColumns: ValueColumn[] = [
    { key: 'branch', label: 'Branch' },
    { key: 'name', label: 'Office Name' }
]

export const BranchesPartial = () => {

    const fetchBranches = (page: number, size: number) => serviceRequest.getItem<PageRespost<BranchResponse[]>>(`${paths.courier.branches}?page=${page}&size=${size}`);

    const createOrUpdateBranch = (branch: BranchResponse) => branch.id ? serviceRequest.putItem<BranchResponse>(`${paths.courier.branches}${branch.id}`, branch) :
                                                            serviceRequest.postItem<BranchResponse>(paths.courier.branches, branch);

    const deleteBranch = (branchId: number) => serviceRequest.deleteItem<string>(`${paths.courier.branches}id/${branchId}`);

    const searchBranch = (query: string, page: number, size: number) => serviceRequest.getItem<PageRespost<BranchResponse[]>>(`${paths.courier.branches}search?query=${query}&page=${page}&size=${size}`);


    return(
        <>
            <ItemsPage<BranchResponse>
                title="Branches"
                placeholder="Search branch..."
                buttonName="Create Branch"
                fetchItems={fetchBranches}
                createOrUpdateItem={createOrUpdateBranch}
                deleteItem={deleteBranch}
                searchItem={searchBranch}
                renderItemForm={(branchId, onSubmit) => <BranchForm branchId={branchId} onSubmit={onSubmit} />}
                columns={branchColumns}
                renderItemList={({ data, actions}) => <BranchList data={data} actions={actions}/>}
                showSearch={true}
            />
        </>
    )
}