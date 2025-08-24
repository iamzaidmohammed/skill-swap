import { useAuth } from "@/context/AuthContext";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!error) return;
    const t = setTimeout(() => setError(""), 3000);
    return () => clearTimeout(t);
  }, [error]);

  const handleLogin = async () => {
    try {
      await login(email, password);
      router.replace("/(tabs)/home");
    } catch (err) {
      setError(String(err));
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", padding: 20 }}>
      <Text style={{ fontSize: 24, marginBottom: 30, textAlign: "center" }}>
        Login
      </Text>

      {error ? (
        <Text
          style={{
            marginBottom: 5,
            color: "red",
            textAlign: "center",
            fontWeight: "bold",
          }}
        >
          {error}
        </Text>
      ) : null}

      <View style={{ marginBottom: 15 }}>
        <Text style={{ marginBottom: 5, fontWeight: "bold" }}>Email</Text>
        <TextInput
          placeholder="Enter your email"
          value={email}
          onChangeText={setEmail}
          style={{ borderWidth: 1, borderRadius: 6, padding: 10 }}
          autoCapitalize="none"
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
