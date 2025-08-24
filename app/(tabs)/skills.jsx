import { useSkills } from "@/context/SkillContext";
import { useState } from "react";
import {
  FlatList,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function MySkills() {
  const { skills, addSkill, updateSkill, deleteSkill, loading } = useSkills();
  const [modalVisible, setModalVisible] = useState(false);
  const [offered, setOffered] = useState("");
  const [wanted, setWanted] = useState("");
  const [editingSkill, setEditingSkill] = useState(null);

  const openAddModal = () => {
    setEditingSkill(null);
    setOffered("");
    setWanted("");
    setModalVisible(true);
  };

  const openEditModal = (skill) => {
    setEditingSkill(skill);
    setOffered(skill.offered);
    setWanted(skill.wanted);
    setModalVisible(true);
  };

  const saveSkill = () => {
    if (!offered || !wanted) return;

    if (editingSkill) {
      updateSkill(editingSkill._id, offered, wanted);
    } else {
      addSkill(offered, wanted);
    }

    setOffered("");
    setWanted("");
    setEditingSkill(null);
    setModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>My Skills</Text>

      {loading ? (
        <Text>Loading...</Text>
      ) : skills.length === 0 ? (
        <Text>No skills found.</Text>
      ) : (
        <FlatList
          data={skills}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Text style={styles.offered}>{item.offered}</Text>
              <Text style={styles.text}>Wants: {item.wanted}</Text>

              <View style={styles.actions}>
                <TouchableOpacity
                  style={[styles.actionButton, { backgroundColor: "#007BFF" }]}
                  onPress={() => openEditModal(item)}
                >
                  <Text style={styles.actionText}>Edit</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.actionButton, { backgroundColor: "#dc3545" }]}
                  onPress={() => deleteSkill(item._id)}
                >
                  <Text style={styles.actionText}>Delete</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
      )}

      {/* FAB */}
      <TouchableOpacity style={styles.fab} onPress={openAddModal}>
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>

      {/* Modal */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalHeader}>
              {editingSkill ? "Edit Skill" : "Add a Skill"}
            </Text>

            <Text style={styles.label}>Skill You Offer</Text>
            <TextInput
              placeholder="Skill you offer"
              value={offered}
              onChangeText={setOffered}
              style={styles.input}
            />

            <Text style={styles.label}>Skill You Want</Text>
            <TextInput
              placeholder="Skill you want"
              value={wanted}
              onChangeText={setWanted}
              style={styles.input}
            />

            <TouchableOpacity style={styles.button} onPress={saveSkill}>
              <Text style={styles.buttonText}>
                {editingSkill ? "Update Skill" : "Save Skill"}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, { backgroundColor: "#999", marginTop: 8 }]}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
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
  actions: {
    flexDirection: "row",
    marginTop: 10,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 8,
    marginHorizontal: 4,
    alignItems: "center",
  },
  actionText: {
    color: "#fff",
    fontWeight: "600",
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
  },
  fab: {
    position: "absolute",
    bottom: 24,
    right: 24,
    backgroundColor: "#007BFF",
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 4,
    elevation: 5,
  },
  fabText: {
    fontSize: 28,
    color: "#fff",
    fontWeight: "bold",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    alignItems: "center",
    justifyContent: "center",
  },
  modalContent: {
    width: "85%",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    elevation: 5,
  },
  modalHeader: {
    fontSize: 28,
    textAlign: "center",
    fontWeight: "bold",
    marginBottom: 22,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    marginBottom: 12,
  },
  button: {
    backgroundColor: "#007BFF",
    paddingVertical: 12,
    borderRadius: 8,
  },
  buttonText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "600",
    fontSize: 15,
  },
});
