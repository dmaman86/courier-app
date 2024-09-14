import { paths } from "@/helpers";
import { serviceRequest } from "@/services";
import { OfficeResponse, PageResponse, ValueColumn } from "@/domain";
import { useAuth } from "@/hooks";
import { useEffect, useState } from "react";
import { ItemsPage, OfficeForm, OfficeList } from "@/ui";

export const OfficesPage = () => {

    const { userDetails } = useAuth();

    const initialOffice: OfficeResponse = {
        id: 0,
        name: '',
        branches: []
    }

    const getOffices = (page: number, size: number) => serviceRequest.getItem<PageResponse<OfficeResponse[]>>(`${paths.courier.offices}?page=${page}&size=${size}`);

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

    const formatMessage = (office: OfficeResponse) => {
        return `Are you sure you want to delete:
                Office Name: ${office.name}`
    }

    return(
        <>
            {
                userDetails && (
                    <ItemsPage<OfficeResponse>
                        userDetails={userDetails}
                        header={{
                            title: 'Offices',
                            placeholder: 'Search office...',
                            buttonName: 'Create Office'
                        }}
                        getItems={getOffices}
                        actions={{
                            createOrUpdateItem: createOrUpdateOffice,
                            deleteItem: deleteOffice,
                            searchItem: searchOffice
                        }}
                        list={{
                            columns: officeColumns,
                            itemList: (data, actions) => <OfficeList data={data} actions={actions}/>,
                            itemForm: (item, onSubmit, onClose) => <OfficeForm item={item} onSubmit={onSubmit} onClose={onClose}/>
                        }}
                        options={{
                            showSearch: true,
                            allowedRoles: officeAllowedRoles
                        }}
                        initialItem={initialOffice}
                        formatMessage={formatMessage}
                    />
                )
            }
        </>
    )
}