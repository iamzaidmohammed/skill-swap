import { Ionicons } from "@expo/vector-icons";
import { Tabs, useRouter } from "expo-router";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useAuth } from "../../context/AuthContext";
import { useNotifications } from "../../context/NotificationContext";

function NotificationButton() {
  const router = useRouter();
  const { user } = useAuth();
  const { unreadCount, markAllRead } = useNotifications();

  return (
    <TouchableOpacity
      onPress={() => {
        router.push("/notifications");
        // optimistically clear unread badge
        if (user) markAllRead();
      }}
      style={s.button}
    >
      <Ionicons name="notifications" size={22} color="#000" />
      {unreadCount > 0 ? (
        <View style={s.badge}>
          <Text style={s.badgeText}>{unreadCount}</Text>
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
