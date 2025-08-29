import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSelector } from "react-redux";
import BackgroundEffects from "../../components/BackgroundEffects";
import BottomTabBar from "../../components/BottomTabBar";
import Header from "../../components/Header";
import TimeSheetHomeScreen from "./employee-timesheet-view";
import ManagerApprovalScreen from "./manager-timesheet-approval";

export default function TimeSheetScreen() {
  const { currentUser } = useSelector((state: any) => state.user);

  return (
    <SafeAreaView style={styles.container}>
      <BackgroundEffects />
      <Header />
      {currentUser.role === "MANAGER" ? (
        <ManagerApprovalScreen />
      ) : (
        <TimeSheetHomeScreen />
      )}
      <BottomTabBar activeTab={"TimeSheet"} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
});
