import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image } from "react-native";
import { Link } from "expo-router";
import { Colors } from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeScreen() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.background }}>
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>🌱 AgroAssist</Text>
        <Text style={styles.subtitle}>Your smart farming assistant</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Quick Actions</Text>
        
        <Link href="/query" asChild>
          <TouchableOpacity style={styles.actionButton}>
            <View style={styles.iconContainer}>
              <Ionicons name="mic" size={24} color={Colors.white} />
            </View>
            <View style={styles.textContainer}>
              <Text style={styles.actionText}>Ask a Query</Text>
              <Text style={styles.actionSubtext}>Voice or text assistance</Text>
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
              <Text style={styles.actionText}>Weather Forecast</Text>
              <Text style={styles.actionSubtext}>7-day forecast for your area</Text>
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
              <Text style={styles.actionText}>Disease Detection</Text>
              <Text style={styles.actionSubtext}>Scan plant leaves</Text>
            </View>
            <Ionicons name="chevron-forward" size={24} color={Colors.text} />
          </TouchableOpacity>
        </Link>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Recent Activities</Text>
        <View style={styles.emptyState}>
          <Ionicons name="time-outline" size={40} color={Colors.text} />
          <Text style={styles.emptyStateText}>No recent activities</Text>
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
    paddingVertical: 20,
    alignItems: "center",
    marginBottom: 16,
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