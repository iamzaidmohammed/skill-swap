import { StyleSheet, Text, View } from "react-native";

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Welcome to Skill Swap 🚀</Text>
      <Text style={styles.subText}>Find people to exchange skills with!</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  text: { fontSize: 22, fontWeight: "bold" },
  subText: { fontSize: 16, color: "gray", marginTop: 8 },
});
