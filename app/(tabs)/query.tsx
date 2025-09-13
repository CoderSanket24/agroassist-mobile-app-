import { useState } from "react";
import { View, Text, TextInput, Button, FlatList, StyleSheet } from "react-native";
import { Colors } from "../../constants/Colors";
import { askQuery } from "@/services/query";

export default function QueryScreen() {
  const [query, setQuery] = useState("");
  const [history, setHistory] = useState<{ q: string; a: string }[]>([]);

  const handleSend = async () => {
    if (!query.trim()) return;

    // // 🔹 For now, just mock response
    // const fakeAnswer = "This is sample advice. Backend will give real response.";
    // setHistory([{ q: query, a: fakeAnswer }, ...history]);
    // setQuery("");
    
    try {
      const res = await askQuery(query);
      setHistory([{ q: query, a: res.answer }, ...history]);
    } catch (err) {
      setHistory([{ q: query, a: "Failed to fetch answer. Please try again." }, ...history]);
    }

    setQuery("");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Ask Your Question 🌱</Text>

      <TextInput
        style={styles.input}
        placeholder="Type your crop query..."
        value={query}
        onChangeText={setQuery}
      />

      <Button title="Submit" onPress={handleSend} />

      <FlatList
        style={{ marginTop: 20 }}
        data={history}
        keyExtractor={(_, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.chatBox}>
            <Text style={styles.query}>👨‍🌾 {item.q}</Text>
            <Text style={styles.answer}>🤖 {item.a}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background, padding: 20 },
  title: { fontSize: 20, fontWeight: "bold", marginBottom: 15, color: Colors.primary },
  input: {
    borderWidth: 1,
    borderColor: Colors.primary,
    padding: 12,
    borderRadius: 10,
    marginBottom: 10,
    backgroundColor: Colors.white,
  },
  chatBox: {
    backgroundColor: Colors.white,
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  query: { fontWeight: "bold", marginBottom: 5 },
  answer: { color: Colors.text },
});
