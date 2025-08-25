import { Stack } from "expo-router";

export default function AuthLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="splash" />
      <Stack.Screen name="sign-in" />
      <Stack.Screen name="sign-up" />
      <Stack.Screen name="setup-account" />
      <Stack.Screen name="otp-verification" />
      <Stack.Screen name="pin" />
    </Stack>
  );
}
