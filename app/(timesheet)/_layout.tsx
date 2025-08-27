import { Stack } from "expo-router";

export default function AppLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      {/* Time Sheet & Payroll */}
      <Stack.Screen name="timesheet-dashboard" />
      <Stack.Screen name="employee-timesheet-view" />
      <Stack.Screen name="timesheet-submission-form" />
      <Stack.Screen name="timesheet-details-view" />
      <Stack.Screen name="manager-timesheet-approval" />
    </Stack>
  );
}
