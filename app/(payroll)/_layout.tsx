import { Stack } from "expo-router";

export default function AppLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      {/* Payroll */}
      <Stack.Screen name="payroll-dashboard" />
      <Stack.Screen name="employee-payroll-submission" />
      <Stack.Screen name="manager-payroll-approval" />
    </Stack>
  );
}
