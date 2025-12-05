import { Colors } from "@/constants/Colors";
import { getCurrentUser } from "@/services/auth";
import {
  getCurrentWeather,
  getIrrigationStatus,
  getRecentActivityCount,
  getSeasonalTrends,
  getTipOfTheDay
} from "@/services/dashboard";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { ActivityIndicator, Animated, Dimensions, RefreshControl, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  const { t, i18n } = useTranslation();
  const router = useRouter();
  const [fadeAnim] = useState(new Animated.Value(0));
  const [slideAnim] = useState(new Animated.Value(50));
  
  const [userName, setUserName] = useState<string>('Farmer');
  const [weather, setWeather] = useState<{ temp: number; condition: string } | null>(null);
  const [seasonalCrops, setSeasonalCrops] = useState<string>('');
  const [irrigationStatus, setIrrigationStatus] = useState<string>('');
  const [recentActivity, setRecentActivity] = useState<number>(0);
  const [tipOfDay, setTipOfDay] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadDashboardData = async () => {
    try {
      // Get user info first
      const user = await getCurrentUser();
      if (user) {
        setUserName(user.name || 'Farmer');
      }

      const currentLanguage = i18n.language || 'en';

      const [weatherData, trends, irrigation, activity, tip] = await Promise.all([
        getCurrentWeather(),
        getSeasonalTrends(currentLanguage),
        getIrrigationStatus(currentLanguage),
        getRecentActivityCount(),
        getTipOfTheDay(currentLanguage)
      ]);

      if (weatherData) {
        setWeather({ temp: weatherData.temperature, condition: weatherData.condition });
      }

      if (trends) {
        setSeasonalCrops(trends.crops.slice(0, 2).join(' & '));
      }

      setIrrigationStatus(irrigation);
      setRecentActivity(activity);
      
      if (tip) {
        setTipOfDay(tip);
      }
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 20,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  // Load data when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      loadDashboardData();
    }, [])
  );

  const onRefresh = () => {
    setRefreshing(true);
    loadDashboardData();
  };

  const farmingTips = [
    {
      id: 1,
      icon: "leaf",
      title: t("home.tip1Title"),
      description: t("home.tip1Desc"),
      color: "#4CAF50",
    },
    {
      id: 2,
      icon: "water",
      title: t("home.tip2Title"),
      description: t("home.tip2Desc"),
      color: "#2196F3",
    },
    {
      id: 3,
      icon: "nutrition",
      title: t("home.tip3Title"),
      description: t("home.tip3Desc"),
      color: "#FF9800",
    },
  ];

  if (isLoading) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: Colors.background }}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text style={styles.loadingText}>{t("home.loadingData")}</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.background }}>
      <ScrollView 
        style={styles.container}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[Colors.primary]}
            tintColor={Colors.primary}
          />
        }
      >
        {/* Hero Section */}
        <Animated.View 
          style={[
            styles.heroSection,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <View style={styles.heroContent}>
            <Text style={styles.greeting}>👋 {t("home.greeting")}</Text>
            <Text style={styles.heroTitle}>{userName}</Text>
            <Text style={styles.heroSubtitle}>🌱 {t("tagline")}</Text>
          </View>
          
          {/* Quick Stats Cards */}
          <View style={styles.statsContainer}>
            <TouchableOpacity 
              style={styles.statCard}
              activeOpacity={0.7}
            >
              <View style={[styles.statIconBg, { backgroundColor: '#4CAF5020' }]}>
                <Ionicons name="calendar" size={24} color="#4CAF50" />
              </View>
              <Text style={styles.statNumber}>{recentActivity}</Text>
              <Text style={styles.statLabel}>{t("home.thisWeek")}</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.statCard}
              activeOpacity={0.7}
            >
              <View style={[styles.statIconBg, { backgroundColor: '#2196F320' }]}>
                <Ionicons name="leaf" size={24} color="#2196F3" />
              </View>
              <Text style={styles.statNumber}>{seasonalCrops.split('&')[0]?.trim() || t("home.loading")}</Text>
              <Text style={styles.statLabel}>{t("home.cropSeason")}</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.statCard}
              onPress={() => router.push('/weather')}
              activeOpacity={0.7}
            >
              <View style={[styles.statIconBg, { backgroundColor: '#FF980020' }]}>
                <Ionicons name="thermometer" size={24} color="#FF9800" />
              </View>
              <Text style={styles.statNumber}>{weather ? `${weather.temp}°` : '--'}</Text>
              <Text style={styles.statLabel}>{t("home.temperature")}</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>

        {/* Farm Overview */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>{t("home.farmOverview")}</Text>
            <Ionicons name="analytics" size={20} color={Colors.primary} />
          </View>
          
          <View style={styles.overviewGrid}>
            <View style={[styles.overviewCard, { backgroundColor: '#E3F2FD' }]}>
              <Ionicons name="sunny" size={32} color="#2196F3" />
              <Text style={styles.overviewValue}>{weather ? `${weather.temp}°C` : '--'}</Text>
              <Text style={styles.overviewLabel}>{t("home.temperature")}</Text>
              <Text style={styles.overviewSubtext}>
                {weather?.condition ? (t(`home.weatherConditions.${weather.condition}`) || weather.condition) : t("home.loading")}
              </Text>
            </View>
            
            <View style={[styles.overviewCard, { backgroundColor: '#E8F5E9' }]}>
              <Ionicons name="leaf" size={32} color="#4CAF50" />
              <Text style={styles.overviewValue}>{seasonalCrops || t("home.loading")}</Text>
              <Text style={styles.overviewLabel}>{t("home.seasonCrops")}</Text>
              <Text style={styles.overviewSubtext}>{t("home.recommended")}</Text>
            </View>
            
            <View style={[styles.overviewCard, { backgroundColor: '#FFF3E0' }]}>
              <Ionicons name="water" size={32} color="#FF9800" />
              <Text style={styles.overviewValue}>{irrigationStatus || t("home.loading")}</Text>
              <Text style={styles.overviewLabel}>{t("home.irrigation")}</Text>
              <Text style={styles.overviewSubtext}>{t("home.status")}</Text>
            </View>
            
            <View style={[styles.overviewCard, { backgroundColor: '#F3E5F5' }]}>
              <Ionicons name="trending-up" size={32} color="#9C27B0" />
              <Text style={styles.overviewValue}>{recentActivity}</Text>
              <Text style={styles.overviewLabel}>{t("home.thisWeek")}</Text>
              <Text style={styles.overviewSubtext}>{t("home.activities")}</Text>
            </View>
          </View>
        </View>

        {/* Farming Tips */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>{t("home.farmingTips")}</Text>
            <Ionicons name="bulb" size={20} color={Colors.primary} />
          </View>

          {farmingTips.map((tip, index) => (
            <Animated.View
              key={tip.id}
              style={[
                {
                  opacity: fadeAnim,
                  transform: [
                    {
                      translateX: fadeAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [50, 0],
                      }),
                    },
                  ],
                },
                { marginBottom: 12 }
              ]}
            >
              <View style={styles.tipCard}>
                <View style={[styles.tipIconContainer, { backgroundColor: tip.color + '20' }]}>
                  <Ionicons name={tip.icon as any} size={24} color={tip.color} />
                </View>
                <View style={styles.tipContent}>
                  <Text style={styles.tipTitle}>{tip.title}</Text>
                  <Text style={styles.tipDescription}>{tip.description}</Text>
                </View>
              </View>
            </Animated.View>
          ))}
        </View>

        {/* Tips Section */}
        <View style={styles.section}>
          <View style={styles.tipsCard}>
            <View style={styles.tipsHeader}>
              <Ionicons name="bulb" size={24} color="#FFC107" />
              <Text style={styles.tipsTitle}>{t("home.tipOfDay")}</Text>
            </View>
            <Text style={styles.tipsText}>
              {tipOfDay || t("home.tipContent")}
            </Text>
          </View>
        </View>

        <View style={styles.bottomSpacing} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  heroSection: {
    backgroundColor: Colors.primary,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 30,
    marginBottom: 20,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
  },
  heroContent: {
    alignItems: "center",
    marginBottom: 24,
  },
  greeting: {
    fontSize: 16,
    color: Colors.white,
    opacity: 0.95,
    marginBottom: 4,
    fontWeight: "500",
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: Colors.white,
    marginBottom: 6,
  },
  heroSubtitle: {
    fontSize: 15,
    color: Colors.white,
    opacity: 0.9,
    textAlign: "center",
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 14,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statIconBg: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  statNumber: {
    fontSize: 22,
    fontWeight: "bold",
    color: Colors.text,
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 11,
    color: Colors.textSecondary,
    textAlign: "center",
    fontWeight: "500",
  },
  overviewGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  overviewCard: {
    width: (width - 52) / 2,
    borderRadius: 16,
    padding: 16,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  overviewValue: {
    fontSize: 16,
    fontWeight: "bold",
    color: Colors.text,
    marginTop: 8,
    marginBottom: 4,
    textAlign: "center",
  },
  overviewLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: Colors.text,
    marginBottom: 2,
  },
  overviewSubtext: {
    fontSize: 11,
    color: Colors.textSecondary,
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: Colors.text,
  },
  tipCard: {
    flexDirection: "row",
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  tipIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  tipContent: {
    flex: 1,
  },
  tipTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.text,
    marginBottom: 6,
  },
  tipDescription: {
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 20,
  },
  tipsCard: {
    backgroundColor: "#FFF9E6",
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: "#FFE082",
  },
  tipsHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    gap: 8,
  },
  tipsTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: Colors.text,
  },
  tipsText: {
    fontSize: 15,
    color: Colors.text,
    lineHeight: 22,
  },
  bottomSpacing: {
    height: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: Colors.textSecondary,
  },
});