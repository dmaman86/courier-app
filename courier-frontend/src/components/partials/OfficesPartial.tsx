import { paths } from "../../helpers";
import { serviceRequest } from "../../services";
import { OfficeResponse, ValueColumn } from "../../types";
import { OfficeForm } from "../modal";
import { ItemsPage } from "../shared";
import { OfficeList } from "./OfficeList";

const officeColumns: ValueColumn[] = [
    { key: 'name', label: 'Office Name' },
    { key: 'branches', label: 'Branches' }
]

export const OfficesPartial = () => {

    const fetchOffices = () => serviceRequest.getItem<OfficeResponse[]>(paths.courier.offices);

    const createOrUpdateOffice = (office: OfficeResponse) => office.id ? serviceRequest.putItem<OfficeResponse>(`${paths.courier.offices}/${office.id}`, office) :
                                                            serviceRequest.postItem<OfficeResponse>(paths.courier.offices, office);

    const deleteOffice = (officeId: number) => serviceRequest.deleteItem<string>(`${paths.courier.offices}/id/${officeId}`);

    const searchOffice = (query: string) => serviceRequest.getItem<OfficeResponse[]>(`${paths.courier.offices}/search?query=${query}`);

    return(
        <>
            <ItemsPage<OfficeResponse>
                title="Offices"
                placeholder="Search office..."
                buttonName="Create Office"
                fetchItems={fetchOffices}
                createOrUpdateItem={createOrUpdateOffice}
                deleteItem={deleteOffice}
                searchItem={searchOffice}
                renderItemForm={(officeId, onSubmit) => <OfficeForm officeId={officeId} onSubmit={onSubmit} />}
                columns={officeColumns}
                renderItemList={({ data, actions}) => <OfficeList data={data} actions={actions}/>}
                showSearch={true}
            />
        </>
    )
}