import { Stack } from "expo-router";

export default function AppLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      {/* Trips Management */}
      <Stack.Screen name="assigned-trips" />
      <Stack.Screen name="trip-complete-history" />
      <Stack.Screen name="trip-details-history" />
    </Stack>
  );
}
