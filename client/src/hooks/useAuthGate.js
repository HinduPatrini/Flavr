import { useSelector, useDispatch } from "react-redux";
import { setAuthModal } from "../store/uiSlice";

export const useAuthGate = () => {
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.auth);

  const checkAuth = () => {
    if (!token) {
      dispatch(setAuthModal(true));
      return false;
    }
    return true;
  };

  const gateAction = (callback) => {
    return (...args) => {
      if (checkAuth()) {
        if (callback) {
          callback(...args);
        }
      }
    };
  };

  return { isAuthenticated: !!token, checkAuth, gateAction };
};

export default useAuthGate;
