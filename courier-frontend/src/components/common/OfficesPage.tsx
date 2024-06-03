import { paths } from "@/helpers";
import { serviceRequest } from "@/services";
import { OfficeResponse, PageResponse, ValueColumn } from "@/types";
import { OfficeForm } from "@/components/modal";
import { ItemsPage } from "@/components/shared";
import { OfficeList } from "@/components/listTables";
import { useAuth } from "@/hooks";
import { useEffect, useState } from "react";

export const OfficesPage = () => {

    const { userDetails } = useAuth();

    const [ isAdmin, setIsAdmin ] = useState<boolean>(false);

    const fetchOffices = (page: number, size: number) => serviceRequest.getItem<PageResponse<OfficeResponse[]>>(`${paths.courier.offices}?page=${page}&size=${size}`);

    const createOrUpdateOffice = (office: OfficeResponse) => office.id ? serviceRequest.putItem<OfficeResponse>(`${paths.courier.offices}${office.id}`, office) :
                                                            serviceRequest.postItem<OfficeResponse>(paths.courier.offices, office);

    const deleteOffice = (officeId: number) => serviceRequest.deleteItem<string>(`${paths.courier.offices}id/${officeId}`);

    const searchOffice = (query: string, page: number, size: number) => serviceRequest.getItem<PageResponse<OfficeResponse[]>>(`${paths.courier.offices}search?query=${query}&page=${page}&size=${size}`);

    const officeColumns: ValueColumn[] = [
        { key: 'name', label: 'Office Name' },
        { key: 'branches', label: 'Branches' }
    ]

    useEffect(() => {
        if(userDetails){
            const userRoles = userDetails.roles;
            setIsAdmin(userRoles.some(userRole => userRole.name === 'ROLE_ADMIN'));
        }
    }, [userDetails]);

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
                canCreate={isAdmin}
            />
        </>
    )
}