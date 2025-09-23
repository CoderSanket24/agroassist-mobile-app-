import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { Colors } from "../../constants/Colors";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ProfileScreen() {
  const router = useRouter();

  const handleLogout = async () => {
    await AsyncStorage.removeItem("user");
    router.replace("/login");
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.background }}>
      <View style={styles.container}>
        <Text style={styles.title}>👤 Farmer Profile</Text>
        <Text style={styles.text}>Manage your details and preferences here.</Text>

        <TouchableOpacity style={styles.button} onPress={handleLogout}>
          <Text style={styles.buttonText}>Logout</Text>
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
