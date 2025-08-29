import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSelector } from "react-redux";
import BackgroundEffects from "../../components/BackgroundEffects";
import PayrollSubmissionScreen from "./employee-payroll-submission";
import AdminPayrollDashboard from "./manager-payroll-approval";

export default function PayrollScreen() {
  const { currentUser } = useSelector((state: any) => state.user);
  return (
    <SafeAreaView style={styles.container}>
      <BackgroundEffects />
      {currentUser.role === "MANAGER" ? (
        <AdminPayrollDashboard />
      ) : (
        <PayrollSubmissionScreen />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
});
