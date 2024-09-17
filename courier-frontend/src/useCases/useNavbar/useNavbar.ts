
import { useEffect, useReducer } from "react";

import { User, Client } from "@/domain";
import { initialState, reducer } from "./reducer";
import { serviceRequest } from "@/services";
import { paths } from "@/helpers";

export const useNavbar = (userDetails: User | Client | null, logout: () => void, callEndPoint: any) => {
    const [state, dispatch] = useReducer(reducer, initialState);
  
    useEffect(() => {
      if (userDetails && state.isLoggingOut) {
        initiateLogout();
      }
    }, [state.isLoggingOut, userDetails]);
  
    const initiateLogout = async () => {
      const result = await callEndPoint(serviceRequest.postItem(paths.auth.logout));
      if (result.error) {
        console.error('Error logging out:', result.error);
        return;
      }
      dispatch({ type: 'CANCEL_LOGOUT' });
      logout();
    };
  
    return { state, dispatch, initiateLogout };
  };