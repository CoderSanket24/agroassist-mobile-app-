import { useState } from "react";
import { View, Text, Button, Image, StyleSheet, Alert, ScrollView } from "react-native";
import * as Location from "expo-location";
import { Colors } from "../../constants/Colors";
import { getWeatherByCoords, getForecastByCoords } from "../../services/weather";

export default function WeatherScreen() {
  const [weather, setWeather] = useState<any>(null);
  const [forecast, setForecast] = useState<any[]>([]);

  const handleFetchWeatherByLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission Denied", "Please allow location access.");
      return;
    }

    let location = await Location.getCurrentPositionAsync({});
    const data = await getWeatherByCoords(location.coords.latitude, location.coords.longitude);
    const forecastData = await getForecastByCoords(location.coords.latitude, location.coords.longitude);

    setWeather(data);
    setForecast(forecastData);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.label}>🌍 Weather Information</Text>

      <Button title="📍 Get Weather by My Location" onPress={handleFetchWeatherByLocation} />

      {weather && (
        <View style={styles.resultBox}>
          <Text style={styles.resultTitle}>{weather.name}</Text>
          <Text style={styles.result}>{weather.temp}°C</Text>
          <Text style={styles.result}>{weather.desc}</Text>
          <Image
            source={{
              uri: `https://openweathermap.org/img/wn/${weather.icon}@2x.png`,
            }}
            style={{ width: 80, height: 80 }}
          />
        </View>
      )}

      {forecast.length > 0 && (
        <View style={styles.forecastBox}>
          <Text style={styles.forecastTitle}>📅 3-Day Forecast</Text>
          {forecast.map((day, index) => (
            <View key={index} style={styles.forecastItem}>
              <Text style={styles.date}>{day.date}</Text>
              <Image
                source={{ uri: `https://openweathermap.org/img/wn/${day.icon}@2x.png` }}
                style={{ width: 50, height: 50 }}
              />
              <Text style={styles.temp}>{day.temp}°C</Text>
              <Text style={styles.desc}>{day.desc}</Text>
            </View>
          ))}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, backgroundColor: Colors.background, padding: 20, justifyContent: "center" },
  label: { fontSize: 20, fontWeight: "bold", marginBottom: 15, color: Colors.primary },
  resultBox: { marginTop: 20, padding: 20, backgroundColor: Colors.white, borderRadius: 12, alignItems: "center", elevation: 2 },
  resultTitle: { fontSize: 22, fontWeight: "bold", marginBottom: 5 },
  result: { fontSize: 18, marginVertical: 3 },
  forecastBox: { marginTop: 30, backgroundColor: Colors.white, padding: 15, borderRadius: 12 },
  forecastTitle: { fontSize: 20, fontWeight: "bold", marginBottom: 15, color: Colors.primary },
  forecastItem: { flexDirection: "row", alignItems: "center", marginBottom: 12 },
  date: { flex: 1, fontSize: 16 },
  temp: { flex: 1, fontSize: 16, fontWeight: "bold" },
  desc: { flex: 2, fontSize: 14, color: Colors.text },
});
