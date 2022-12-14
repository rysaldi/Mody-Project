import { useNavigation } from "@react-navigation/native";
import {
	StyleSheet,
	View,
	Text,
	Image,
	Dimensions,
	Pressable,
} from "react-native";
import { userLogout } from "../store/actionCreator/user";
import { useDispatch, useSelector } from "react-redux";
import { userHistory } from "../store/actionCreator/user";
import LoadingScreen from "../components/LoadingScreen";
export default function LogoutScreen() {
	const navigation = useNavigation();
	const dispatch = useDispatch();
	const { userDetail } = useSelector((state) => {
		return state.userReducer;
	});

	const onTapLogout = () => {
		dispatch(userLogout());
	};
	return (
		<>
			{userDetail.Profile ? (
				<View style={styles.container}>
					<View style={styles.containerSettings}>
						<View style={styles.containerHeader}>
							<View style={styles.outlineFrame}>
								<View style={styles.frame}>
									<Image
										style={styles.profilePicture}
										source={{ uri: userDetail.Profile.profilePicture }}
									/>
								</View>
							</View>

							<Text style={styles.textHeader}>
								{userDetail.Profile.firstName} {userDetail.Profile.lastName}
							</Text>

							<Text style={styles.textEmail}>{userDetail.email}</Text>
							<View style={{ display: "flex", alignItems: "center" }}>
								<View style={styles.button}>
									<Text style={styles.textBotton} onPress={() => navigation.navigate("ProfileApp")}>
										Edit Profile
									</Text>
									<Image
										style={{ width: 12, height: 12 }}
										source={require("../../assets/icons/arrowRightWhite.png")}
									/>
								</View>
							</View>
						</View>
						<View
							style={{
								marginTop: 30,
							}}>
							<Text
								style={{
									backgroundColor: "#ddd",
									padding: 10,
									fontSize: 18,
									fontWeight: "bold",
									color: "#242525",
								}}>
								Preferences
							</Text>
							<Pressable onPress={onTapLogout}>
								<View
									style={{
										display: "flex",
										flexDirection: "row",
										marginTop: 10,
									}}>
									<View
										style={{
											flexDirection: "row",
										}}>
										<View style={styles.descriptionSymbol}>
											<Image
												style={{ width: 30, height: 30 }}
												source={require("../../assets/icons/logout.png")}
											/>
										</View>
									</View>
									<View style={styles.descriptionPreferences}>
										<View style={styles.descriptionName}>
											<Text style={{ fontSize: 16, fontWeight: "bold" }}>Sign out</Text>
										</View>
									</View>
									<View style={styles.descriptionArrow}>
										<Image
											style={{ width: 12, height: 12 }}
											source={require("../../assets/icons/arrowRight.png")}
										/>
									</View>
								</View>
							</Pressable>
						</View>
					</View>
				</View>
			) : (
				<LoadingScreen />
			)}
		</>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#fff",
	},
	containerSettings: {
		width: Dimensions.get("window").width,
		height: Dimensions.get("window").height,
		padding: 30,
		marginTop: 35,
	},
	containerHeader: {
		alignItems: "center",
		justifyContent: "center",
	},
	profilePicture: {
		width: 120,
		height: 120,
	},
	outlineFrame: {
		backgroundColor: "#d9d9d9",
		padding: 10,
		justifyContent: "center",
		alignItems: "center",
		width: 130,
		height: 130,
		borderRadius: 70,
		elevation: 5,
	},
	frame: {
		backgroundColor: "white",
		padding: 10,
		justifyContent: "center",
		alignItems: "center",
		width: 120,
		height: 120,
		borderRadius: 70,
		overflow: "hidden",
	},
	textHeader: {
		fontWeight: "700",
		fontSize: 25,
		color: "#242525",
	},
	textEmail: {
		fontWeight: "700",
		fontSize: 18,
		color: "#808080",
	},
	button: {
		display: "flex",
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		backgroundColor: "#2F6FFF",
		paddingHorizontal: 15,
		paddingVertical: 7,
		width: Dimensions.get("window").width * 0.4,
		textAlign: "center",
		borderRadius: 7,
		marginTop: 10,
	},
	textBotton: {
		fontSize: 15,
		color: "white",
	},
	descriptionPreferences: {
		width: Dimensions.get("window").width * 0.74,
		height: Dimensions.get("window").height * 0.1,
		flexDirection: "column",
		paddingLeft: 10,
	},
	descriptionSymbol: {
		width: Dimensions.get("window").width * 0.08,
		height: Dimensions.get("window").height * 0.05,
		flexDirection: "row",
		alignItems: "center",
	},
	descriptionArrow: {
		width: Dimensions.get("window").width * 0.035,
		height: Dimensions.get("window").height * 0.05,
		justifyContent: "flex-end",
		flexDirection: "row",
		alignItems: "center",
	},
	descriptionName: {
		height: Dimensions.get("window").height * 0.05,
		flexDirection: "row",
		alignItems: "center",
	},
});
