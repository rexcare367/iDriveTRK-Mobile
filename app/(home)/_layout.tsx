import { Stack } from "expo-router";

export default function AppLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      {/* Home & Trip Management */}
      <Stack.Screen name="home" />
      <Stack.Screen name="trip-selection" />
      <Stack.Screen name="trip-details" />
      <Stack.Screen name="trip-stops" />
      <Stack.Screen name="scan-tag" />

      {/* Profile */}
      <Stack.Screen name="profile" />
    </Stack>
  );
}
