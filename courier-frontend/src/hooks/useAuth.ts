import { useDispatch, useSelector } from "react-redux";

import { selectAuthTokens, selectUserDetails, logout as logoutAction, setTokens } from "@/redux/states/authSlice";
import { Token } from "@/types";
import { AppDispatch } from "@/redux/store";

export const useAuth = () => {
    const dispatch: AppDispatch = useDispatch();
    const tokens = useSelector(selectAuthTokens);
    const userDetails = useSelector(selectUserDetails);

    const saveTokens = (tokens: Token) => {
        dispatch(setTokens(tokens));
    }

    const logout = () => {
        dispatch(logoutAction());
    }

    return { tokens, userDetails, saveTokens, logout };
}