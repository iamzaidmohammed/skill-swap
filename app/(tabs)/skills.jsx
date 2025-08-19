import { FlatList, StyleSheet, Text, View } from "react-native";

const dummySkills = [
  { id: "1", skill: "Guitar Lessons" },
  { id: "2", skill: "Cooking Skills" },
  { id: "3", skill: "Graphic Design" },
];

export default function SkillsScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Available Skills</Text>
      <FlatList
        data={dummySkills}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.skill}>{item.skill}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 20, fontWeight: "bold", marginBottom: 10 },
  card: {
    padding: 15,
    backgroundColor: "#f2f2f2",
    marginBottom: 10,
    borderRadius: 10,
  },
  skill: { fontSize: 16 },
});
