import { Colors } from "@/constants/Colors";
import i18n from "@/i18n";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const LANG_KEY = "app_language";

export default function LanguageScreen() {
  const [selected, setSelected] = useState<string>(i18n.language || "en");

  useEffect(() => {
    // Ensure i18n has current language on mount
    setSelected(i18n.language || "en");
  }, []);

  const setLanguage = async (lng: string) => {
    setSelected(lng);
    await i18n.changeLanguage(lng);
  };

  const handleContinue = async () => {
    await AsyncStorage.setItem(LANG_KEY, selected);
    // Navigate to root; stack will redirect to tabs or login
    router.replace("/");
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.background }}>
      <View style={styles.container}>
        <Text style={styles.title}>{i18n.t("lang.choose")}</Text>

        <TouchableOpacity
          style={[styles.option, selected === "en" && styles.optionSelected]}
          onPress={() => setLanguage("en")}
        >
          <Text style={[styles.optionText, selected === "en" && styles.optionTextSelected]}>
            {i18n.t("lang.english")}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.option, selected === "hi" && styles.optionSelected]}
          onPress={() => setLanguage("hi")}
        >
          <Text style={[styles.optionText, selected === "hi" && styles.optionTextSelected]}>
            {i18n.t("lang.hindi")}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.option, selected === "mr" && styles.optionSelected]}
          onPress={() => setLanguage("mr")}
        >
          <Text style={[styles.optionText, selected === "mr" && styles.optionTextSelected]}>
            {i18n.t("lang.marathi")}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.continue} onPress={handleContinue}>
          <Text style={styles.continueText}>{i18n.t("lang.continue")}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    gap: 16,
    justifyContent: "center",
  },
  title: {
    fontSize: 24,
    textAlign: "center",
    color: Colors.primary,
    fontWeight: "700",
    marginBottom: 16,
  },
  option: {
    padding: 16,
    borderRadius: 12,
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  optionSelected: {
    borderColor: Colors.primary,
    backgroundColor: Colors.lightPrimary,
  },
  optionText: {
    fontSize: 16,
    color: Colors.text,
    textAlign: "center",
    fontWeight: "500",
  },
  optionTextSelected: {
    color: Colors.primary,
    fontWeight: "700",
  },
  continue: {
    marginTop: 8,
    backgroundColor: Colors.primary,
    padding: 16,
    borderRadius: 12,
  },
  continueText: {
    color: Colors.white,
    textAlign: "center",
    fontWeight: "700",
  },
});


