import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { Colors } from "../constants/Colors";

export default function LoginScreen() {
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const { t } = useTranslation();

  const handleLogin = async () => {
    // ✅ For now, accept any phone/password
    if (phone && password) {
      await AsyncStorage.setItem("user", JSON.stringify({ phone }));
      router.replace("/(tabs)");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>👨‍🌾 {t('login.title')}</Text>
      <TextInput
        style={styles.input}
        placeholder={t('login.phonePlaceholder') as string}
        keyboardType="phone-pad"
        value={phone}
        onChangeText={setPhone}
      />
      <TextInput
        style={styles.input}
        placeholder={t('login.passwordPlaceholder') as string}
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>{t('login.login')}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: Colors.background, padding: 20 },
  title: { fontSize: 26, fontWeight: "bold", marginBottom: 30, color: Colors.primary },
  input: { width: "90%", borderWidth: 1, borderColor: Colors.primary, padding: 12, borderRadius: 10, marginBottom: 15, backgroundColor: Colors.white },
  button: { backgroundColor: Colors.primary, padding: 15, borderRadius: 12, width: "90%", alignItems: "center", marginTop: 10 },
  buttonText: { fontSize: 18, fontWeight: "bold", color: Colors.white },
});
