import { View, Text, StyleSheet } from "react-native";

export default function ProfileScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>👤 Farmer Profile</Text>
      <Text style={styles.text}>
        Manage your details, saved queries, and preferences here.
      </Text>
      <Text style={styles.text}>
        (Feature coming soon: Login, language settings, saved advice)
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", padding: 20 },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 10 },
  text: { fontSize: 16, textAlign: "center", marginVertical: 5 },
});
