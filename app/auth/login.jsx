import { useRouter } from "expo-router";
import { useState } from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";
import { useAuth } from "../../context/AuthContext";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();
  const router = useRouter();

  const handleLogin = () => {
    login(email, password);
    router.replace("/(tabs)/home");
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", padding: 20 }}>
      <Text style={{ fontSize: 24, marginBottom: 30, textAlign: "center" }}>
        Login
      </Text>

      <View style={{ marginBottom: 15 }}>
        <Text style={{ marginBottom: 5, fontWeight: "bold" }}>Email</Text>
        <TextInput
          placeholder="Enter your email"
          value={email}
          onChangeText={setEmail}
          style={{ borderWidth: 1, borderRadius: 6, padding: 10 }}
        />
      </View>

      <View style={{ marginBottom: 15 }}>
        <Text style={{ marginBottom: 5, fontWeight: "bold" }}>Password</Text>
        <TextInput
          placeholder="Enter your password"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
          style={{ borderWidth: 1, borderRadius: 6, padding: 10 }}
        />
      </View>

      <TouchableOpacity
        onPress={handleLogin}
        style={{
          backgroundColor: "#007AFF",
          padding: 15,
          borderRadius: 8,
          alignItems: "center",
        }}
      >
        <Text style={{ color: "white", fontWeight: "bold", fontSize: 16 }}>
          Log In
        </Text>
      </TouchableOpacity>

      {/* Signup link */}
      <View style={{ marginTop: 20, alignItems: "center" }}>
        <Text>
          Don’t have an account?{" "}
          <Text
            style={{ color: "blue", fontWeight: "bold" }}
            onPress={() => router.replace("/auth/signup")}
          >
            Sign up
          </Text>
        </Text>
      </View>
    </View>
  );
}
