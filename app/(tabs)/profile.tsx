import { Colors } from "@/constants/Colors";
import i18n from "@/i18n";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Alert, Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ProfileScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const [showLanguageModal, setShowLanguageModal] = useState(false);

  const changeLanguage = async (lng: string) => {
    await i18n.changeLanguage(lng);
    setShowLanguageModal(false);
  };

  const handleLogout = async () => {
    Alert.alert(
      t('profile.confirmLogout'),
      t('profile.logoutMessage'),
      [
        { text: t('common.cancel'), style: 'cancel' },
        {
          text: t('profile.logout'),
          style: 'destructive',
          onPress: async () => {
            await AsyncStorage.removeItem("user");
            router.replace("/login");
          }
        }
      ]
    );
  };

  const profileOptions = [
    {
      icon: 'person-outline',
      title: t('profile.personalInfo'),
      subtitle: t('profile.personalInfoSub'),
      onPress: () => {
        router.push('/personal-info');
      }
    },
    {
      icon: 'globe-outline',
      title: t('profile.language'),
      subtitle: `${t('profile.currentLang')}: ${i18n.language?.toUpperCase() || 'EN'}`,
      onPress: () => setShowLanguageModal(true)
    },
    {
      icon: 'notifications-outline',
      title: t('profile.notifications'),
      subtitle: t('profile.notificationsSub'),
      onPress: () => {
        // TODO: Navigate to notifications settings
        Alert.alert(t('common.comingSoon'), t('profile.featureComingSoon'));
      }
    },
    {
      icon: 'help-circle-outline',
      title: t('profile.help'),
      subtitle: t('profile.helpSub'),
      onPress: () => {
        // TODO: Navigate to help screen
        Alert.alert(t('common.comingSoon'), t('profile.featureComingSoon'));
      }
    }
  ];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.background }}>
      <ScrollView style={styles.container}>
        {/* Profile Header */}
        <View style={styles.header}>
          <View style={styles.avatarContainer}>
            <Ionicons name="person" size={40} color={Colors.white} />
          </View>
          <Text style={styles.title}>{t('profile.title')}</Text>
          <Text style={styles.subtitle}>{t('profile.subtitle')}</Text>
        </View>

        {/* Profile Options */}
        <View style={styles.optionsContainer}>
          {profileOptions.map((option, index) => (
            <TouchableOpacity
              key={index}
              style={styles.optionItem}
              onPress={option.onPress}
            >
              <View style={styles.optionIcon}>
                <Ionicons name={option.icon as any} size={24} color={Colors.primary} />
              </View>
              <View style={styles.optionContent}>
                <Text style={styles.optionTitle}>{option.title}</Text>
                <Text style={styles.optionSubtitle}>{option.subtitle}</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={Colors.textSecondary} />
            </TouchableOpacity>
          ))}
        </View>

        {/* Logout Button */}
        <View style={styles.logoutContainer}>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Ionicons name="log-out-outline" size={20} color={Colors.white} />
            <Text style={styles.logoutText}>{t('profile.logout')}</Text>
          </TouchableOpacity>
        </View>

        {/* Language Selection Modal */}
        <Modal
          visible={showLanguageModal}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setShowLanguageModal(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>{t('lang.choose')}</Text>

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
                style={[styles.languageOption, i18n.language === "mr" && styles.languageOptionSelected]}
                onPress={() => changeLanguage("mr")}
              >
                <Text style={[styles.languageOptionText, i18n.language === "mr" && styles.languageOptionTextSelected]}>
                  🇮🇳 मराठी
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.modalCloseButton}
                onPress={() => setShowLanguageModal(false)}
              >
                <Text style={styles.modalCloseText}>{t('common.cancel')}</Text>
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
  },
  header: {
    alignItems: 'center',
    padding: 24,
    marginBottom: 20,
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  optionsContainer: {
    backgroundColor: Colors.white,
    marginHorizontal: 16,
    borderRadius: 16,
    overflow: 'hidden',
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  optionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.lightPrimary || '#e3f2fd',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  optionContent: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 4,
  },
  optionSubtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  logoutContainer: {
    padding: 16,
    marginTop: 32,
  },
  logoutButton: {
    flexDirection: 'row',
    backgroundColor: '#e53935',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  logoutText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: '600',
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
