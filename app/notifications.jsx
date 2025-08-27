import { useRouter } from "expo-router";
import React, { useEffect } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import API from "../api";
import { useAuth } from "../context/AuthContext";
import { useNotifications } from "../context/NotificationContext";

export default function NotificationsScreen() {
  const { user } = useAuth();
  const { notifications, markRead } = useNotifications();
  const router = useRouter();

  // When this screen opens, mark all notifications for this user as read
  useEffect(() => {
    const markAllRead = async () => {
      try {
        await API.post("/notifications/read-all");
      } catch (err) {
        console.log(
          "Mark notifications read error:",
          err.response?.data || err.message
        );
      }
    };
    if (user) markAllRead();
  }, [user]);

  const renderNotification = ({ item }) => {
    const handlePress = () => {
      if (!item.read) {
        markRead(item._id);
      }
    };

    return (
      <TouchableOpacity
        onPress={handlePress}
        style={[
          styles.card,
          !item.read && styles.unreadCard
        ]}
      >
        <Text style={styles.title}>{'Your skill request was accepted!'}</Text>
        <Text style={styles.subtitle}>{`Contact ${item.data.accepterName || "the user"} at '${item.data.accepterEmail || "their email"}' to arrange the skill swap.`}</Text>
        <Text style={styles.timestamp}>
          {new Date(item.createdAt).toLocaleDateString()} at {new Date(item.createdAt).toLocaleTimeString()}
        </Text>
        {!item.read && <View style={styles.unreadIndicator} />}
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.header}>Notifications</Text>
        <TouchableOpacity
          onPress={() => router.replace("/requests")}
          style={styles.requestsButton}
        >
          <Text style={styles.requestsButtonText}>View Requests</Text>
        </TouchableOpacity>
      </View>

      {notifications.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>No notifications yet</Text>
          <Text style={styles.emptySubtext}>
            You'll see notifications here when someone accepts your skill requests
          </Text>
        </View>
      ) : (
        <FlatList
          data={notifications}
          keyExtractor={(item) => item._id}
          renderItem={renderNotification}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 16,
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
    marginTop: 25,
  },
  header: {
    fontSize: 22,
    fontWeight: "bold",
  },
  requestsButton: {
    backgroundColor: "#007AFF",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  requestsButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  card: {
    backgroundColor: "#f8f9fa",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: "#007AFF",
  },
  unreadCard: {
    backgroundColor: "#e3f2fd",
    borderLeftColor: "#2196F3",
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
    color: "#333",
  },
  subtitle: {
    fontSize: 14,
    color: "#666",
    marginBottom: 8,
    lineHeight: 20,
  },
  timestamp: {
    fontSize: 12,
    color: "#999",
  },
  unreadIndicator: {
    position: "absolute",
    top: 16,
    right: 16,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#2196F3",
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 32,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#666",
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: "#999",
    textAlign: "center",
    lineHeight: 20,
  },
});
