// app/index.jsx
import { Redirect } from "expo-router";
import { ActivityIndicator, View } from "react-native";
import { useAuth } from "../context/AuthContext";

export default function Index() {
  const { user, loading } = useAuth();

  // show a loader while checking storage
  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
  }

  // if logged in → go to tabs, else → login
  if (user) {
    return <Redirect href="/(tabs)/home" />;
  } else {
    return <Redirect href="/auth/login" />;
  }
}
