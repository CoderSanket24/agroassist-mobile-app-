import { askQuery, fetchQueries } from "@/services/query";
import { formatDate } from "@/utils/date";
import { useEffect, useState } from "react";
import { Button, FlatList, StyleSheet, Text, TextInput, View } from "react-native";
import { Colors } from "../../constants/Colors";

export default function QueryScreen() {
  const [query, setQuery] = useState("");
  const [history, setHistory] = useState<{ text: string; sender: "farmer" | "assistant"; time: string }[]>([]);

  useEffect(() => {
    const loadHistory = async () => {
      const res = await fetchQueries();
      setHistory(res.map((item: any) => ({ q: item.question, a: item.answer, time: formatDate(item.created_at) })));
    };
    loadHistory();
  }, []);

  const handleSend = async () => {
    if (!query.trim()) return;

    const timestamp = formatDate(new Date().toISOString());

    // Add farmer message immediately
    setHistory(prev => [
      ...prev,
      { text: query, sender: "farmer", time: timestamp }
    ]);

    try {
      const res = await askQuery(query);
      setHistory(prev => [
        ...prev,
        { text: res.answer, sender: "assistant", time: formatDate(res.created_at) }
      ]);
    } catch (err) {
      setHistory(prev => [
        ...prev,
        { text: "Failed to fetch answer.", sender: "assistant", time: timestamp }
      ]);
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
          <View
            style={[
              styles.chatBubble,
              item.sender === "farmer" ? styles.farmerBubble : styles.assistantBubble,
            ]}
          >
            <Text style={styles.messageText}>{item.text}</Text>
            <Text style={styles.timestamp}>{item.time}</Text>
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
  chatBubble: {
    maxWidth: "75%",
    padding: 10,
    marginVertical: 5,
    borderRadius: 15,
  },
  farmerBubble: {
    alignSelf: "flex-start",
    backgroundColor: "#DCF8C6", // WhatsApp green
    borderTopLeftRadius: 0,
  },
  assistantBubble: {
    alignSelf: "flex-end",
    backgroundColor: "#ECECEC", // Gray bubble
    borderTopRightRadius: 0,
  },
  messageText: { fontSize: 16 },
  timestamp: { fontSize: 10, color: "#666", marginTop: 5, textAlign: "right" },
});
