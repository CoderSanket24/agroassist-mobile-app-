import { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet } from "react-native";

export default function WeatherScreen() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState("");

  const getWeather = () => {
    if (city.toLowerCase() === "pune") {
      setWeather("🌤️ Pune: 28°C, partly cloudy");
    } else if (city.toLowerCase() === "delhi") {
      setWeather("☀️ Delhi: 34°C, hot and sunny");
    } else {
      setWeather("❌ No data available");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Enter your district:</Text>
      <TextInput
        style={styles.input}
        placeholder="e.g. Pune"
        value={city}
        onChangeText={setCity}
      />
      <Button title="Get Weather" onPress={getWeather} />
      {weather.length > 0 && (
        <Text style={styles.result}>{weather}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: "center" },
  label: { fontSize: 18, marginBottom: 10 },
  input: { borderWidth: 1, padding: 10, marginBottom: 20, borderRadius: 5 },
  result: { marginTop: 20, fontSize: 18, fontWeight: "bold" },
});
