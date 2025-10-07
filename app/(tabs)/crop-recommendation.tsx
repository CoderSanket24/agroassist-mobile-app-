import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@/constants/Colors";
import { getCropRecommendation } from "@/services/cropRecommendation";
import { SafeAreaView } from "react-native-safe-area-context";


interface CropRecommendation {
  recommended_crop: string;
  confidence: number;
  reasons: string[];
  alternative_crops: string[];
  farming_tips: string[];
}

export default function CropRecommendationScreen() {
  const [formData, setFormData] = useState({
    nitrogen: "",
    phosphorus: "",
    potassium: "",
    temperature: "",
    humidity: "",
    ph: "",
    rainfall: "",
    state: "",
    season: "",
  });
  
  const [loading, setLoading] = useState(false);
  const [recommendation, setRecommendation] = useState<CropRecommendation | null>(null);

  const states = [
    "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
    "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka",
    "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram",
    "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu",
    "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal"
  ];

  const seasons = ["Kharif", "Rabi", "Summer"];

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const validateForm = () => {
    const requiredFields = ['nitrogen', 'phosphorus', 'potassium', 'temperature', 'humidity', 'ph', 'rainfall'];
    for (let field of requiredFields) {
      if (!formData[field as keyof typeof formData] || formData[field as keyof typeof formData] === "") {
        Alert.alert("Error", `Please fill in ${field}`);
        return false;
      }
    }
    return true;
  };

  const handleGetRecommendation = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      const result = await getCropRecommendation(formData);
      setRecommendation(result);
    } catch (error) {
      Alert.alert("Error", "Failed to get crop recommendation. Please try again.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      nitrogen: "",
      phosphorus: "",
      potassium: "",
      temperature: "",
      humidity: "",
      ph: "",
      rainfall: "",
      state: "",
      season: "",
    });
    setRecommendation(null);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.background }}>
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>🌾 Crop Recommendation</Text>
          <Text style={styles.subtitle}>Get personalized crop suggestions based on soil and climate conditions</Text>
        </View>

        <View style={styles.form}>
          <Text style={styles.sectionTitle}>Soil Nutrients (kg/ha)</Text>
          
          <View style={styles.row}>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Nitrogen (N)</Text>
              <TextInput
                style={styles.input}
                value={formData.nitrogen}
                onChangeText={(value) => handleInputChange("nitrogen", value)}
                placeholder="0-140"
                keyboardType="numeric"
              />
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Phosphorus (P)</Text>
              <TextInput
                style={styles.input}
                value={formData.phosphorus}
                onChangeText={(value) => handleInputChange("phosphorus", value)}
                placeholder="5-145"
                keyboardType="numeric"
              />
            </View>
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Potassium (K)</Text>
            <TextInput
              style={styles.input}
              value={formData.potassium}
              onChangeText={(value) => handleInputChange("potassium", value)}
              placeholder="5-205"
              keyboardType="numeric"
            />
          </View>

          <Text style={styles.sectionTitle}>Climate Conditions</Text>
          
          <View style={styles.row}>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Temperature (°C)</Text>
              <TextInput
                style={styles.input}
                value={formData.temperature}
                onChangeText={(value) => handleInputChange("temperature", value)}
                placeholder="8-44"
                keyboardType="numeric"
              />
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Humidity (%)</Text>
              <TextInput
                style={styles.input}
                value={formData.humidity}
                onChangeText={(value) => handleInputChange("humidity", value)}
                placeholder="14-100"
                keyboardType="numeric"
              />
            </View>
          </View>

          <View style={styles.row}>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>pH Level</Text>
              <TextInput
                style={styles.input}
                value={formData.ph}
                onChangeText={(value) => handleInputChange("ph", value)}
                placeholder="3.5-10"
                keyboardType="numeric"
              />
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Rainfall (mm)</Text>
              <TextInput
                style={styles.input}
                value={formData.rainfall}
                onChangeText={(value) => handleInputChange("rainfall", value)}
                placeholder="20-300"
                keyboardType="numeric"
              />
            </View>
          </View>

          <Text style={styles.sectionTitle}>Location & Season</Text>
          
          <View style={styles.pickerContainer}>
            <Text style={styles.label}>State</Text>
            <Picker
              selectedValue={formData.state}
              onValueChange={(value) => handleInputChange("state", value)}
              style={[styles.picker, { color: "#000" }]}
            >
              <Picker.Item label="Select State" value="" />
              {states.map((state) => (
                <Picker.Item key={state} label={state} value={state} />
              ))}
            </Picker>
          </View>

          <View style={styles.pickerContainer}>
            <Text style={styles.label}>Season</Text>
            <Picker
              selectedValue={formData.season}
              onValueChange={(value) => handleInputChange("season", value)}
              style={[styles.picker, { color: "#000" }]}
            >
              <Picker.Item label="Select Season" value="" />
              {seasons.map((season) => (
                <Picker.Item key={season} label={season} value={season} />
              ))}
            </Picker>
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button, styles.primaryButton]}
              onPress={handleGetRecommendation}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <>
                  <Ionicons name="search" size={20} color="#fff" />
                  <Text style={styles.buttonText}>Get Recommendation</Text>
                </>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.secondaryButton]}
              onPress={resetForm}
            >
              <Ionicons name="refresh" size={20} color={Colors.primary || "#2e7d32"} />
              <Text style={styles.secondaryButtonText}>Reset</Text>
            </TouchableOpacity>
          </View>
        </View>

        {recommendation && (
          <View style={styles.resultContainer}>
            <Text style={styles.resultTitle}>🎯 Recommendation Result</Text>
            
            <View style={styles.recommendationCard}>
              <View style={styles.cropHeader}>
                <Ionicons name="leaf" size={24} color={Colors.primary || "#2e7d32"} />
                <Text style={styles.cropName}>{recommendation.recommended_crop}</Text>
                <View style={styles.confidenceBadge}>
                  <Text style={styles.confidenceText}>
                    {Math.round(recommendation.confidence * 100)}% Match
                  </Text>
                </View>
              </View>

              <View style={styles.section}>
                <Text style={styles.sectionHeader}>📋 Why This Crop?</Text>
                {recommendation.reasons.map((reason, index) => (
                  <Text key={index} style={styles.reasonText}>• {reason}</Text>
                ))}
              </View>

              {recommendation.alternative_crops && recommendation.alternative_crops.length > 0 && (
                <View style={styles.section}>
                  <Text style={styles.sectionHeader}>🌱 Alternative Options</Text>
                  <View style={styles.alternativeContainer}>
                    {recommendation.alternative_crops.map((crop, index) => (
                      <View key={index} style={styles.alternativeCrop}>
                        <Text style={styles.alternativeText}>{crop}</Text>
                      </View>
                    ))}
                  </View>
                </View>
              )}

              <View style={styles.section}>
                <Text style={styles.sectionHeader}>💡 Farming Tips</Text>
                {recommendation.farming_tips.map((tip, index) => (
                  <Text key={index} style={styles.tipText}>• {tip}</Text>
                ))}
              </View>
            </View>
          </View>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    padding: 10
  },
  scrollView: {
    flex: 1,
  },
  header: {
    alignItems: "center",
    padding: 10,
    backgroundColor: Colors.background,
    marginBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 10,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    marginTop: 5,
  },
  form: {
    backgroundColor: "#fff",
    margin: 10,
    padding: 20,
    borderRadius: 12,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 20,
    marginBottom: 15,
    color: "#2e7d32",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
  },
  inputContainer: {
    flex: 1,
    marginBottom: 15,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 5,
    color: "#333",
  },
  input: {
    borderWidth: 1,
    borderColor: "#101010ff",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: "#e4e0e0ff",
  },
  pickerContainer: {
    marginBottom: 15,
  },
  picker: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    backgroundColor: "#f9f9f9",
  },
  buttonContainer: {
    flexDirection: "row",
    gap: 10,
    marginTop: 20,
  },
  button: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 15,
    borderRadius: 8,
    gap: 8,
  },
  primaryButton: {
    backgroundColor: "#2e7d32",
  },
  secondaryButton: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#2e7d32",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  secondaryButtonText: {
    color: "#2e7d32",
    fontSize: 16,
    fontWeight: "600",
  },
  resultContainer: {
    margin: 10,
    marginTop: 0,
  },
  resultTitle: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 15,
  },
  recommendationCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cropHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    gap: 10,
  },
  cropName: {
    fontSize: 22,
    fontWeight: "bold",
    flex: 1,
    color: "#2e7d32",
  },
  confidenceBadge: {
    backgroundColor: "#e8f5e8",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  confidenceText: {
    color: "#2e7d32",
    fontSize: 12,
    fontWeight: "600",
  },
  section: {
    marginBottom: 20,
  },
  sectionHeader: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#333",
  },
  reasonText: {
    fontSize: 14,
    lineHeight: 20,
    color: "#555",
    marginBottom: 5,
  },
  alternativeContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  alternativeCrop: {
    backgroundColor: "#f0f8f0",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#c8e6c9",
  },
  alternativeText: {
    color: "#2e7d32",
    fontSize: 14,
    fontWeight: "500",
  },
  tipText: {
    fontSize: 14,
    lineHeight: 20,
    color: "#555",
    marginBottom: 5,
  },
});