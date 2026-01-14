import { Box, TablePagination } from "@mui/material";
import { useEffect, useState } from "react";

import { resourceAdapter } from "@/adapters";
import { useFetch, useList } from "@/hooks";
import { BranchBase, ContactBase } from "@/models";
import { serviceRequest } from "@/services";
import { urlPaths } from "@/utilities";
import { ItemsTable } from "../itemsContainer";

export const OfficeDetails = ({ id }: { id: string | number }) => {
  return (
    <Box>
      <BranchesSection officeId={id} />
      <ContactsSection officeId={id} />
    </Box>
  );
};

const BranchesSection = ({ officeId }: { officeId: string | number }) => {
  const { items, setAllItems } = useList<BranchBase>([]);
  const [pagination, setPagination] = useState({
    page: 0,
    size: 5,
    totalItems: 0,
  });

  const { loading, callEndPoint } = useFetch();

  const fetchBranches = async () => {
    const response = await callEndPoint(
      serviceRequest.getItem(
        `${urlPaths.branch.getByOffice}/${officeId}/paged?page=${pagination.page}&size=${pagination.size}`,
      ),
      (data) =>
        resourceAdapter.listAdapter(data, resourceAdapter.branchAdapter),
    );
    if (!response.error && response.data) {
      setAllItems(response.data.content);
      setPagination((prev) => ({
        ...prev,
        totalItems: response.data.totalElements,
      }));
    }
  };

  useEffect(() => {
    fetchBranches();
  }, [pagination.page, pagination.size, officeId]);

  return (
    <Box sx={{ mb: 3 }}>
      <h5>Branches</h5>
      {!loading && items.length > 0 && (
        <ItemsTable<BranchBase>
          items={items}
          columns={[
            { key: "city", label: "City" },
            { key: "address", label: "Address" },
          ]}
          mapItemRow={(branch) => [
            { key: "city", content: branch.city },
            { key: "address", content: branch.address },
          ]}
          size="small"
        />
      )}

      <TablePagination
        rowsPerPageOptions={[5, 10]}
        component="div"
        count={pagination.totalItems}
        rowsPerPage={pagination.size}
        page={pagination.page}
        onPageChange={(_, newPage) =>
          setPagination({ ...pagination, page: newPage })
        }
        onRowsPerPageChange={(e) =>
          setPagination({
            page: 0,
            size: parseInt(e.target.value, 10),
            totalItems: pagination.totalItems,
          })
        }
      />
    </Box>
  );
};

const ContactsSection = ({ officeId }: { officeId: string | number }) => {
  const { items, setAllItems } = useList<ContactBase>([]);
  const [pagination, setPagination] = useState({
    page: 0,
    size: 5,
    totalItems: 0,
  });

  const { loading, callEndPoint } = useFetch();

  const fetchContacts = async () => {
    const response = await callEndPoint(
      serviceRequest.getItem(
        `${urlPaths.contact.getByOffice}/${officeId}/paged?page=${pagination.page}&size=${pagination.size}`,
      ),
      (data) =>
        resourceAdapter.listAdapter(data, resourceAdapter.contactBaseAdapter),
    );
    if (!response.error && response.data) {
      setAllItems(response.data.content);
      setPagination((prev) => ({
        ...prev,
        totalItems: response.data.totalElements,
      }));
    }
  };

  useEffect(() => {
    fetchContacts();
  }, [pagination.page, pagination.size, officeId]);

  return (
    <Box sx={{ mb: 3 }}>
      <h5>Contacts</h5>
      {!loading && items.length > 0 && (
        <ItemsTable<ContactBase>
          items={items}
          columns={[
            { key: "fullName", label: "Full Name" },
            { key: "phoneNumber", label: "Phone Number" },
            { key: "office", label: "Office" },
          ]}
          mapItemRow={(contact) => [
            { key: "fullName", content: contact.fullName },
            { key: "phoneNumber", content: contact.phoneNumber },
            { key: "office", content: contact.office.name },
          ]}
          size="small"
        />
      )}

      <TablePagination
        rowsPerPageOptions={[5, 10]}
        component="div"
        count={pagination.totalItems}
        rowsPerPage={pagination.size}
        page={pagination.page}
        onPageChange={(_, newPage) =>
          setPagination({ ...pagination, page: newPage })
        }
        onRowsPerPageChange={(e) =>
          setPagination({
            page: 0,
            size: parseInt(e.target.value, 10),
            totalItems: pagination.totalItems,
          })
        }
      />
    </Box>
  );
};
