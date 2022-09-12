import {
  SUCCESS_FETCH_WALLETS,
  SUCCESS_FETCH_DETAIL,
  SUCCESS_DELETE_WALLET,
  LOADING_FETCH_WALLETS,
  LOADING_FETCH_DETAIL,

} from "../../actionTypes";
import AsyncStorage from "@react-native-async-storage/async-storage";

const baseUrl = "https://mody-server.herokuapp.com/";
// const baseUrl = "http://localhost:3000/";



//-----------------------getAccessToken--------------------------
const getAccessToken = async () => {
  try {
    const accessToken = await AsyncStorage.getItem("access_token");
    return accessToken

  } catch (error) {}
};
//-----------------------getAccessToken--------------------------

//-----------------------FETCHALLWALLETS--------------------------
export const successFetchAllWallet = (payload) => {
  return {
    type: SUCCESS_FETCH_WALLETS,
    payload,
  };
};
export const loadingFetchAllWallet = (payload) => {
  return {
    type: LOADING_FETCH_WALLETS,
    payload,
  };
};
export const fetchWallets = () => {
  return async (dispatch) => {
    const accessToken = await getAccessToken()
    return fetch(`${baseUrl}wallets`, {
      method: "GET",
      headers: {
        access_token:
          accessToken
      },
    })
      .then((result) => {
        if (!result.ok) {
          throw new Error("fetching wallets failed");
        }
        return result.json();
      })
      .then((data) => {
        dispatch(successFetchAllWallet(data));
      })
      .catch(err=>{
        throw err
      })
      .finally(() => {
        dispatch(loadingFetchAllWallet(false));
      });
  };
};

//-----------------------FETCHALLWALLETS--------------------------------

//-----------------------FETCHWALLETDETAIL-------------------------------
export const successFetchDetailWallet = (payload) => {
  return {
    type: SUCCESS_FETCH_DETAIL,
    payload,
  };
};
export const loadingFetchDetailWallet = (payload) => {
  return {
    type: LOADING_FETCH_DETAIL,
    payload,
  };
};
export const fetchDetail = (id) => {
  return async (dispatch) => {
    const accessToken = await getAccessToken()
    return fetch(`${baseUrl}wallets/${id}`, {
      method: "GET",
      headers: {
        access_token:
          accessToken,
      },
    })
      .then((result) => {
        if (!result.ok) {
          throw new Error("fetching wallet detail failed");
        }
        return result.json();
      })
      .then((data) => {
        dispatch(successFetchDetailWallet(data));
      })
      .finally(() => {
        dispatch(loadingFetchDetailWallet(false));
      });
  };
};
//-----------------------FETCHWALLETDETAIL-------------------------------

//-----------------------POSTWALLET---------------------------------------
export const addNewWallet = (payload) => {
  return async (dispatch) => {
    const accessToken = await getAccessToken()
    return fetch(`${baseUrl}wallets/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        access_token:
          accessToken,
      },
      body: JSON.stringify(payload),
    }).then((result) => {
      if (!result.ok) {
        return result.json().then((message) => {
          throw message;
        });
      }
      return result
        .json()
        .then((data) => {
          dispatch(fetchWallets())
        })
        .catch((error) => {
          throw error;
        });
    });
  };
};

//-----------------------POSTWALLET---------------------------------------


//-----------------------DELETEWALLET---------------------------------------
export const successDeleteWallet = (payload) => {
    return {
      type: SUCCESS_DELETE_WALLET,
      payload,
    };
  };

export const deleteWallet = (walletId) => {
    return async (dispatch) => {
      const accessToken = await getAccessToken()
      fetch(`${baseUrl}wallets/${walletId}`, {
        method: "delete",
        headers: {
          "Content-Type": "application/json",
          access_token: accessToken
        },
      })
        .then((result) => {
          if (!result.ok) {
            throw new Error("error deleting wallet");
          }
          return result.json();
        })
        .then(() => dispatch(successDeleteWallet(walletId)))
        .then(()=>dispatch(fetchWallets()))
        .catch((err) => {
          throw err
        });
    };
  };
//-----------------------DELETEWALLET---------------------------------------