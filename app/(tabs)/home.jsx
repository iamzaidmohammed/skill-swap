import React, { useEffect, useState } from "react";
import {
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import API from "../../api";
import { useAuth } from "../../context/AuthContext";

export default function Home() {
  const { user } = useAuth();
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPublicSkills = async () => {
    try {
      setLoading(true);
      // public endpoint: list all skills excluding the authenticated user's
      const res = await API.get("/skills/public");
      setSkills(res.data || []);
    } catch (err) {
      console.log(
        "Fetch public skills error:",
        err.response?.data || err.message
      );
      setSkills([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPublicSkills();
  }, [user]);

  const requestExchange = async (skillId) => {
    try {
      await API.post("/requests", {
        skillId,
        message: "I'd like to swap skills",
      });
      Alert.alert("Request sent", "The owner will be notified");
    } catch (err) {
      console.log("Request error:", err.response?.data || err.message);
      Alert.alert(
        "Request failed",
        err.response?.data?.msg || err.message || "Could not send request"
      );
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Available Skills</Text>

      <FlatList
        data={skills}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.offered}>{item.offered}</Text>
            <Text style={styles.text}>Wants: {item.wanted}</Text>
            <Text style={styles.text}>By: {item.user?.name || item.user}</Text>

            <TouchableOpacity
              style={styles.button}
              onPress={() => requestExchange(item._id)}
            >
              <Text style={styles.buttonText}>Request Exchange</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 16,
  },
  header: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 16,
  },
  card: {
    backgroundColor: "#f2f2f2",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  offered: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 4,
  },
  text: {
    fontSize: 14,
    color: "#555",
  },
  button: {
    backgroundColor: "#007BFF",
    paddingVertical: 10,
    borderRadius: 8,
    marginTop: 12,
  },
  buttonText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "600",
    fontSize: 15,
  },
});
