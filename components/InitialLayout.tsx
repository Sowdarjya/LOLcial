import { useAuth } from "@clerk/clerk-expo";
import { Stack, useRouter, useSegments } from "expo-router";
import { useEffect } from "react";

export default function InitialLayout() {
  const { isLoaded, isSignedIn } = useAuth();

  const segements = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (!isLoaded) return;

    const isOnAuthRoute = segements[0] === "(auth)";

    if (!isSignedIn && !isOnAuthRoute) router.replace("/(auth)/login");
    else if (isSignedIn && isOnAuthRoute) router.replace("/(tabs)");
  }, [isLoaded, isSignedIn, segements]);

  if (!isLoaded) return null;

  return <Stack screenOptions={{ headerShown: false }} />;
}
