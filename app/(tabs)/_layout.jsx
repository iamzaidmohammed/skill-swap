import { Ionicons } from "@expo/vector-icons";
import { Tabs, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import API from "../../api";
import { useAuth } from "../../context/AuthContext";

function NotificationButton() {
  const router = useRouter();
  const { user } = useAuth();
  const [count, setCount] = useState(0);

  const fetchCount = async () => {
    try {
      const res = await API.get("/requests/received");
      const items = res.data || [];
      const pending = items.filter((i) => i.status === "pending").length;
      setCount(pending);
    } catch (err) {
      console.log(
        "Fetch requests count error:",
        err.response?.data || err.message
      );
      setCount(0);
    }
  };

  useEffect(() => {
    if (!user) return;
    fetchCount();
    const t = setInterval(fetchCount, 30000); // refresh every 30s
    return () => clearInterval(t);
  }, [user]);

  return (
    <TouchableOpacity onPress={() => router.push("/requests")} style={s.button}>
      <Ionicons name="notifications" size={22} color="#000" />
      {count > 0 ? (
        <View style={s.badge}>
          <Text style={s.badgeText}>{count}</Text>
        </View>
      ) : null}
    </TouchableOpacity>
  );
}

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName;
          if (route.name === "home") iconName = "home";
          else if (route.name === "skills") iconName = "list";
          else if (route.name === "profile") iconName = "person";
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        headerRight: () => <NotificationButton />,
      })}
    >
      <Tabs.Screen name="home" options={{ title: "Home" }} />
      <Tabs.Screen name="skills" options={{ title: "My Skills" }} />
      <Tabs.Screen name="profile" options={{ title: "Profile" }} />
    </Tabs>
  );
}

const s = StyleSheet.create({
  button: {
    marginRight: 12,
    padding: 6,
  },
  badge: {
    position: "absolute",
    right: 0,
    top: 0,
    backgroundColor: "red",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
    minWidth: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  badgeText: { color: "white", fontSize: 12, fontWeight: "bold" },
});
