import { useDispatch, useSelector } from "react-redux";
import { AuthState } from "@/models";
import { AppDispatch, RootState } from "../redux/store";
import { setAuth, clearAuth } from "@/redux/states/authSlice";

export const useAuth = () => {
  const dispatch = useDispatch<AppDispatch>();
  const auth = useSelector((state: RootState) => state.auth);

  const saveAuth = (user: AuthState | null) => {
    if (!user) {
      logout();
      return;
    }
    dispatch(setAuth(user));
    localStorage.setItem("id", user.id!.toString());
  };

  const logout = () => {
    dispatch(clearAuth());
    localStorage.removeItem("id");
  };

  const getId = (): number | null => {
    const storedId = localStorage.getItem("id");
    return storedId ? parseInt(storedId, 10) : null;
  };

  return {
    auth,
    saveAuth,
    logout,
    getId,
  };
};
