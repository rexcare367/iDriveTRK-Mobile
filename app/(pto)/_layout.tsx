import { Stack } from "expo-router";

export default function AppLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      {/* PTO & Leave Management */}
      <Stack.Screen name="pto" />
      <Stack.Screen name="sick-leave" />
      <Stack.Screen name="personal" />
      <Stack.Screen name="new-pto-request" />
      <Stack.Screen name="leave-type-selection" />
    </Stack>
  );
}
