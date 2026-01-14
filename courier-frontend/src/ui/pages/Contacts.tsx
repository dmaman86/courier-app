import { resourceAdapter } from "@/adapters";
import { useAuth } from "@/hooks";
import { ContactBase, PageProps, ValueColumn } from "@/models";
import { serviceRequest } from "@/services";
import { urlPaths } from "@/utilities";
import { useState } from "react";
import {
  ContactForm,
  ContactSearchContent,
  ItemsContainer,
} from "@/ui/components";
import { ContactDetails } from "../components/details/ContactDetails";

export const Contacts = ({ allowedActions }: PageProps) => {
  const { auth } = useAuth();

  const defaultActions = { create: [], update: [], delete: [] };
  allowedActions = allowedActions || defaultActions;

  const getContacts = (page: number, size: number) =>
    serviceRequest.getItem(
      `${urlPaths.contact.base}?page=${page}&size=${size}`,
    );

  const createContact = (item: any) => {
    const contact = resourceAdapter.contactAdapter(item);
    // const user = userAdapter.userFormDtoToEntity(item);
    return serviceRequest.postItem(urlPaths.contact.base, contact);
  };

  const updateContact = (id: string | number, item: any) => {
    const contact = resourceAdapter.contactAdapter(item);
    return serviceRequest.putItem(`${urlPaths.contact.base}/${id}`, contact);
  };

  const deleteContact = (id: string | number) =>
    serviceRequest.deleteItem(`${urlPaths.contact.base}/${id}`);

  const searchContact = (query: string, page: number, size: number) =>
    serviceRequest.getItem(
      `${urlPaths.contact.search}?query=${query}&page=${page}&size=${size}`,
    );

  const searchContactByFilters = (filters: any, page: number, size: number) => {
    const contactFilter = resourceAdapter.contactAdvancedAdapter(filters);

    return serviceRequest.postItem(
      `${urlPaths.contact.search}/advanced?page=${page}&size=${size}`,
      contactFilter,
    );
  };

  const [contactColumns, setContactColumns] = useState<
    ValueColumn<ContactBase>[]
  >([
    {
      key: "fullname",
      label: "Full Name",
      sortable: true,
      sortedValue: (contact) => contact.fullName.toLowerCase(),
    },
    {
      key: "phoneNumber",
      label: "Phone Number",
      sortable: true,
      sortedValue: (contact) => contact.phoneNumber.toLowerCase(),
    },
    {
      key: "office",
      label: "Office",
      sortable: true,
      sortedValue: (contact) => contact.office.name.toLowerCase(),
    },
  ]);

  const mapContactInfo = (contact: ContactBase) => [
    { key: "fullname", content: `${contact.fullName}` },
    { key: "phoneNumber", content: `${contact.phoneNumber}` },
    { key: "office", content: `${contact.office.name}` },
  ];

  const formatMessage = (contact: ContactBase) => {
    return `Are you sure you want to delete: ${contact.fullName}?`;
  };

  return (
    <>
      <ItemsContainer<ContactBase>
        auth={auth}
        header={{
          title: "Contacts",
          placeholder: "Search Contacts",
          buttonName: "Create Contact",
        }}
        actions={{
          getItems: getContacts,
          createItem: createContact,
          updateItem: updateContact,
          deleteItem: deleteContact,
          searchItem: searchContact,
          searchItemsByFilters: searchContactByFilters,
        }}
        adapters={{
          itemAdapter: resourceAdapter.contactBaseAdapter,
          listAdapter: resourceAdapter.listAdapter,
        }}
        list={{
          columns: contactColumns,
          mapItemRow: mapContactInfo,
          itemForm: (id, onSubmit, onClose) => (
            <ContactForm id={id} onSubmit={onSubmit} onClose={onClose} />
          ),
        }}
        allowedActions={allowedActions}
        formatMessage={formatMessage}
        rowExpandable={(contact) => true}
        expandContent={(id) => <ContactDetails id={id} />}
        advancedSearchContent={(onChange, isOpen) => (
          <ContactSearchContent onChange={onChange} isOpen={isOpen} />
        )}
      />
    </>
  );
};
