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

    const fetchContacts = (page: number, size: number) => serviceRequest.getItem<PageResponse<Contact[]>>(`${paths.courier.contacts}?page=${page}&size=${size}`);

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

    return(
        <>
            {
                userDetails && (
                    <ItemsPage<Contact>
                        userDetails={userDetails}
                        title="Contacts"
                        placeholder="Search contact..."
                        buttonName="Create Contact"
                        fetchItems={fetchContacts}
                        createOrUpdateItem={createOrUpdateContact}
                        deleteItem={deleteContact}
                        searchItem={searchContact}
                        renderItemForm={(item, setItem, onSubmit) => <ContactForm contact={item} setContact={setItem} onSubmit={onSubmit}/>}
                        columns={contactColumns}
                        renderItemList={({ data, actions }) => <ContactList data={data} actions={actions}/>}
                        showSearch={true}
                        allowedRoles={contactAllowedRoles}
                        initialItem={initialContact}
                    />
                )
            }
        </>
    )
}