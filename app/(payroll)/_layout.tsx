import { Stack } from "expo-router";

export default function AppLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      {/* Payroll Management */}
      <Stack.Screen name="payroll" />
      <Stack.Screen name="submission" />
      <Stack.Screen name="admin-payroll-dashboard" />
    </Stack>
  );
}
