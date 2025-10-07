import { Colors } from "@/constants/Colors";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ProfileScreen() {
  const router = useRouter();
  const { t } = useTranslation();

  const handleLogout = async () => {
    await AsyncStorage.removeItem("user");
    router.replace("/login");
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.background }}>
      <View style={styles.container}>
        <Text style={styles.title}>👤 {t('profile.title')}</Text>
        <Text style={styles.text}>{t('profile.subtitle')}</Text>

        <TouchableOpacity style={styles.button} onPress={handleLogout}>
          <Text style={styles.buttonText}>{t('profile.logout')}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", padding: 20, backgroundColor: Colors.background },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 10, color: Colors.primary },
  text: { fontSize: 16, marginBottom: 20, textAlign: "center" },
  button: { backgroundColor: Colors.secondary, padding: 15, borderRadius: 12, width: "80%", alignItems: "center" },
  buttonText: { color: Colors.white, fontSize: 18, fontWeight: "bold" },
});
