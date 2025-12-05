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
import { SafeAreaView } from "react-native-safe-area-context";
import * as Location from "expo-location";
import { Colors } from "@/constants/Colors";
import { getWeatherByCoords, getForecastByCoords } from "@/services/weather";
import { generateAdvisories, getPriorityColor, Advisory } from "@/services/weatherAdvisory";
import { logWeatherSearch } from "@/services/weatherTracking";
import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";

export default function WeatherScreen() {
  const { t } = useTranslation();
  const [weather, setWeather] = useState<any>(null);
  const [forecast, setForecast] = useState<any[]>([]);
  const [advisories, setAdvisories] = useState<Advisory[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [locationName, setLocationName] = useState("");

  const handleFetchWeatherByLocation = async (isRefresh = false) => {
    if (!isRefresh) setLoading(true);
    else setRefreshing(true);

    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(t("weather.permissionDenied"), t("weather.permissionExplain"));
        return;
      }

      let location = await Location.getCurrentPositionAsync({});

      // Get location name using reverse geocoding for consistency
      let cityName = "";
      try {
        const geocode = await Location.reverseGeocodeAsync({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude
        });
        
        if (geocode && geocode.length > 0) {
          const geo = geocode[0];
          cityName = geo.city || geo.district || geo.subregion || geo.region || "";
        }
      } catch (geoError) {
        console.error('Geocoding failed:', geoError);
      }

      // Get weather data
      const [weatherData, forecastData] = await Promise.all([
        getWeatherByCoords(location.coords.latitude, location.coords.longitude),
        getForecastByCoords(location.coords.latitude, location.coords.longitude)
      ]);

      if (!weatherData) {
        Alert.alert("Error", t("weather.noData"));
        setWeather(null);
        setForecast([]);
        setLocationName("");
        return;
      }

      // Use geocoded city name if available, otherwise use weather API name
      const displayName = cityName || weatherData.name;

      setWeather(weatherData);
      setForecast(forecastData);
      setLocationName(displayName);

      // Generate intelligent advisories
      const farmingAdvisories = generateAdvisories(weatherData, forecastData);
      setAdvisories(farmingAdvisories);

      // Log weather search to backend
      logWeatherSearch({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        location_name: displayName,
        temperature: weatherData.temp,
        humidity: weatherData.humidity,
        wind_speed: weatherData.windSpeed,
        weather_condition: weatherData.desc,
        advisories_count: farmingAdvisories.length
      }).catch(err => console.error('Failed to log weather search:', err));

    } catch (error) {
      Alert.alert("Error", t("weather.error"));
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
        <Text style={styles.loadingText}>{t("weather.loading")}</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.background }}>
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
          <Text style={styles.title}>{t("weather.title")}</Text>
          <Text style={styles.subtitle}>{t("weather.subtitle")}</Text>
        </View>

        {!weather ? (
          <View style={styles.placeholderContainer}>
            <Ionicons name="location-outline" size={64} color={Colors.textSecondary} />
            <Text style={styles.placeholderText}>
              {t("weather.placeholder")}
            </Text>
            <TouchableOpacity
              style={styles.locationButton}
              onPress={() => handleFetchWeatherByLocation()}
            >
              <Ionicons name="navigate" size={20} color={Colors.white} />
              <Text style={styles.locationButtonText}>{t("weather.getMyLocation")}</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            {/* Current Weather Card */}
            <View style={[
              styles.weatherCard,
              { backgroundColor: getWeatherBackground(weather.desc) }
            ]}>
              <Text style={styles.locationName}>{locationName}</Text>
              <View style={styles.currentWeather}>
                <View style={styles.temperatureContainer}>
                  <Text style={styles.temperature}>{Math.round(weather.temp)}°</Text>
                  <Text style={styles.weatherDescription}>
                    {t(`weather.conditions.${weather.desc}`, { defaultValue: weather.desc })}
                  </Text>
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
                  <Text style={styles.detailLabel}>{t("weather.humidity")}</Text>
                </View>
                <View style={styles.detailItem}>
                  <Ionicons name="speedometer-outline" size={20} color={Colors.primary} />
                  <Text style={styles.detailText}>{weather.pressure}hPa</Text>
                  <Text style={styles.detailLabel}>{t("weather.pressure")}</Text>
                </View>
                <View style={styles.detailItem}>
                  <Ionicons name="flag" size={20} color={Colors.primary} />
                  <Text style={styles.detailText}>{weather.windSpeed}m/s</Text>
                  <Text style={styles.detailLabel}>{t("weather.wind")}</Text>
                </View>
              </View>
            </View>

            {/* Forecast Section */}
            <Text style={styles.sectionTitle}>{t("weather.threeDay")}</Text>
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
                    <Text style={styles.forecastDesc}>
                      {t(`weather.conditions.${day.desc}`, { defaultValue: day.desc })}
                    </Text>
                  </View>
                </View>
              ))}
            </View>

            {/* Intelligent Farming Advisories */}
            {advisories.length > 0 && (
              <>
                <Text style={styles.sectionTitle}>{t("weather.advisories")}</Text>
                {advisories.map((advisory, index) => (
                  <View 
                    key={index} 
                    style={[
                      styles.advisoryCard,
                      { borderLeftColor: advisory.color, borderLeftWidth: 4 }
                    ]}
                  >
                    <View style={styles.advisoryHeader}>
                      <Ionicons name={advisory.icon as any} size={24} color={advisory.color} />
                      <View style={styles.advisoryHeaderText}>
                        <Text style={styles.advisoryTitle}>{t(advisory.titleKey)}</Text>
                        <Text style={[
                          styles.advisoryPriority,
                          { color: getPriorityColor(advisory.priority) }
                        ]}>
                          {t(`weather.priority.${advisory.priority}`)}
                        </Text>
                      </View>
                    </View>
                    <Text style={styles.advisoryMessage}>{t(advisory.messageKey)}</Text>
                    <View style={styles.advisoryCategory}>
                      <Text style={styles.advisoryCategoryText}>
                        {t(`weather.categories.${advisory.category}`)}
                      </Text>
                    </View>
                  </View>
                ))}
              </>
            )}
          </>
        )}
      </ScrollView>
    </SafeAreaView>
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
  advisoryCard: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
  },
  advisoryHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
    gap: 12,
  },
  advisoryHeaderText: {
    flex: 1,
  },
  advisoryTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 4,
  },
  advisoryPriority: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  advisoryMessage: {
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 20,
    marginBottom: 12,
  },
  advisoryCategory: {
    alignSelf: 'flex-start',
    backgroundColor: Colors.background,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  advisoryCategoryText: {
    fontSize: 12,
    color: Colors.primary,
    fontWeight: '500',
  },
});