// context/AuthContext.jsx
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, useContext, useEffect, useState } from "react";
import API from "../api";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load user from storage on startup
  useEffect(() => {
    const loadUser = async () => {
      try {
        const storedUser = await AsyncStorage.getItem("user");
        const storedToken = await AsyncStorage.getItem("token");

        if (storedUser && storedToken) {
          API.defaults.headers.common[
            "Authorization"
          ] = `Bearer ${storedToken}`;
          setUser(JSON.parse(storedUser));
        }
      } catch (err) {
        console.log("Error loading auth:", err);
      }
      setLoading(false);
    };

    loadUser();
  }, []);

  // 🔹 Login with backend
  const login = async (email, password) => {
    try {
      const res = await API.post("/auth/login", { email, password });
      const { token, user } = res.data;

      // store token + user
      await AsyncStorage.setItem("token", token);
      await AsyncStorage.setItem("user", JSON.stringify(user));

      API.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      setUser(user);
    } catch (err) {
      const msg = err.response?.data?.msg || err.message || "Login failed";
      throw msg;
    }
  };

  // 🔹 Register new user
  const signup = async (name, email, password) => {
    try {
      await API.post("/auth/register", { name, email, password });
      // optionally auto-login after register
      await login(email, password);
    } catch (err) {
      const msg =
        err.response?.data?.msg || err.message || "Registration failed";
      throw msg;
    }
  };

  // 🔹 Logout
  const logout = async () => {
    try {
      await AsyncStorage.removeItem("token");
      await AsyncStorage.removeItem("user");
      setUser(null);
      delete API.defaults.headers.common["Authorization"];
    } catch (err) {
      console.log("Logout error:", err);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
