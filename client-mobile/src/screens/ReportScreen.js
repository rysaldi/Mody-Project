import {
  StyleSheet,
  View,
  Text,
  FlatList,
  Dimensions,
  ScrollView,
  Image,
  Pressable,
  Alert,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import React, { useState, useEffect } from "react";
import { fetchDetail } from "../store/actionCreator/wallet";
import LoadingScreen from "../components/LoadingScreen";
import { deleteTransaction } from "../store/actionCreator/transaction";
import { VictoryPie } from "victory-native";
import DateTimePicker from "@react-native-community/datetimepicker";

export default function ReportScreen({ route }) {
  const { id } = route.params;
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const { detailWallet } = useSelector((state) => {
    return state.walletReducer;
  });

  const setTotalIncome = (transactions) => {
    if (!transactions || transactions.length === 0) {
      return 0;
    }
    let totalIncome = 0;
    transactions.forEach((transaction) => {
      if (transaction.Category.type === "Income") {
        totalIncome = totalIncome + Number(transaction.amount);
      }
    });
    return totalIncome;
  };

  const setTotalExpense = (transactions) => {
    if (!transactions || transactions.length === 0) {
      return 0;
    }
    let totalExpense = 0;
    transactions.forEach((transaction) => {
      if (transaction.Category.type === "Expense") {
        totalExpense = totalExpense + Number(transaction.amount);
      }
    });
    return totalExpense;
  };

  const percentageIncome = (amount) => {
    return (
      (setTotalIncome(amount) /
        (setTotalIncome(amount) + setTotalExpense(amount))) *
      100
    );
  };

  const errorAlert = (msg) => {
    return Alert.alert("", `${msg}`, [{ text: "OK" }]);
  };

  const percentageExpenses = (amount) => {
    return (
      (setTotalExpense(amount) /
        (setTotalIncome(amount) + setTotalExpense(amount))) *
      100
    );
  };

  const wantedGraphicData = (transaction) => {
    return [
      {
        x: "Expense",
        y: percentageExpenses(transaction),
      },
      {
        x: "Income",
        y: percentageIncome(transaction),
      },
    ];
  };

  const hapusTransaction = (transactionId) => {
    dispatch(deleteTransaction(transactionId))
      .then(() => dispatch(fetchDetail(id)))
      .catch((err) => errorAlert("You have no permission"));
  };

  const setCategoryName = (transaction) => {
    let obj = {};
    const newArr = [];
    const categoryName = transaction.map((el) => {
      return { name: el.Category.name, amount: el.amount };
    });
    categoryName.forEach((el) => {
      if (!obj[el.name]) {
        obj[el.name] = el.amount;
      } else {
        obj[el.name] = obj[el.name] + el.amount;
      }
    });
    for (const key in obj) {
      newArr.push({ name: key, amount: obj[key] });
    }
    const colorOption = [
      "#FFE9A0",
      "#367E18",
      "#F57328",
      "#CC3636",
      "#CDF0EA",
      "#25316D",
      "#5F6F94",
      "#97D2EC",
      "#FEF5AC",
      "#FDEEDC",
      "#FFD8A9",
      "#F1A661",
      "#E38B29",
      "#76BA99",
      "#876445",
      "#5BB318",
      "#7DCE13",
      "#EAE509",
    ];
    for (let i = 0; i < newArr.length; i++) {
      newArr[i].color = colorOption[i];
    }
    return newArr;
  };

  const sameColorCategory = (categories) => {
    const color = [];
    categories.forEach((el) => {
      color.push(el.color);
    });
    return color;
  };

  const renderListWalletWithColor = ({ item }) => {
    return (
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          marginRight: 25,
        }}
      >
        <View
          style={{
            width: 20,
            height: 20,
            backgroundColor: item.color,
          }}
        />
        <Text> {item.name}</Text>
      </View>
    );
  };

  const wantedGraphicDataByCategory = (categoryName) => {
    const wantedGraphicDataByCategories = categoryName.map((el) => {
      return {
        x: " ",
        y:
          (el.amount /
            (setTotalIncome(detailWallet.Transactions) +
              setTotalExpense(detailWallet.Transactions))) *
          100,
      };
    });
    return wantedGraphicDataByCategories;
  };

  const renderUserWallets = ({ item }) => {
    return (
      <View style={styles.walletCard}>
        <View style={styles.cardDetail}>
          <Text style={styles.roleText}>{item.role}</Text>
          <Text>{item.User.email}</Text>
        </View>
      </View>
    );
  };

  const renderItem = ({ item }) => {
    return (
      <View style={styles.walletCard}>
        <View>
          <View style={styles.cardDetail}>
            <Text style={styles.incomeName}>Type</Text>
            <>
              {item.Category.type === "Income" ? (
                <Text style={styles.incomeDetailsIncome}>
                  {item.Category.type}
                </Text>
              ) : (
                <Text style={styles.incomeDetailsExpense}>
                  {item.Category.type}
                </Text>
              )}
            </>
          </View>
          <View style={styles.cardDetail}>
            <Text style={styles.incomeName}>Name</Text>
            <Text style={styles.incomeDetails}>{item.name}</Text>
          </View>
          <View style={styles.cardDetail}>
            <Text style={styles.incomeName}>Amount</Text>
            <Text style={styles.incomeDetails}>{item.amount}</Text>
          </View>
          <View style={styles.cardDetail}>
            <Text style={styles.incomeName}>Category</Text>
            <Text style={styles.incomeDetails}>{item.Category.name}</Text>
          </View>
          <View style={styles.cardDetail}>
            <Text style={styles.incomeName}>Date</Text>
            <Text style={styles.incomeDetails}>
              {new Date(item.date).toLocaleString()}
            </Text>
          </View>
        </View>
        <View style={styles.trashPosition}>
          <Pressable
            onPress={() => {
              hapusTransaction(item.id);
            }}
          >
            <Image
              source={require("../../assets/icons/red_trash.png")}
              style={styles.buttonDelete}
            />
          </Pressable>
        </View>
      </View>
    );
  };

  useEffect(() => {
    dispatch(fetchDetail(id)).finally(() => {
      setLoading(false);
    });
  }, []);

  return (
    <View style={styles.container}>
      {loading && <LoadingScreen />}
      {!loading && (
        <ScrollView style={styles.scrollView}>
          {detailWallet.Transactions.length === 0 ? (
            <View style={styles.boxEmpty}>
              <Text style={styles.emptyValue}>
                Upss... seems like you haven't create an transaction
              </Text>
            </View>
          ) : (
            <>
              <View style={styles.pieChart}>
                <Text style={styles.walletName}>{detailWallet.name}</Text>
                <VictoryPie
                  colorScale={["#cc5656", "#7eb764"]}
                  animate={{ easing: "exp", duration: 3000 }}
                  data={wantedGraphicData(detailWallet.Transactions)}
                  innerRadius={20}
                  width={400}
                  height={300}
                  style={{
                    data: {
                      stroke: "#fff",
                      strokeWidth: 0.5,
                    },
                  }}
                />

                <View style={styles.total}>
                  <View style={styles.income}>
                    <Text style={styles.incomeText}>Income</Text>
                    <Text style={styles.amountIncome}>
                      Rp. {setTotalIncome(detailWallet.Transactions)}
                    </Text>
                  </View>
                  <View style={styles.outcome}>
                    <Text style={styles.incomeText}>Expenses</Text>
                    <Text style={styles.amountOutcome}>
                      Rp. {setTotalExpense(detailWallet.Transactions)}
                    </Text>
                  </View>
                </View>
              </View>

              <View style={styles.pieChartbyCategory}>
                <VictoryPie
                  colorScale={sameColorCategory(
                    setCategoryName(detailWallet.Transactions)
                  )}
                  animate={{ easing: "exp", duration: 3000 }}
                  data={wantedGraphicDataByCategory(
                    setCategoryName(detailWallet.Transactions)
                  )}
                  innerRadius={20}
                  width={540}
                  height={300}
                  style={{
                    data: {
                      stroke: "#fff",
                      strokeWidth: 0.5,
                    },
                  }}
                />
              </View>
            </>
          )}
          <View style={styles.categoryList}>
            <FlatList
              data={setCategoryName(detailWallet.Transactions)}
              renderItem={renderListWalletWithColor}
              keyExtractor={(index) => index}
              horizontal={true}
              persistentScrollbar={true}
              style={{ height: 30 }}
            />
          </View>
          <View style={styles.walletList}>
            <View style={styles.collaborator}>
              <Text style={styles.textCollaborator}>Collaborator</Text>
              <FlatList
                data={detailWallet.UserWallets}
                renderItem={renderUserWallets}
                keyExtractor={(el) => el.id}
              />
            </View>

            <View style={styles.transaction}>
              <Text style={styles.textTransaction}>Transaction Detail</Text>
              <FlatList
                data={detailWallet.Transactions}
                renderItem={renderItem}
                keyExtractor={(el) => el.id}
              />
            </View>
          </View>
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",

    height: Dimensions.get("window").height,
    marginTop: 10,
  },
  walletCard: {
    marginTop: 15,
    marginBottom: 5,
    marginHorizontal: 5,
    backgroundColor: "white",
    paddingVertical: 20,
    borderRadius: 10,
    flexDirection: "row",
    paddingLeft: 15,
    paddingRight: 15,
    width: Dimensions.get("window").width * 0.8,
    position: "relative",
    elevation: 5,
  },
  walletList: {
    width: Dimensions.get("window").width,
    paddingTop: 35,
  },
  scrollView: {
    width: Dimensions.get("window").width,
  },
  transaction: {
    alignItems: "center",
    justifyContent: "center",
    width: Dimensions.get("window").width,
    position: "relative",
  },
  pieChart: {
    alignItems: "center",
    justifyContent: "center",
  },
  walletName: {
    fontWeight: "bold",
    fontSize: 22,
  },
  total: {
    width: Dimensions.get("window").width * 0.8,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingLeft: 25,
    paddingRight: 25,
    height: Dimensions.get("window").height * 0.1,
    backgroundColor: "white",
    alignItems: "center",
    borderRadius: 10,
    elevation: 5,
  },
  incomeText: {
    fontWeight: "bold",
    fontSize: 18,
  },
  amountOutcome: {
    color: "#cc5656",
    fontWeight: "bold",
    fontSize: 14,
  },
  amountIncome: {
    color: "#7eb764",
    fontWeight: "bold",
    fontSize: 14,
  },
  pieChartbyCategory: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 50,
    elevation: 10,
  },
  collaborator: {
    marginBottom: 25,
    alignItems: "center",
    justifyContent: "center",
    width: Dimensions.get("window").width,
  },

  emptyValue: {
    fontSize: 15,
  },
  boxEmpty: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height * 0.1,
    alignItems: "center",
    justifyContent: "center",
  },
  cardDetail: {
    flexDirection: "row",
    marginBottom: 5,
  },
  incomeDetails: {
    marginLeft: 15,
    fontWeight: "bold",
    width: Dimensions.get("window").width * 0.42,
  },
  incomeName: {
    width: Dimensions.get("window").width * 0.2,
  },

  incomeDetailsExpense: {
    color: "#cc5656",
    fontWeight: "bold",
    fontSize: 14,
    marginLeft: 15,
  },
  incomeDetailsIncome: {
    color: "#7eb764",
    fontWeight: "bold",
    fontSize: 14,
    marginLeft: 15,
  },
  buttonDelete: {
    width: Dimensions.get("window").width * 0.06,
    height: Dimensions.get("window").height * 0.035,
  },
  trashPosition: {
    position: "absolute",
    right: 10,
    top: 65,
    alignItems: "center",
    justifyContent: "center",
    // height: Dimensions.get("window").height * 0.1,
  },
  textCollaborator: {
    fontWeight: "bold",
    fontSize: 18,
  },
  textTransaction: {
    fontWeight: "bold",
    fontSize: 18,
  },

  roleText: {
    fontWeight: "bold",
    width: Dimensions.get("window").width * 0.2,
  },
  emailText: {},
  categoryList: {
    marginBottom: 30,
    paddingLeft: 10,
    paddingRight: 10,
    width: Dimensions.get("window").width,
  },
});
