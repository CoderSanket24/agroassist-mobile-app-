import { useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  Alert,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl
} from "react-native";
import * as Location from "expo-location";
import { Colors } from "../../constants/Colors";
import { getWeatherByCoords, getForecastByCoords } from "../../services/weather";
import { Ionicons } from "@expo/vector-icons";

export default function WeatherScreen() {
  const [weather, setWeather] = useState<any>(null);
  const [forecast, setForecast] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [locationName, setLocationName] = useState("");

  const handleFetchWeatherByLocation = async (isRefresh = false) => {
    if (!isRefresh) setLoading(true);
    else setRefreshing(true);

    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permission Denied", "Please allow location access to get weather information.");
        return;
      }

      let location = await Location.getCurrentPositionAsync({});

      // Get location name from coordinates
      const [weatherData, forecastData] = await Promise.all([
        getWeatherByCoords(location.coords.latitude, location.coords.longitude),
        getForecastByCoords(location.coords.latitude, location.coords.longitude)
      ]);

      if (!weatherData) {
        Alert.alert("Error", "No weather data returned for your location.");
        setWeather(null);
        setForecast([]);
        setLocationName("");
        return;
      }

      setWeather(weatherData);
      setForecast(forecastData);
      setLocationName(weatherData.name);

    } catch (error) {
      Alert.alert("Error", "Failed to fetch weather data. Please try again.");
      console.error("Weather fetch error:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const getWeatherBackground = (main: string) => {
    const weatherType = main?.toLowerCase();
    if (weatherType?.includes("rain")) return "#bbdefb";
    if (weatherType?.includes("cloud")) return "#e3f2fd";
    if (weatherType?.includes("clear")) return "#e3f2fd";
    if (weatherType?.includes("snow")) return "#e3f2fd";
    return "#f3e5f5";
  };

  const getWeatherIcon = (main: string) => {
    const weatherType = main?.toLowerCase();
    if (weatherType?.includes("rain")) return "rainy";
    if (weatherType?.includes("thunderstorm")) return "thunderstorm";
    if (weatherType?.includes("drizzle")) return "rainy";
    if (weatherType?.includes("cloud")) return "cloudy";
    if (weatherType?.includes("clear")) return "sunny";
    if (weatherType?.includes("snow")) return "snow";
    if (weatherType?.includes("mist") || weatherType?.includes("fog")) return "cloud";
    return "partly-sunny";
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
        <Text style={styles.loadingText}>Fetching weather data...</Text>
      </View>
    );
  }

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={() => handleFetchWeatherByLocation(true)}
          colors={[Colors.primary]}
        />
      }
    >
      <View style={styles.header}>
        <Ionicons name="partly-sunny" size={32} color={Colors.primary} />
        <Text style={styles.title}>Weather Forecast</Text>
        <Text style={styles.subtitle}>Get real-time weather information</Text>
      </View>

      {!weather ? (
        <View style={styles.placeholderContainer}>
          <Ionicons name="location-outline" size={64} color={Colors.textSecondary} />
          <Text style={styles.placeholderText}>
            Get current weather information for your location
          </Text>
          <TouchableOpacity
            style={styles.locationButton}
            onPress={() => handleFetchWeatherByLocation()}
          >
            <Ionicons name="navigate" size={20} color={Colors.white} />
            <Text style={styles.locationButtonText}>Get My Location Weather</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          {/* Current Weather Card */}
          <View style={[
            styles.weatherCard,
            { backgroundColor: getWeatherBackground(weather.desc) }
          ]}>
            <Text style={styles.locationName}>{weather.name}</Text>
            <View style={styles.currentWeather}>
              <View style={styles.temperatureContainer}>
                <Text style={styles.temperature}>{Math.round(weather.temp)}°</Text>
                <Text style={styles.weatherDescription}>{weather.desc}</Text>
              </View>
              <View style={styles.weatherIconContainer}>
                <Image
                  source={{ uri: `https://openweathermap.org/img/wn/${weather.icon}@4x.png` }}
                  style={styles.weatherIcon}
                />
              </View>
            </View>

            <View style={styles.weatherDetails}>
              <View style={styles.detailItem}>
                <Ionicons name="water-outline" size={20} color={Colors.primary} />
                <Text style={styles.detailText}>{weather.humidity}%</Text>
                <Text style={styles.detailLabel}>Humidity</Text>
              </View>
              <View style={styles.detailItem}>
                <Ionicons name="speedometer-outline" size={20} color={Colors.primary} />
                <Text style={styles.detailText}>{weather.pressure}hPa</Text>
                <Text style={styles.detailLabel}>Pressure</Text>
              </View>
              <View style={styles.detailItem}>
                <Ionicons name="flag" size={20} color={Colors.primary} />
                <Text style={styles.detailText}>{weather.windSpeed}m/s</Text>
                <Text style={styles.detailLabel}>Wind</Text>
              </View>
            </View>
          </View>

          {/* Forecast Section */}
          <Text style={styles.sectionTitle}>3-Day Forecast</Text>
          <View style={styles.forecastContainer}>
            {forecast.map((day, index) => (
              <View key={index} style={styles.forecastItem}>
                <Text style={styles.forecastDate}>{day.date}</Text>
                <Image
                  source={{ uri: `https://openweathermap.org/img/wn/${day.icon}@2x.png` }}
                  style={styles.forecastIcon}
                />
                <View style={styles.forecastTempContainer}>
                  <Text style={styles.forecastTemp}>{Math.round(day.temp)}°</Text>
                  <Text style={styles.forecastDesc}>{day.desc}</Text>
                </View>
              </View>
            ))}
          </View>

          {/* Farming Advice based on Weather */}
          {weather && (
            <View style={styles.adviceContainer}>
              <Text style={styles.adviceTitle}>🌱 Farming Advice</Text>
              <Text style={styles.adviceText}>
                {weather.desc.toLowerCase().includes('rain')
                  ? "Good time for irrigation. Consider soil moisture levels before additional watering."
                  : weather.temp > 30
                    ? "High temperatures detected. Ensure proper irrigation and consider shade for sensitive crops."
                    : "Moderate weather conditions. Good time for planting and field activities."
                }
              </Text>
            </View>
          )}
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: Colors.background,
    padding: 20
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.background,
  },
  loadingText: {
    marginTop: 16,
    color: Colors.textSecondary,
  },
  header: {
    alignItems: "center",
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: Colors.primary,
    marginTop: 8,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.textSecondary,
    marginTop: 4,
  },
  placeholderContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: 40,
  },
  placeholderText: {
    textAlign: "center",
    color: Colors.textSecondary,
    marginVertical: 20,
    fontSize: 16,
  },
  locationButton: {
    flexDirection: "row",
    backgroundColor: Colors.primary,
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    gap: 8,
  },
  locationButtonText: {
    color: Colors.white,
    fontWeight: "600",
  },
  weatherCard: {
    borderRadius: 20,
    padding: 24,
    marginBottom: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  locationName: {
    fontSize: 20,
    fontWeight: "600",
    color: Colors.text,
    marginBottom: 16,
    textAlign: "center",
  },
  currentWeather: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  temperatureContainer: {
    flex: 1,
  },
  temperature: {
    fontSize: 64,
    fontWeight: "bold",
    color: Colors.text,
  },
  weatherDescription: {
    fontSize: 18,
    color: Colors.textSecondary,
    textTransform: "capitalize",
  },
  weatherIconContainer: {
    alignItems: "center",
  },
  weatherIcon: {
    width: 120,
    height: 120,
  },
  weatherDetails: {
    flexDirection: "row",
    justifyContent: "space-around",
    borderTopWidth: 1,
    borderTopColor: "rgba(255,255,255,0.3)",
    paddingTop: 20,
  },
  detailItem: {
    alignItems: "center",
  },
  detailText: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.text,
    marginTop: 4,
  },
  detailLabel: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: Colors.text,
    marginBottom: 16,
  },
  forecastContainer: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
  },
  forecastItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  forecastDate: {
    flex: 2,
    fontSize: 14,
    fontWeight: "500",
    color: Colors.text,
  },
  forecastIcon: {
    width: 40,
    height: 40,
    marginHorizontal: 8,
  },
  forecastTempContainer: {
    flex: 2,
    alignItems: "flex-end",
  },
  forecastTemp: {
    fontSize: 16,
    fontWeight: "bold",
    color: Colors.text,
  },
  forecastDesc: {
    fontSize: 12,
    color: Colors.textSecondary,
    textTransform: "capitalize",
  },
  adviceContainer: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
  },
  adviceTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: Colors.primary,
    marginBottom: 12,
  },
  adviceText: {
    fontSize: 14,
    color: Colors.text,
    lineHeight: 20,
  },
});