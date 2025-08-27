import { Stack } from "expo-router";

export default function AppLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      {/* PTO */}
      <Stack.Screen name="pto-dashboard" />
      <Stack.Screen name="pto-request-form" />
      <Stack.Screen name="pto-type-selection" />
      <Stack.Screen name="personal-leave-form" />
      <Stack.Screen name="sick-leave-form" />
    </Stack>
  );
}
