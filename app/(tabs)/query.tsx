import { useState } from "react";
import { View, Text, TextInput, StyleSheet } from "react-native";
import { Colors } from "../../constants/Colors";

export default function QueryScreen() {
  const [query, setQuery] = useState("");

  let response = "";
  if (query.toLowerCase().includes("tomato")) {
    response = "🍅 Tomato Early Blight suspected. Use Mancozeb spray.";
  } else if (query.toLowerCase().includes("wheat")) {
    response = "🌾 Wheat Rust suspected. Use Propiconazole spray.";
  }

  return (
    <View style={styles.container}>
      <Text style={styles.label}>🎤 Describe your crop issue:</Text>
      <TextInput
        style={styles.input}
        placeholder="e.g. Tomato yellow spots"
        value={query}
        onChangeText={setQuery}
      />
      {query.length > 0 && (
        <View style={styles.resultBox}>
          <Text style={styles.resultTitle}>AgroAssist Suggestion:</Text>
          <Text style={styles.result}>{response || "❌ No advice available"}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background, padding: 20, justifyContent: "center" },
  label: { fontSize: 20, fontWeight: "bold", marginBottom: 15, color: Colors.primary },
  input: { borderWidth: 1, borderColor: Colors.primary, padding: 12, borderRadius: 10, marginBottom: 20, backgroundColor: Colors.white },
  resultBox: { backgroundColor: Colors.white, padding: 15, borderRadius: 10, borderColor: Colors.secondary, borderWidth: 1 },
  resultTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 8, color: Colors.primary },
  result: { fontSize: 16, color: Colors.text },
});
