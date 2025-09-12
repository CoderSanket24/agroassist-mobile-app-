import { View, Text, StyleSheet } from "react-native";

export default function DetectionScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>📸 Disease Detection</Text>
      <Text style={styles.text}>
        Upload or capture a leaf image to detect crop diseases.
      </Text>
      <Text style={styles.text}>
        (Feature coming soon: YOLOv8 model integration)
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", padding: 20 },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 10 },
  text: { fontSize: 16, textAlign: "center", marginVertical: 5 },
});
