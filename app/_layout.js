// Layout do Expo Router
// Define stack navigator do app

import { Stack } from "expo-router";

export default function Layout() {
  // Stack com header escondido
  return <Stack screenOptions={{ headerShown: false }} />;
}