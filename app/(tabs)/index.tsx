import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Link } from "expo-router";
import { Colors } from "../../constants/Colors";

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>🌱 Welcome to AgroAssist</Text>
      <Text style={styles.subtitle}>Your smart farming assistant</Text>

      <Link href="/query" asChild>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>🎤 Ask a Query</Text>
        </TouchableOpacity>
      </Link>

      <Link href="/weather" asChild>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>🌍 Check Weather</Text>
        </TouchableOpacity>
      </Link>

      <Link href="/detection" asChild>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>📸 Detect Disease</Text>
        </TouchableOpacity>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background, justifyContent: "center", alignItems: "center", padding: 20 },
  title: { fontSize: 26, fontWeight: "bold", color: Colors.primary, marginBottom: 10 },
  subtitle: { fontSize: 16, color: Colors.text, marginBottom: 30 },
  button: {
    backgroundColor: Colors.secondary,
    padding: 15,
    borderRadius: 12,
    marginVertical: 10,
    width: "80%",
    alignItems: "center",
  },
  buttonText: { fontSize: 18, fontWeight: "bold", color: Colors.white },
});
