import { paths } from "@/helpers";
import { serviceRequest } from "@/services";
import { OfficeResponse, PageResponse, ValueColumn } from "@/domain";
import { useAuth } from "@/hooks";
import { useEffect, useState } from "react";
import { ItemsPage, OfficeForm, OfficeList } from "@/ui";

export const OfficesPage = () => {

    const { userDetails } = useAuth();

    const [ isAdmin, setIsAdmin ] = useState<boolean>(false);

    const fetchOffices = (page: number, size: number) => serviceRequest.getItem<PageResponse<OfficeResponse[]>>(`${paths.courier.offices}?page=${page}&size=${size}`);

    const createOrUpdateOffice = (office: OfficeResponse) => office.id ? serviceRequest.putItem<OfficeResponse>(`${paths.courier.offices}${office.id}`, office) :
                                                            serviceRequest.postItem<OfficeResponse>(paths.courier.offices, office);

    const deleteOffice = (officeId: number) => serviceRequest.deleteItem<string>(`${paths.courier.offices}id/${officeId}`);

    const searchOffice = (query: string, page: number, size: number) => serviceRequest.getItem<PageResponse<OfficeResponse[]>>(`${paths.courier.offices}search?query=${query}&page=${page}&size=${size}`);

    const [ officeColumns, setOfficeColumns ] = useState<ValueColumn[]>([
        { key: 'name', label: 'Office Name' },
        { key: 'branches', label: 'Branches' }
    ]);

    

    useEffect(() => {
        if(userDetails && userDetails.roles.some(role => role.name === 'ROLE_ADMIN')){
            setOfficeColumns([...officeColumns, { key: 'actions', label: '' }]);
        }
    }, [userDetails]);

    const officeAllowedRoles = {
        create: ['ROLE_ADMIN'],
        update: ['ROLE_ADMIN'],
        delete: ['ROLE_ADMIN']
    }

    return(
        <>
            {
                userDetails && (
                    <ItemsPage<OfficeResponse>
                        userDetails={userDetails}
                        title="Offices"
                        placeholder="Search office..."
                        buttonName="Create Office"
                        fetchItems={fetchOffices}
                        createOrUpdateItem={createOrUpdateOffice}
                        deleteItem={deleteOffice}
                        searchItem={searchOffice}
                        renderItemForm={(officeId, onSubmit) => <OfficeForm officeId={officeId} onSubmit={onSubmit} />}
                        columns={officeColumns}
                        renderItemList={({ data, actions }) => <OfficeList data={data} actions={actions}/>}
                        showSearch={true}
                        allowedRoles={officeAllowedRoles}
                    />
                )
            }
        </>
    )
}