import { paths } from "@/helpers";
import { serviceRequest } from "@/services";
import { Contact, PageResponse, ValueColumn } from "@/domain";
import { useAuth } from "@/hooks";
import { useEffect, useState } from "react";
import { ContactForm, ContactList, ItemsPage } from "@/ui";


export const ContactsPage = () => {

    const { userDetails } = useAuth();

    const initialContact: Contact = {
        id: 0,
        name: '',
        lastName: '',
        phone: '',
        office: { id: 0, name: '' },
        branches: []
    };

    const getContacts = (page: number, size: number) => serviceRequest.getItem<PageResponse<Contact[]>>(`${paths.courier.contacts}?page=${page}&size=${size}`);

    const createOrUpdateContact = (contact: Contact) => contact.id ? serviceRequest.putItem<Contact, Contact>(paths.courier.contacts, contact) :
                                                        serviceRequest.postItem<Contact, Contact>(paths.courier.contacts, contact);

    const deleteContact = (contactId: number) => serviceRequest.deleteItem<string>(`${paths.courier.contacts}id/${contactId}`);

    const searchContact = (query: string, page: number, size: number) => serviceRequest.getItem<PageResponse<Contact[]>>(`${paths.courier.contacts}search?query=${query}&page=${page}&size=${size}`);

    const [ contactColumns, setContactColumns ] = useState<ValueColumn[]>([
        { key: 'fullname', label: 'Fullname' },
        { key: 'contactInfo', label: 'Contact Information' },
        { key: 'name', label: 'Office Name' },
        { key: 'branches', label: 'Branches' }
    ]);

    const contactAllowedRoles = {
        create: ['ROLE_ADMIN'],
        update: ['ROLE_ADMIN'],
        delete: ['ROLE_ADMIN']
    }

    
    useEffect(() => {
        if(userDetails && userDetails.roles.some(role => contactAllowedRoles.update.includes(role.name) || contactAllowedRoles.delete.includes(role.name))){
            setContactColumns([...contactColumns, { key: 'actions', label: '' }]);
        }
    }, [userDetails]);

    const formatMessage = (contact: Contact) => {
        return `Are you sure you want to delete:
                Fullname: ${contact.name} ${contact.lastName},
                Phone: ${contact.phone},
                Office: ${contact.office.name}`
    }

    return(
        <>
            {
                userDetails && (
                    <ItemsPage<Contact>
                        userDetails={userDetails}
                        header={{
                            title: 'Contacts',
                            placeholder: 'Search contact...',
                            buttonName: 'Create Contact'
                        }}
                        getItems={getContacts}
                        actions={{
                            createOrUpdateItem: createOrUpdateContact,
                            deleteItem: deleteContact,
                            searchItem: searchContact
                        }}
                        list={{
                            columns: contactColumns,
                            itemList: (data, actions) => <ContactList data={data} actions={actions}/>,
                            itemForm: (item, onSubmit) => <ContactForm item={item} onSubmit={onSubmit}/>
                        }}
                        options={{
                            showSearch: true,
                            allowedRoles: contactAllowedRoles
                        }}
                        initialItem={initialContact}
                        formatMessage={formatMessage}
                    />
                )
            }
        </>
    )
}