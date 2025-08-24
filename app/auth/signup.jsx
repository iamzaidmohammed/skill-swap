import { useAuth } from "@/context/AuthContext";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";

export default function SignupScreen() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { signup } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!error) return;
    const t = setTimeout(() => setError(""), 3000);
    return () => clearTimeout(t);
  }, [error]);

  const handleSignup = async () => {
    try {
      await signup(name, email, password);
      router.replace("/(tabs)/home");
    } catch (err) {
      setError(String(err));
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", padding: 20 }}>
      <Text style={{ fontSize: 24, marginBottom: 30, textAlign: "center" }}>
        Sign Up
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

      {/* Name */}
      <View style={{ marginBottom: 15 }}>
        <Text style={{ marginBottom: 5, fontWeight: "bold" }}>Name</Text>
        <TextInput
          placeholder="Enter your name"
          value={name}
          onChangeText={setName}
          autoCapitalize="words"
          style={{ borderWidth: 1, borderRadius: 6, padding: 10 }}
        />
      </View>

      {/* Email */}
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

      {/* Password */}
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
        onPress={handleSignup}
        style={{
          backgroundColor: "#007AFF",
          padding: 15,
          borderRadius: 8,
          alignItems: "center",
        }}
      >
        <Text style={{ color: "white", fontWeight: "bold", fontSize: 16 }}>
          Sign Up
        </Text>
      </TouchableOpacity>

      <View style={{ marginTop: 20, alignItems: "center" }}>
        <Text>
          Already have an account?{" "}
          <Text
            style={{ color: "blue", fontWeight: "bold" }}
            onPress={() => router.replace("/auth/login")}
          >
            Login
          </Text>
        </Text>
      </View>
    </View>
  );
}
