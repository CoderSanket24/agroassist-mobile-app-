import { askQuery, fetchQueries } from "@/services/query";
import { formatDate } from "@/utils/date";
import { useEffect, useState } from "react";
import { Button, StyleSheet, Text, TextInput, View } from "react-native";
import { Colors } from "../../constants/Colors";
import ChatHistory from "@/components/ChatHistory";

export default function QueryScreen() {
  const [query, setQuery] = useState("");
  const [history, setHistory] = useState<{ q: string; a: string, time: string }[]>([]);

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

    try {
      const res = await askQuery(query);
      setHistory([{ q: query, a: res.answer, time: formatDate(res.created_at) }, ...history]);
    } catch (err) {
      setHistory([{ q: query, a: "Failed to fetch answer.", time:formatDate(new Date().toISOString()) }, ...history]);
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

      <ChatHistory history={history} />

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
});
