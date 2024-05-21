import { createContext, useEffect, useReducer } from "react";
import AuthReducer from "./AuthReducer";
import axios from "axios";
import { baseUrl } from "../utils";

const INITIAL_STATE = {
  user: JSON.parse(localStorage.getItem("user")) || null,
  isFetching: false,
  error: false,
};

export const AuthContext = createContext(INITIAL_STATE);

export const AuthContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(AuthReducer, INITIAL_STATE);

  useEffect(() => {
    localStorage.setItem("user", JSON.stringify(state.user));
  }, [state.user]);

  const logout = () => {
    dispatch({ type: "LOGOUT" });
    localStorage.removeItem("user");
  };
  useEffect(() => {
    const fetchUser = async () => {
      if (state.user?._id) {
        try {
          const res = await axios.get(baseUrl + `/api/users/${state.user._id}`);
          dispatch({ type: "LOGIN_SUCCESS", payload: res.data });
        } catch (err) {
          console.log(err);
        }
      }
    };
    fetchUser();
  }, [state.user?._id]);

  return (
    <AuthContext.Provider
      value={{
        user: state.user,
        isFetching: state.isFetching,
        error: state.error,
        dispatch,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
