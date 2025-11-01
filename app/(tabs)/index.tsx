import { Colors } from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import { Link } from "expo-router";
import { useTranslation } from "react-i18next";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeScreen() {
  const { t } = useTranslation();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.background }}>
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>🌱 {t("appName")}</Text>
          <Text style={styles.subtitle}>{t("tagline")}</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>{t("home.quickActions")}</Text>

          <Link href="/query" asChild>
            <TouchableOpacity style={styles.actionButton}>
              <View style={styles.iconContainer}>
                <Ionicons name="mic" size={24} color={Colors.white} />
              </View>
              <View style={styles.textContainer}>
                <Text style={styles.actionText}>{t("home.askQuery")}</Text>
                <Text style={styles.actionSubtext}>{t("home.askQuerySub")}</Text>
              </View>
              <Ionicons name="chevron-forward" size={24} color={Colors.text} />
            </TouchableOpacity>
          </Link>

          <Link href="/weather" asChild>
            <TouchableOpacity style={styles.actionButton}>
              <View style={[styles.iconContainer, { backgroundColor: "#4fc3f7" }]}>
                <Ionicons name="partly-sunny" size={24} color={Colors.white} />
              </View>
              <View style={styles.textContainer}>
                <Text style={styles.actionText}>{t("home.weatherForecast")}</Text>
                <Text style={styles.actionSubtext}>{t("home.weatherForecastSub")}</Text>
              </View>
              <Ionicons name="chevron-forward" size={24} color={Colors.text} />
            </TouchableOpacity>
          </Link>

          <Link href="/detection" asChild>
            <TouchableOpacity style={styles.actionButton}>
              <View style={[styles.iconContainer, { backgroundColor: "#7cb342" }]}>
                <Ionicons name="camera" size={24} color={Colors.white} />
              </View>
              <View style={styles.textContainer}>
                <Text style={styles.actionText}>{t("home.diseaseDetection")}</Text>
                <Text style={styles.actionSubtext}>{t("home.diseaseDetectionSub")}</Text>
              </View>
              <Ionicons name="chevron-forward" size={24} color={Colors.text} />
            </TouchableOpacity>
          </Link>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>{t("home.recentActivities")}</Text>
          <View style={styles.emptyState}>
            <Ionicons name="time-outline" size={40} color={Colors.text} />
            <Text style={styles.emptyStateText}>{t("home.noRecent")}</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    padding: 16
  },
  header: {
    paddingVertical: 15,
    alignItems: "center",
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: Colors.primary,
    marginBottom: 8
  },
  subtitle: {
    fontSize: 16,
    color: Colors.textSecondary
  },
  card: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 16,
    color: Colors.text,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.primary,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  textContainer: {
    flex: 1,
  },
  actionText: {
    fontSize: 16,
    fontWeight: "500",
    color: Colors.text,
    marginBottom: 4,
  },
  actionSubtext: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  emptyState: {
    paddingVertical: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyStateText: {
    marginTop: 12,
    color: Colors.textSecondary,
    fontSize: 14,
  },
});