import { CircularProgress } from "@mui/material";
import { useState, useEffect } from "react";

import { userAdapter } from "@/adapters";
import { useFetch } from "@/hooks";
import { BranchBase, Client } from "@/models";
import { serviceRequest } from "@/services";
import { urlPaths } from "@/utilities";
import { ItemsTable } from "../itemsContainer";

export const ClientDetails = ({ id }: { id: string | number }) => {
  const { loading, callEndPoint } = useFetch();

  const [client, setClient] = useState<Client | null>(null);

  useEffect(() => {
    if (!client) {
      const fetchClient = async () => {
        const response = await callEndPoint(
          serviceRequest.getItem(`${urlPaths.user.base}/${id}`),
          userAdapter.clientAdapter,
        );
        if (!response.error && response.data) {
          setClient(response.data);
        }
      };
      fetchClient();
    }
  }, [id, client]);

  if (loading || !client) {
    return (
      <div style={{ padding: "1rem", textAlign: "center" }}>
        <CircularProgress size={24} />
      </div>
    );
  }

  return (
    <>
      <ItemsTable<BranchBase>
        items={client.branches}
        columns={[
          { key: "city", label: "City" },
          { key: "address", label: "Address" },
          { key: "office", label: "Office" },
        ]}
        mapItemRow={(branch) => [
          { key: "city", content: branch.city },
          { key: "address", content: branch.address },
          { key: "office", content: client.office.name },
        ]}
        size="small"
      />
    </>
  );
};
