import { Box, TablePagination } from "@mui/material";
import { useEffect, useState } from "react";

import { resourceAdapter } from "@/adapters";
import { useFetch, useList } from "@/hooks";
import { Branch } from "@/models";
import { serviceRequest } from "@/services";
import { urlPaths } from "@/utilities";
import { ItemsTable } from "../itemsContainer";

export const ContactDetails = ({ id }: { id: string | number }) => {
  const { items, setAllItems } = useList<Branch>([]);
  const [pagination, setPagination] = useState({
    page: 0,
    size: 5,
    totalItems: 0,
  });

  const { loading, callEndPoint } = useFetch();

  const fetchBranches = async () => {
    const response = await callEndPoint(
      serviceRequest.getItem(
        `${urlPaths.branch.base}/contact/${id}/paged?page=${pagination.page}&size=${pagination.size}`,
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
  }, [pagination.page, pagination.size]);

  return (
    <Box sx={{ mb: 3 }}>
      <h5>Branches</h5>
      {!loading && items.length > 0 && (
        <ItemsTable<Branch>
          items={items}
          columns={[
            { key: "city", label: "City" },
            { key: "address", label: "Address" },
            { key: "office", label: "Office" },
          ]}
          mapItemRow={(branch) => [
            { key: "city", content: branch.city },
            { key: "address", content: branch.address },
            { key: "office", content: branch.office.name },
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
