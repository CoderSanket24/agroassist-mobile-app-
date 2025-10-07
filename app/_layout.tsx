import i18n from "@/i18n";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import { Colors } from "../constants/Colors";

const LANG_KEY = "app_language";

export default function RootLayout() {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);
  const [language, setLanguage] = useState<string | null>(null);

  useEffect(() => {
    const bootstrap = async () => {
      const [user, lng] = await Promise.all([
        AsyncStorage.getItem("user"),
        AsyncStorage.getItem(LANG_KEY),
      ]);
      setIsLoggedIn(!!user);
      if (lng) {
        await i18n.changeLanguage(lng);
        setLanguage(lng);
      } else {
        setLanguage(null);
      }
    };
    bootstrap();
  }, []);

  // React to language changes at runtime (e.g., after selection screen)
  useEffect(() => {
    const onLanguageChanged = (lng: string) => {
      setLanguage(lng || null);
    };
    i18n.on('languageChanged', onLanguageChanged);
    return () => {
      i18n.off('languageChanged', onLanguageChanged);
    };
  }, []);

  if (isLoggedIn === null) {
    // Loading screen while checking storage
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  return (
    <>
      <StatusBar style="light" backgroundColor={Colors.primary} />
      <Stack
        screenOptions={{
          headerShown: false,
        }}
      >
        {language ? (
          isLoggedIn ? (
            <Stack.Screen name="(tabs)" />
          ) : (
            <Stack.Screen name="login" />
          )
        ) : (
          <Stack.Screen name="language" />
        )}
      </Stack>
    </>
  );
}
