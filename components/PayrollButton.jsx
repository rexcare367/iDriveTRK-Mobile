import { TouchableOpacity, Text, StyleSheet } from "react-native";
import Icon from "react-native-vector-icons/Feather";

const PayrollButton = ({ onPress, style }) => {
  return (
    <TouchableOpacity style={[styles.payrollButton, style]} onPress={onPress}>
      <Icon name="dollar-sign" size={16} color="#fff" />
      <Text style={styles.payrollButtonText}>Submit Payroll</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  payrollButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#4CAF50",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    gap: 8,
    marginTop: 16
  },
  payrollButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff"
  }
});

export default PayrollButton;
