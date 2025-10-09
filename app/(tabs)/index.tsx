import { Colors } from "@/constants/Colors";
import i18n from "@/i18n";
import { Ionicons } from "@expo/vector-icons";
import { Link } from "expo-router";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeScreen() {
  const { t } = useTranslation();
  const [showLanguageModal, setShowLanguageModal] = useState(false);

  const changeLanguage = async (lng: string) => {
    await i18n.changeLanguage(lng);
    setShowLanguageModal(false);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.background }}>
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <View style={styles.titleContainer}>
              <Text style={styles.title}>🌱 {t("appName")}</Text>
              <Text style={styles.subtitle}>{t("tagline")}</Text>
            </View>
            <TouchableOpacity
              style={styles.languageButton}
              onPress={() => setShowLanguageModal(true)}
            >
              <Ionicons name="globe-outline" size={24} color={Colors.primary} />
            </TouchableOpacity>
          </View>
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

        <Modal
          visible={showLanguageModal}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setShowLanguageModal(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>{t("lang.choose")}</Text>

              <TouchableOpacity
                style={[styles.languageOption, i18n.language === "en" && styles.languageOptionSelected]}
                onPress={() => changeLanguage("en")}
              >
                <Text style={[styles.languageOptionText, i18n.language === "en" && styles.languageOptionTextSelected]}>
                  🇺🇸 English
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.languageOption, i18n.language === "hi" && styles.languageOptionSelected]}
                onPress={() => changeLanguage("hi")}
              >
                <Text style={[styles.languageOptionText, i18n.language === "hi" && styles.languageOptionTextSelected]}>
                  🇮🇳 हिंदी
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.modalCloseButton}
                onPress={() => setShowLanguageModal(false)}
              >
                <Text style={styles.modalCloseText}>{t("common.cancel")}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
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
    paddingVertical: 20,
    marginBottom: 16,
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  titleContainer: {
    flex: 1,
    alignItems: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: Colors.primary,
    marginBottom: 8
  },
  subtitle: {
    fontSize: 16,
    color: Colors.textSecondary
  },
  languageButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: Colors.white,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
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
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 24,
    width: "80%",
    maxWidth: 300,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: Colors.text,
    textAlign: "center",
    marginBottom: 20,
  },
  languageOption: {
    padding: 16,
    borderRadius: 12,
    backgroundColor: Colors.background,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  languageOptionSelected: {
    borderColor: Colors.primary,
    backgroundColor: Colors.lightPrimary || "#e3f2fd",
  },
  languageOptionText: {
    fontSize: 16,
    color: Colors.text,
    textAlign: "center",
    fontWeight: "500",
  },
  languageOptionTextSelected: {
    color: Colors.primary,
    fontWeight: "600",
  },
  modalCloseButton: {
    marginTop: 8,
    padding: 12,
    borderRadius: 8,
  },
  modalCloseText: {
    color: Colors.textSecondary,
    textAlign: "center",
    fontSize: 16,
  },
});