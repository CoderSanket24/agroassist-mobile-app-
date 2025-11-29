import { Colors } from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Animated, Dimensions, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  const { t } = useTranslation();
  const [fadeAnim] = useState(new Animated.Value(0));
  const [slideAnim] = useState(new Animated.Value(50));

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

  const insights = [
    {
      icon: "trending-up",
      title: t("home.seasonalTrends"),
      value: t("home.riceWheat"),
      color: "#4CAF50",
    },
    {
      icon: "water",
      title: t("home.waterLevel"),
      value: t("home.optimal"),
      color: "#2196F3",
    },
    {
      icon: "sunny",
      title: t("home.todayWeather"),
      value: "28°C",
      color: "#FF9800",
    },
  ];

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

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.background }}>
      <ScrollView 
        style={styles.container}
        showsVerticalScrollIndicator={false}
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
            <Text style={styles.greeting}>{t("home.greeting")}</Text>
            <Text style={styles.heroTitle}>🌱 {t("appName")}</Text>
            <Text style={styles.heroSubtitle}>{t("tagline")}</Text>
          </View>
          
          {/* Stats Cards */}
          <View style={styles.statsContainer}>
            <View style={styles.statCard}>
              <Ionicons name="leaf-outline" size={24} color={Colors.primary} />
              <Text style={styles.statNumber}>50+</Text>
              <Text style={styles.statLabel}>{t("home.crops")}</Text>
            </View>
            <View style={styles.statCard}>
              <Ionicons name="people-outline" size={24} color="#2196F3" />
              <Text style={styles.statNumber}>10K+</Text>
              <Text style={styles.statLabel}>{t("home.farmers")}</Text>
            </View>
            <View style={styles.statCard}>
              <Ionicons name="shield-checkmark-outline" size={24} color="#FF9800" />
              <Text style={styles.statNumber}>95%</Text>
              <Text style={styles.statLabel}>{t("home.accuracy")}</Text>
            </View>
          </View>
        </Animated.View>

        {/* Today's Insights */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>{t("home.todayInsights")}</Text>
            <Ionicons name="analytics" size={20} color={Colors.primary} />
          </View>

          <View style={styles.insightsContainer}>
            {insights.map((insight, index) => (
              <Animated.View
                key={index}
                style={[
                  styles.insightCard,
                  {
                    opacity: fadeAnim,
                    transform: [
                      {
                        translateY: fadeAnim.interpolate({
                          inputRange: [0, 1],
                          outputRange: [30, 0],
                        }),
                      },
                    ],
                  },
                ]}
              >
                <View style={[styles.insightIcon, { backgroundColor: insight.color + '20' }]}>
                  <Ionicons name={insight.icon as any} size={24} color={insight.color} />
                </View>
                <View style={styles.insightContent}>
                  <Text style={styles.insightTitle}>{insight.title}</Text>
                  <Text style={[styles.insightValue, { color: insight.color }]}>{insight.value}</Text>
                </View>
              </Animated.View>
            ))}
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
            <Text style={styles.tipsText}>{t("home.tipContent")}</Text>
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
  },
  heroContent: {
    alignItems: "center",
    marginBottom: 20,
  },
  greeting: {
    fontSize: 16,
    color: Colors.white,
    opacity: 0.9,
    marginBottom: 8,
  },
  heroTitle: {
    fontSize: 32,
    fontWeight: "bold",
    color: Colors.white,
    marginBottom: 8,
  },
  heroSubtitle: {
    fontSize: 16,
    color: Colors.white,
    opacity: 0.9,
    textAlign: "center",
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
  },
  statCard: {
    flex: 1,
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 16,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statNumber: {
    fontSize: 20,
    fontWeight: "bold",
    color: Colors.text,
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 4,
    textAlign: "center",
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
  insightsContainer: {
    gap: 12,
  },
  insightCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  insightIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  insightContent: {
    flex: 1,
  },
  insightTitle: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 4,
  },
  insightValue: {
    fontSize: 18,
    fontWeight: "bold",
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
});