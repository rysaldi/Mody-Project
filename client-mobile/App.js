import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { StatusBar } from "expo-status-bar";
import { View, StyleSheet} from "react-native";
import DashboardScreen from "./src/screens/DashboardScreen";
import LoginScreen from "./src/screens/LoginScreen";
import LogoutScreen from "./src/screens/LogoutScreen";
import ProfileScreen from "./src/screens/ProfileScreen";


export default function App() {
  const Stack = createNativeStackNavigator();
  const Tab = createBottomTabNavigator();
  return (
    <NavigationContainer>
      <DashboardScreen />
      {/* <ProfileScreen/> */}
      {/* <LoginScreen/> */}
      {/* <LogoutScreen /> */}
        <StatusBar style="auto" />
    </NavigationContainer>
  );
}

