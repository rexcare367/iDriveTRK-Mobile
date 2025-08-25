import { Stack } from "expo-router";

export default function AppLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      {/* Post-Trip Forms */}
      <Stack.Screen name="post-trip-screen" />
      <Stack.Screen name="post-trip-driver-info" />
      <Stack.Screen name="post-trip-vehicle-info" />
      <Stack.Screen name="post-trip-photos" />
      <Stack.Screen name="post-trip-engine" />
      <Stack.Screen name="post-trip-fluids" />
      <Stack.Screen name="post-trip-wheels" />
      <Stack.Screen name="post-trip-rear-vehicle" />
      <Stack.Screen name="post-trip-cab" />
      <Stack.Screen name="post-trip-lights" />
      <Stack.Screen name="post-trip-checklist" />
      <Stack.Screen name="post-trip-safety" />
      <Stack.Screen name="post-trip-trailer" />
      <Stack.Screen name="post-trip-trailer-details" />
      <Stack.Screen name="post-trip-signature" />
    </Stack>
  );
}
