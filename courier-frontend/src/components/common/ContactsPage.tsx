import { paths } from "../../helpers"
import { serviceRequest } from "../../services"
import { Contact, PageResponse, ValueColumn } from "../../types"
import { ContactForm } from "../modal";
import { ContactList } from "../listTables";
import { ItemsPage } from "../shared";


export const ContactsPage = () => {

    const fetchContacts = (page: number, size: number) => serviceRequest.getItem<PageResponse<Contact[]>>(`${paths.courier.contacts}?page=${page}&size=${size}`);

    const createOrUpdateContact = (contact: Contact) => contact.id ? serviceRequest.putItem<Contact, Contact>(paths.courier.contacts, contact) :
                                                        serviceRequest.postItem<Contact, Contact>(paths.courier.contacts, contact);

    const deleteContact = (contactId: number) => serviceRequest.deleteItem<string>(`${paths.courier.contacts}id/${contactId}`);

    const searchContact = (query: string, page: number, size: number) => serviceRequest.getItem<PageResponse<Contact[]>>(`${paths.courier.contacts}search?query=${query}&page=${page}&size=${size}`);

    const contactColumns: ValueColumn[] = [
        { key: 'fullname', label: 'Fullname' },
        { key: 'contactInfo', label: 'Contact Information' },
        { key: 'name', label: 'Office Name' },
        { key: 'branches', label: 'Branches' }
    ]

    return(
        <>
            <ItemsPage<Contact>
                title="Contacts"
                placeholder="Search contact..."
                buttonName="Create Contact"
                fetchItems={fetchContacts}
                createOrUpdateItem={createOrUpdateContact}
                deleteItem={deleteContact}
                searchItem={searchContact}
                renderItemForm={(contactId, onSubmit) => <ContactForm contactId={contactId} onSubmit={onSubmit}/>}
                columns={contactColumns}
                renderItemList={({ data, actions }) => <ContactList data={data} actions={actions}/>}
                showSearch={true}
            />
        </>
    )
}