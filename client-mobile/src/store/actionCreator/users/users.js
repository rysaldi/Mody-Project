import AsyncStorage from "@react-native-async-storage/async-storage";
import { USER_LOGIN, USER_LOGOUT } from "../../actionTypes";

const baseUrl = "https://mody-server.herokuapp.com";
export const userLoginDispatch = (payload) => {
  return {
    type: USER_LOGIN,
    payload,
  };
};
const userLogoutDispatch = (payload) => {
  return {
    type: USER_LOGOUT,
    payload,
  };
};
const setAccessToken = async (token) => {
  try {
    await AsyncStorage.setItem("access_token", token);
  } catch (error) {}
};
export const userRegister = (registerUserForm) => {
  return () => {
    return fetch(`${baseUrl}/users/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(registerUserForm),
    })
      .then((response) => {
        if (!response.ok) {
          return response.json().then((message) => {
            throw message;
          });
        }
        return response.json();
      })
      .catch((error) => {
        throw error;
      });
  };
};

export const userLogin = (loginUserForm) => {
  return (dispatch) => {
    return fetch(`${baseUrl}/users/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(loginUserForm),
    })
      .then((response) => {
        if (!response.ok) {
          return response.json().then((message) => {
            throw message;
          });
        }
        return response.json();
      })
      .then((response) => {
        setAccessToken(response.access_token);
        dispatch(userLoginDispatch(true));
      })
      .catch((error) => {
        throw error;
      });
  };
};

export const userLogout = () => {
  return (dispatch) => {
    AsyncStorage.clear().then((_) => {
      dispatch(userLogoutDispatch(false));
    });
  };
};