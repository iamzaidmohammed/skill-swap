import {
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const skills = [
  {
    id: "1",
    offered: "Guitar Lessons",
    wanted: "Cooking Lessons",
    user: "Alice",
    contact: "alice@email.com",
  },
  {
    id: "2",
    offered: "Graphic Design",
    wanted: "Spanish Tutoring",
    user: "Bob",
    contact: "bob@email.com",
  },
  {
    id: "3",
    offered: "Web Development",
    wanted: "Public Speaking",
    user: "Charlie",
    contact: "charlie@email.com",
  },
];

export default function Home() {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Available Skills</Text>

      <FlatList
        data={skills}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.offered}>{item.offered}</Text>
            <Text style={styles.text}>Wants: {item.wanted}</Text>
            <Text style={styles.text}>By: {item.user}</Text>

            <TouchableOpacity
              style={styles.button}
              onPress={() =>
                Alert.alert("Contact Info", `Reach out at: ${item.contact}`)
              }
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
