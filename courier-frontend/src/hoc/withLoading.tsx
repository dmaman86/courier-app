import { ComponentType, useEffect } from "react";
import { Box, CircularProgress } from "@mui/material";

import { useAuth } from "@/hooks";
import { useFetch } from "@/hooks";
import { serviceRequest } from "@/services";
import { userAdapter } from "@/adapters";

const withLoading = <P extends object>(WrappedComponent: ComponentType<P>) => {
  return (props: P) => {
    const { auth, saveAuth, getId } = useAuth();
    const { loading, callEndPoint } = useFetch();

    useEffect(() => {
      const fetchDataUser = async (id: number) => {
        const res = await callEndPoint(
          serviceRequest.getItem(`/user/${id}`),
          userAdapter.authStateAdapter,
        );

        if (!res.error && res.data) {
          console.log("Data fetched: ", res.data);
          saveAuth(res.data);
        } else {
          console.error("Error: ", res.error);
        }
      };

      const storedId = getId();
      if (!auth.id && storedId) {
        fetchDataUser(storedId);
      }
    }, [auth.id, getId, saveAuth]);

    if (loading) {
      return (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          height="100vh"
        >
          <CircularProgress disableShrink />
        </Box>
      );
    }

    return <WrappedComponent {...props} />;
  };
};

export default withLoading;
