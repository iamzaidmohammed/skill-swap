import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import API from "../api"; // axios instance configured with baseURL + timeout
import { useAuth } from "../context/AuthContext"; // access current user + auth state

export default function RequestsScreen() {
  // get current auth user from context; used to re-fetch when auth changes
  const { user } = useAuth();
  const router = useRouter();

  // local state: array of request objects received by the current user
  const [requests, setRequests] = useState([]);

  // Fetch requests that were sent TO the current user
  // Endpoint: GET /api/requests/received
  const fetchRequests = async () => {
    try {
      const res = await API.get("/requests/received");
      // store returned array into state (or empty array if none)
      setRequests(res.data || []);
    } catch (err) {
      // Log the error (response may contain useful msg) and clear the list
      console.log("Fetch requests error:", err.response?.data || err.message);
      setRequests([]);
    }
  };

  // When the authenticated user changes (login/logout) re-fetch received requests
  useEffect(() => {
    fetchRequests();
  }, [user]);



  // Accept or decline a request. This calls POST /api/requests/:id/respond
  // action should be either 'accept' or 'decline'. On success we refresh the list.
  const respond = async (id, action) => {
    try {
      await API.post(`/requests/${id}/respond`, {
        action: action === "accept" ? "accept" : "decline",
      });
      // Inform the user and refresh local list so UI reflects the new status
      Alert.alert("Success", `Request ${action}ed`);
      fetchRequests();
    } catch (err) {
      // Show helpful error message if available from server
      console.log("Respond error:", err.response?.data || err.message);
      Alert.alert(
        "Failed",
        err.response?.data?.msg || err.message || "Could not respond to request"
      );
    }
  };

  // Render UI: list of received requests with Accept / Decline buttons
  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.header}>Requests</Text>
        <TouchableOpacity
          onPress={() => router.replace("/notifications")}
          style={styles.notificationsButton}
        >
          <Text style={styles.notificationsButtonText}>View Notifications</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={requests}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            {/* Skill being requested */}
            <Text style={styles.offered}>{item.skill?.offered || "Skill"}</Text>
            {/* Who sent the request */}
            <Text style={styles.text}>
              From: {item.from?.name || item.from}
            </Text>
            {/* Optional message from requester */}
            <Text style={styles.text}>Message: {item.message || "-"}</Text>
            {/* Current status: pending / accepted / declined */}
            <Text style={styles.text}>Status: {item.status}</Text>

            {/* If pending, show actions to accept or decline the request */}
            {item.status === "pending" ? (
              <View style={{ flexDirection: "row", marginTop: 8 }}>
                <TouchableOpacity
                  onPress={() => respond(item._id, "accept")}
                  style={[
                    styles.button,
                    { marginRight: 8, backgroundColor: "green" },
                  ]}
                >
                  <Text style={styles.buttonText}>Accept</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => respond(item._id, "decline")}
                  style={[styles.button, { backgroundColor: "red" }]}
                >
                  <Text style={styles.buttonText}>Decline</Text>
                </TouchableOpacity>
              </View>
            ) : null}
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 16 },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
    marginTop: 25,
  },
  header: { fontSize: 22, fontWeight: "bold" },
  notificationsButton: {
    backgroundColor: "#007AFF",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  notificationsButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  card: {
    backgroundColor: "#f2f2f2",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  offered: { fontSize: 18, fontWeight: "bold", marginBottom: 4 },
  text: { fontSize: 14, color: "#555" },
  button: {
    paddingVertical: 10,
    borderRadius: 8,
    paddingHorizontal: 12,
    alignItems: "center",
  },
  buttonText: { color: "#fff", fontWeight: "600" },
});
