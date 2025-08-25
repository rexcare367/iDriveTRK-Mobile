import { StyleSheet, View } from "react-native";
import { useSelector } from "react-redux";
import BackgroundEffects from "../../components/BackgroundEffects";
import BottomTabBar from "../../components/BottomTabBar";
import Header from "../../components/Header";
import TimeSheetHomeScreen from "./home";
import ManagerApprovalScreen from "./manager-approval";

export default function TimeSheetScreen() {
  const { currentUser } = useSelector((state: any) => state.user);
  const { user } = useSelector((state: any) => state.auth);

  return (
    <View style={styles.container}>
      <BackgroundEffects />
      <Header user={user} />
      {currentUser.role === "MANAGER" ? (
        <ManagerApprovalScreen />
      ) : (
        <TimeSheetHomeScreen />
      )}
      <BottomTabBar activeTab={"TimeSheet"} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
});
