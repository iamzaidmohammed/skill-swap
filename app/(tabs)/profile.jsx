import { useAuth } from "@/context/AuthContext";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function Profile() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const [modalVisible, setModalVisible] = useState(false);
  const [editedUser, setEditedUser] = useState(user);

  const handleSave = () => {
    // setUser(editedUser);
    setModalVisible(false);
  };

  const signout = () => {
    logout();
    router.replace("/auth/login");
  };

  return (
    <View style={styles.container}>
      {/* Profile Picture */}
      {/* <Image source={{ uri: user.avatar }} style={styles.avatar} /> */}

      {/* User Info */}
      <Text style={styles.name}>{user.name}</Text>
      <Text style={styles.email}>{user.email}</Text>
      <Text style={styles.bio}>{user.bio}</Text>

      {/* Stats */}
      <View style={styles.statsContainer}>
        <View style={styles.statBox}>
          <Text style={styles.statNumber}>{user.skillsCount}</Text>
          <Text style={styles.statLabel}>Skills</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statNumber}>{user.exchanges}</Text>
          <Text style={styles.statLabel}>Exchanges</Text>
        </View>
      </View>

      {/* Buttons */}
      <TouchableOpacity
        style={styles.button}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.buttonText}>Edit Profile</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={signout}
        style={[styles.button, styles.logoutButton]}
      >
        <Text style={styles.buttonText}>Logout</Text>
      </TouchableOpacity>

      {/* Edit Profile Modal */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Edit Profile</Text>

            <View>
              <Text style={styles.label}>Name: </Text>
              <TextInput
                style={styles.input}
                placeholder="Name"
                value={editedUser.name}
                onChangeText={(text) =>
                  setEditedUser({ ...editedUser, name: text })
                }
              />
            </View>

            <View>
              <Text style={styles.label}>Bio: </Text>
              <TextInput
                style={styles.input}
                placeholder="Bio"
                value={editedUser.bio}
                onChangeText={(text) =>
                  setEditedUser({ ...editedUser, bio: text })
                }
              />
            </View>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.saveButton]}
                onPress={handleSave}
              >
                <Text style={styles.buttonText}>Save</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    padding: 20,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 12,
  },
  name: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 4,
  },
  email: {
    fontSize: 14,
    color: "#555",
    marginBottom: 12,
  },
  bio: {
    fontSize: 15,
    color: "#666",
    fontStyle: "italic",
    textAlign: "center",
    marginBottom: 20,
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 20,
  },
  statBox: {
    alignItems: "center",
    marginHorizontal: 20,
  },
  statNumber: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#007BFF",
  },
  statLabel: {
    fontSize: 14,
    color: "#555",
  },
  button: {
    backgroundColor: "#007BFF",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginTop: 10,
    width: "80%",
  },
  buttonText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "600",
    fontSize: 16,
  },
  logoutButton: {
    backgroundColor: "#FF3B30",
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContainer: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    width: "85%",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center",
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 6,
    marginBottom: 12,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  modalButton: {
    flex: 1,
    marginHorizontal: 5,
    paddingVertical: 10,
    borderRadius: 6,
  },
  saveButton: {
    backgroundColor: "#007BFF",
  },
  cancelButton: {
    backgroundColor: "#FF3B30",
  },
});
