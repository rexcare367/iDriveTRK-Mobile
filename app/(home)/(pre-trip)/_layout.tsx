import { Stack } from "expo-router";

export default function AppLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      {/* Pre-Trip Forms */}
      <Stack.Screen name="pre-trip-screen" />
      <Stack.Screen name="pre-trip-driver-info" />
      <Stack.Screen name="pre-trip-vehicle-info" />
      <Stack.Screen name="pre-trip-photos" />
      <Stack.Screen name="pre-trip-engine" />
      <Stack.Screen name="pre-trip-fluids" />
      <Stack.Screen name="pre-trip-wheels" />
      <Stack.Screen name="pre-trip-rear-vehicle" />
      <Stack.Screen name="pre-trip-cab" />
      <Stack.Screen name="pre-trip-lights" />
      <Stack.Screen name="pre-trip-checklist" />
      <Stack.Screen name="pre-trip-safety" />
      <Stack.Screen name="pre-trip-trailer" />
      <Stack.Screen name="pre-trip-trailer-details" />
      <Stack.Screen name="pre-trip-signature" />
    </Stack>
  );
}
