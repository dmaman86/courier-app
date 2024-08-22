import { useDispatch, useSelector } from "react-redux";

import { selectUserDetails, logout as logoutAction, setUser } from "@/redux/states/authSlice";
import { Client, User } from "@/types";
import { AppDispatch } from "@/redux/store";
import { useEffect } from "react";

export const useAuth = () => {
    const dispatch: AppDispatch = useDispatch();
    const userDetails = useSelector(selectUserDetails);

    useEffect(() => {
        const storedUserDetails = localStorage.getItem("userDetails");
        if (storedUserDetails && !userDetails) {
            dispatch(setUser(JSON.parse(storedUserDetails)));
        }
    }, [dispatch, userDetails]);

    const saveUser = (user: User | Client | null) => {
        dispatch(setUser(user));
        if (user) {
            localStorage.setItem("userDetails", JSON.stringify(user));
        } else {
            localStorage.removeItem("userDetails");
        }
    }

    const logout = () => {
        dispatch(logoutAction());
        localStorage.removeItem("userDetails");
    }

    return { userDetails, saveUser, logout };
}