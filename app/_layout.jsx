import { AuthProvider, useAuth } from "@/context/AuthContext";
import { SkillProvider } from "@/context/SkillContext";
import { Stack } from "expo-router";
import { ActivityIndicator, View } from "react-native";

function RootAfterAuthLoad() {
  const { loading } = useAuth();

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="auth/login" />
      <Stack.Screen name="auth/signup" />
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="requests" options={{ title: "Requests" }} />
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <SkillProvider>
        <RootAfterAuthLoad />
      </SkillProvider>
    </AuthProvider>
  );
}
