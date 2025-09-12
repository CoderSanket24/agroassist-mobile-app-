import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { Colors } from "../constants/Colors";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function LoginScreen() {
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleLogin = async () => {
    // ✅ For now, accept any phone/password
    if (phone && password) {
      await AsyncStorage.setItem("user", JSON.stringify({ phone }));
      router.replace("/(tabs)");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>👨‍🌾 AgroAssist Login</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter Phone Number"
        keyboardType="phone-pad"
        value={phone}
        onChangeText={setPhone}
      />
      <TextInput
        style={styles.input}
        placeholder="Enter Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Login</Text>
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
