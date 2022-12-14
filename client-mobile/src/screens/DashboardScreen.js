import {
  View,
  Image,
  Dimensions,
  Text,
  ScrollView,
  StyleSheet,
  FlatList,
} from "react-native";
import CardLatesHistory from "../components/CardLatesHistory";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import {
  userHistory,
  loadingUserHistoryDispatch,
} from "../store/actionCreator/user";
import LoadingScreen from "../components/LoadingScreen";
import { formatCurrency } from "react-native-format-currency";

export default function DashboardScreen() {
  const dispatch = useDispatch();
  const { userDetail, loadingUserHistory } = useSelector(
    (state) => state.userReducer
  );

  useEffect(() => {
    dispatch(userHistory())
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        dispatch(loadingUserHistoryDispatch(false));
      });
  }, []);

  const renderItemUserWallets = ({ item }) => {
    return (

      <View style={styles.mainCard}>
        <View style={styles.contentMainCard}>
          <View style={styles.frameMainLogo}>
            <Image
              style={styles.mainLogo}
              source={require("../../assets/icons/wallet_new.png")}
            />
          </View>
          <View>
            <Text style={styles.textCard}>{item.Wallet.name}</Text>
            <Text style={styles.textName}>role: {item.role}</Text>
          </View>
        </View>
        <View style={styles.amountDetail}>
          {item.Wallet.balance < 0 ? (
            <Text style={styles.minusNumber}>
              {
                formatCurrency({
                  amount: item.Wallet.balance,
                  code: "IDR",
                })[0]
              }
            </Text>
          ) : (
            <Text style={styles.plusNumber}>
              {
                formatCurrency({
                  amount: item.Wallet.balance,
                  code: "IDR",
                })[0]
              }
            </Text>
          )}
        </View>
      </View>

    );
  };

  return (
    <>
      {loadingUserHistory ? (
        <LoadingScreen />
      ) : (
        <>
          {/* Navbar */}
          <View style={styles.mainContainer}>
            <View style={styles.containerNavbar}>
              <Image
                style={styles.logo}
                source={require("../../assets/moody_pertama.png")}
              />
              <View style={styles.frameImgNav}>
                {userDetail.Profile ? (
                  <Image
                    style={styles.imgNav}
                    source={{ uri: userDetail.Profile.profilePicture }}
                  />
                ) : (
                  <LoadingScreen />
                )}
              </View>
            </View>

            {/* Header */}
            <View style={styles.containerHeader}>
              <View>
                <Text style={styles.textHeader}>Welcome to Your</Text>
                <View style={{ display: "flex", flexDirection: "row" }}>
                  <Text style={styles.textHeaderDash}>Dash</Text>
                  <Text style={styles.textHeaderBoard}>board</Text>
                </View>
              </View>
            </View>

            <View>
              <View style={{ paddingHorizontal: 20 }}>
                <Text style={styles.textHeader}>Your Wallets</Text>
              </View>
              {!userDetail.UserWallets.length ? (
                <View style={{ paddingHorizontal: 20 }}>
                  <View style={styles.walletEmpty}>
                    <Text style={styles.textHeaderEmpty}>
                      Start your journey with creating your first wallet!
                    </Text>
                  </View>
                </View>
              ) : (
                <View style={{ paddingTop: 15, height: Dimensions.get("window").height * 0.34, width: Dimensions.get("window").width }}>
                  <FlatList
                    data={userDetail.UserWallets}
                    renderItem={renderItemUserWallets}
                    keyExtractor={(item) => item.id}
                  />
                </View>
              )}

            </View>

            <View
              style={{
                flex: 2,
                paddingTop: 20,
                marginBottom: 10,
              }}
            >
              <Text style={styles.textHeaderTran}>
                Your transactions history
              </Text>
              {!userDetail.Transactions.length ? (
                <View style={{ paddingHorizontal: 20 }}>
                  <View style={styles.walletEmpty}>
                    <Text style={styles.textHeaderEmpty}>
                      No transaction data available
                    </Text>
                  </View>
                </View>
              ) : (
                <CardLatesHistory />
              )}
            </View>
          </View>
        </>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  textHeader: {
    fontWeight: "bold",
    fontSize: 16,
    color: "#424242",
    marginBottom: 5,
  },
  textHeaderTran: {
    fontWeight: "bold",
    fontSize: 16,
    color: "#424242",
    // marginBottom: 20,
    marginStart: 20,
  },
  frameImgNav: {
    width: 50,
    height: 50,
    backgroundColor: "#ddd",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 70,
    overflow: "hidden",
  },
  logo: {
    width: Dimensions.get("window").width * 0.2,
    height: Dimensions.get("window").height * 0.12,
  },
  imgNav: {
    width: 50,
    height: 50,
  },
  containerNavbar: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 10,
    alignItems: "center",
  },
  mainContainer: {
    flex: 1,
    marginTop: 10,
  },
  containerHeader: {
    flex: 0.7,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    alignItems: "center",
  },
  textHeaderDash: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#424242",
  },
  textHeaderBoard: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#2F6FFF",
  },
  frameHeaderIconPlus: {
    width: 25,
    height: 25,
    backgroundColor: "#ccf0bb",
    borderRadius: 50,
    marginBottom: 5,
    alignItems: "center",
    justifyContent: "center",
  },
  frameHeaderIconMinus: {
    width: 25,
    height: 25,
    backgroundColor: "#f5d0d0",
    borderRadius: 50,
    marginBottom: 5,
    alignItems: "center",
    justifyContent: "center",
  },
  iconHeader: {
    width: 18,
    height: 18,
  },
  containerContentIconHeader: {
    alignItems: "center",
    marginRight: 10,
  },
  mainCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    elevation: 3,
    width: Dimensions.get("window").width * 0.9,
    height: Dimensions.get("window").height * 0.1,
    marginBottom: 5,
    backgroundColor: "white",
    borderRadius: 10,
    marginLeft: 20
  },
  frameMainLogo: {
    width: 50,
    height: 50,
    marginRight: 15,
    overflow: "hidden",
    justifyContent: "center",
    marginLeft: 15,
  },
  mainLogo: {
    width: 30,
    height: 30,
  },
  contentMainCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  textCard: {
    fontSize: 18,
    color: "#424242",
    fontWeight: "400",
  },
  minusNumber: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 12,
    width: Dimensions.get("window").width * 0.3,
    padding: 5,
    borderRadius: 5,
    backgroundColor: "#a21a1a",
    textAlign: "center",
  },
  plusNumber: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 12,
    padding: 5,
    width: Dimensions.get("window").width * 0.3,
    borderRadius: 5,
    backgroundColor: "#388c12",
    textAlign: "center",
  },
  textName: {
    color: "#808080",
    fontSize: 12,
  },
  amountDetail: {
    marginRight: 15,
  },
  walletEmpty: {
    alignItems: "center",
    width: Dimensions.get("window").width * 0.9,
    height: Dimensions.get("window").height * 0.2,

    justifyContent: "center",
    backgroundColor: "rgba(255, 255, 255, 0.5)",
    borderRadius: 20,
    marginTop: 15,
  },
  textHeaderEmpty: {
    fontSize: 16,
    color: "#424242",
    marginBottom: 5,
  },
});
