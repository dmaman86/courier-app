import { useDispatch, useSelector } from "react-redux";

import { selectUserDetails, selectIsLoading, logout as logoutAction, setUser, setLoading } from "@/redux/states/authSlice";
import { Client, User } from "@/domain";
import { AppDispatch } from "@/redux/store";
import { useEffect } from "react";

export const useAuth = () => {
    const dispatch: AppDispatch = useDispatch();
    const userDetails = useSelector(selectUserDetails);
    const isLoading = useSelector(selectIsLoading);

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

    const updateIsLoading = (loading: boolean) => {
        dispatch(setLoading(loading));
    }

    const logout = () => {
        dispatch(logoutAction());
        localStorage.removeItem("userDetails");
    }

    return { userDetails, saveUser, logout, updateIsLoading, isLoading };
}