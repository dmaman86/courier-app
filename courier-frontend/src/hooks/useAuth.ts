import { useDispatch, useSelector } from "react-redux";

import { selectAuthTokens, selectUserDetails, logout as logoutAction, setTokens, setUser } from "@/redux/states/authSlice";
import { Client, Token, User } from "@/types";
import { AppDispatch } from "@/redux/store";

export const useAuth = () => {
    const dispatch: AppDispatch = useDispatch();
    const tokens = useSelector(selectAuthTokens);
    const userDetails = useSelector(selectUserDetails);

    const saveTokens = (tokens: Token) => {
        dispatch(setTokens(tokens));
    }

    const saveUser = (user: User | Client) => {
        dispatch(setUser(user));
    }

    const logout = () => {
        dispatch(logoutAction());
    }

    return { tokens, userDetails, saveTokens, saveUser, logout };
}