import React, { useEffect, useState } from "react";
import {
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import API from "../api";
import { useAuth } from "../context/AuthContext";

export default function RequestsScreen() {
  const { user } = useAuth();
  const [requests, setRequests] = useState([]);

  const fetchRequests = async () => {
    try {
      const res = await API.get("/requests/received");
      setRequests(res.data || []);
    } catch (err) {
      console.log("Fetch requests error:", err.response?.data || err.message);
      setRequests([]);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, [user]);

  const respond = async (id, action) => {
    try {
      const res = await API.post(`/requests/${id}/respond`, {
        action: action === "accept" ? "accept" : "decline",
      });
      Alert.alert("Success", `Request ${action}ed`);
      // refresh list
      fetchRequests();
    } catch (err) {
      console.log("Respond error:", err.response?.data || err.message);
      Alert.alert(
        "Failed",
        err.response?.data?.msg || err.message || "Could not respond to request"
      );
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Requests Received</Text>

      <FlatList
        data={requests}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.offered}>{item.skill?.offered || "Skill"}</Text>
            <Text style={styles.text}>
              From: {item.from?.name || item.from}
            </Text>
            <Text style={styles.text}>Message: {item.message || "-"}</Text>
            <Text style={styles.text}>Status: {item.status}</Text>

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
  header: { fontSize: 22, fontWeight: "bold", marginBottom: 16, marginTop: 25 },
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
