import { useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import axios from "axios";
import { Colors } from "../../constants/Colors";
import { Ionicons } from "@expo/vector-icons";

// Mock data for demonstration (remove when your API is ready)
const MOCK_DISEASE_DATA = {
  disease: "Tomato Blight",
  confidence: 0.87,
  treatment: "Apply copper-based fungicides and remove affected leaves. Ensure proper spacing between plants for air circulation.",
  prevention: "Water plants at the base, avoid overhead watering. Rotate crops annually.",
  organic: "Use baking soda spray (1 tbsp baking soda, 1 tsp vegetable oil, 1 gallon water)."
};

export default function DetectionScreen() {
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{
    disease: string;
    confidence: number;
    treatment?: string;
    prevention?: string;
    organic?: string;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const pickImage = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission required', 'Please allow access to your photos to select images.');
        return;
      }

      const res = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!res.canceled) {
        setImage(res.assets[0].uri);
        setResult(null);
        setError(null);
      }
    } catch (err) {
      Alert.alert('Error', 'Failed to pick image. Please try again.');
    }
  };

  const takePhoto = async () => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission required', 'Please allow camera access to take photos.');
        return;
      }

      const res = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!res.canceled) {
        setImage(res.assets[0].uri);
        setResult(null);
        setError(null);
      }
    } catch (err) {
      Alert.alert('Error', 'Failed to take photo. Please try again.');
    }
  };

  const handleDetect = async () => {
    if (!image) return;

    setLoading(true);
    setError(null);
    
    // For demo purposes, we'll use mock data
    // Remove this setTimeout when your API is ready
    // setTimeout(() => {
    //   setResult(MOCK_DISEASE_DATA);
    //   setLoading(false);
    // }, 2000);

    // Uncomment this when your API is ready
    
    const formData = new FormData();
    formData.append("file", {
      uri: image,
      type: "image/jpeg",
      name: "photo.jpg",
    } as any);

    try {
      const res = await axios.post("http://172.168.2.99:8000/detect-disease", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        timeout: 30000, // 30 second timeout
      });
      setResult(res.data);
    } catch (err) {
      console.error("Detection failed", err);
      setError("Failed to detect disease. Please try again.");
      setResult(null);
    } finally {
      setLoading(false);
    }
    
  };

  const resetDetection = () => {
    setImage(null);
    setResult(null);
    setError(null);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Crop Disease Detection 🌱</Text>
      <Text style={styles.subtitle}>Identify plant diseases and get treatment recommendations</Text>

      {!image ? (
        <View style={styles.uploadSection}>
          <View style={styles.instructionBox}>
            <Ionicons name="information-circle" size={24} color={Colors.primary} />
            <Text style={styles.instructionText}>
              Take a clear photo of the affected plant leaves for accurate detection
            </Text>
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity style={[styles.actionButton, styles.cameraButton]} onPress={takePhoto}>
              <Ionicons name="camera" size={24} color={Colors.white} />
              <Text style={styles.buttonText}>Take Photo</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.actionButton, styles.galleryButton]} onPress={pickImage}>
              <Ionicons name="images" size={24} color={Colors.white} />
              <Text style={styles.buttonText}>Choose from Gallery</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <View style={styles.previewSection}>
          <Image source={{ uri: image }} style={styles.image} resizeMode="contain" />
          
          <View style={styles.actionRow}>
            <TouchableOpacity style={styles.secondaryButton} onPress={resetDetection}>
              <Ionicons name="close" size={20} color={Colors.text} />
              <Text style={styles.secondaryButtonText}>Choose Different</Text>
            </TouchableOpacity>
            
            {!loading && (
              <TouchableOpacity style={styles.primaryButton} onPress={handleDetect}>
                <Ionicons name="search" size={20} color={Colors.white} />
                <Text style={styles.primaryButtonText}>Detect Disease</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      )}

      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text style={styles.loadingText}>Analyzing image...</Text>
        </View>
      )}

      {error && (
        <View style={styles.errorBox}>
          <Ionicons name="warning" size={24} color={Colors.error} />
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}

      {result && (
        <View style={styles.resultContainer}>
          <Text style={styles.resultTitle}>Detection Results</Text>
          
          <View style={styles.resultCard}>
            <View style={styles.diseaseHeader}>
              <Ionicons name="leaf" size={24} color={Colors.primary} />
              <Text style={styles.diseaseName}>{result.disease}</Text>
              <View style={styles.confidenceBadge}>
                <Text style={styles.confidenceText}>{(result.confidence * 100).toFixed(0)}% confident</Text>
              </View>
            </View>

            {result.treatment && (
              <View style={styles.infoSection}>
                <Text style={styles.sectionTitle}>Recommended Treatment</Text>
                <Text style={styles.sectionText}>{result.treatment}</Text>
              </View>
            )}

            {result.prevention && (
              <View style={styles.infoSection}>
                <Text style={styles.sectionTitle}>Prevention Tips</Text>
                <Text style={styles.sectionText}>{result.prevention}</Text>
              </View>
            )}

            {result.organic && (
              <View style={styles.infoSection}>
                <Text style={styles.sectionTitle}>Organic Solution</Text>
                <Text style={styles.sectionText}>{result.organic}</Text>
              </View>
            )}
          </View>

          <TouchableOpacity style={styles.newDetectionButton} onPress={resetDetection}>
            <Ionicons name="add" size={20} color={Colors.white} />
            <Text style={styles.newDetectionText}>New Detection</Text>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: Colors.background,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    color: Colors.primary,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    textAlign: "center",
    color: Colors.textSecondary,
    marginBottom: 24,
  },
  uploadSection: {
    alignItems: "center",
    marginTop: 20,
  },
  instructionBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.lightPrimary,
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
    gap: 12,
  },
  instructionText: {
    flex: 1,
    color: Colors.text,
    fontSize: 14,
    lineHeight: 20,
  },
  buttonContainer: {
    width: "100%",
    gap: 16,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    borderRadius: 12,
    gap: 12,
  },
  cameraButton: {
    backgroundColor: Colors.primary,
  },
  galleryButton: {
    backgroundColor: Colors.secondary,
  },
  buttonText: {
    color: Colors.white,
    fontWeight: "600",
    fontSize: 16,
  },
  previewSection: {
    marginTop: 20,
  },
  image: {
    width: "100%",
    height: 300,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  actionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 16,
    gap: 12,
  },
  primaryButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.primary,
    padding: 12,
    borderRadius: 8,
    gap: 8,
  },
  primaryButtonText: {
    color: Colors.white,
    fontWeight: "600",
  },
  secondaryButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.lightGray,
    padding: 12,
    borderRadius: 8,
    gap: 8,
  },
  secondaryButtonText: {
    color: Colors.text,
    fontWeight: "500",
  },
  loadingContainer: {
    alignItems: "center",
    marginTop: 40,
    gap: 12,
  },
  loadingText: {
    color: Colors.textSecondary,
    fontSize: 16,
  },
  errorBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.lightError,
    padding: 16,
    borderRadius: 12,
    marginTop: 20,
    gap: 12,
  },
  errorText: {
    flex: 1,
    color: Colors.error,
    fontSize: 14,
  },
  resultContainer: {
    marginTop: 20,
  },
  resultTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: Colors.text,
    marginBottom: 16,
  },
  resultCard: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  diseaseHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    gap: 12,
  },
  diseaseName: {
    flex: 1,
    fontSize: 18,
    fontWeight: "bold",
    color: Colors.text,
  },
  confidenceBadge: {
    backgroundColor: Colors.lightPrimary,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  confidenceText: {
    color: Colors.primary,
    fontSize: 12,
    fontWeight: "600",
  },
  infoSection: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.text,
    marginBottom: 8,
  },
  sectionText: {
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 20,
  },
  newDetectionButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.secondary,
    padding: 16,
    borderRadius: 12,
    marginTop: 20,
    gap: 8,
  },
  newDetectionText: {
    color: Colors.white,
    fontWeight: "600",
    fontSize: 16,
  },
  lightGray: {
    backgroundColor: "#f5f5f5",
  },
  lightPrimary: {
    backgroundColor: "#e8f5e9",
  },
  lightError: {
    backgroundColor: "#ffebee",
  },
});