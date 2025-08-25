import { StyleSheet, View } from "react-native";
import { useSelector } from "react-redux";
import BackgroundEffects from "../../components/BackgroundEffects";
import AdminPayrollDashboard from "./admin-payroll-dashboard";
import PayrollSubmissionScreen from "./submission";

export default function PayrollScreen() {
  const { currentUser } = useSelector((state: any) => state.user);
  return (
    <View style={styles.container}>
      <BackgroundEffects />
      {currentUser.role === "MANAGER" ? (
        <AdminPayrollDashboard />
      ) : (
        <PayrollSubmissionScreen />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
});
