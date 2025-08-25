import { Stack } from "expo-router";

export default function AppLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      {/* Time Sheet & Payroll */}
      <Stack.Screen name="timesheet" />
      <Stack.Screen name="home" />
      <Stack.Screen name="submit-timesheet" />
      <Stack.Screen name="details" />
      <Stack.Screen name="manager-approval" />
    </Stack>
  );
}
