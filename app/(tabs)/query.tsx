import { useState, useEffect, useRef } from "react";
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  ScrollView, 
  StyleSheet, 
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Alert
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { askQuery, fetchQueries } from "@/services/query";
import { formatDate } from "@/utils/date";
import { Colors } from "../../constants/Colors";
import ChatHistory from "@/components/ChatHistory";
import * as Speech from 'expo-speech';
import { Audio } from 'expo-av';

export default function QueryScreen() {
  const [query, setQuery] = useState("");
  const [history, setHistory] = useState<{ q: string; a: string; time: string }[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [permissionResponse, requestPermission] = Audio.usePermissions();

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      const res = await fetchQueries();
      setHistory(res.map((item: any) => ({ 
        q: item.question, 
        a: item.answer, 
        time: formatDate(item.created_at) 
      })));
    } catch (error) {
      console.error("Failed to load history:", error);
    }
  };

  // Voice Recording Functions
  const startRecording = async () => {
    try {
      if (permissionResponse?.status !== 'granted') {
        await requestPermission();
      }

      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );
      setRecording(recording);
      setIsRecording(true);
    } catch (err) {
      console.error('Failed to start recording', err);
      Alert.alert('Error', 'Cannot start recording. Please check microphone permissions.');
    }
  };

  const stopRecording = async () => {
    try {
      setIsRecording(false);
      setRecording(null);
      await recording!.stopAndUnloadAsync();
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
      });

      // Here you would send the audio to your backend for speech-to-text
      // For now, we'll simulate this process
      simulateSpeechToText();
      
    } catch (err) {
      console.error('Failed to stop recording', err);
    }
  };

  const simulateSpeechToText = () => {
    // Simulate API call to speech-to-text service
    setIsLoading(true);
    setTimeout(() => {
      const sampleResponses = [
        "My wheat plants have yellow spots on leaves, what should I do?",
        "How much fertilizer for tomato plants?",
        "When is the best time to harvest rice?",
        "My crops are not growing well, need advice"
      ];
      const randomQuery = sampleResponses[Math.floor(Math.random() * sampleResponses.length)];
      setQuery(randomQuery);
      setIsLoading(false);
    }, 1500);
  };

  const handleSend = async () => {
    if (!query.trim() || isLoading) return;

    setIsLoading(true);
    const timestamp = formatDate(new Date().toISOString());
    const userQuery = query;

    // Add user message immediately
    setHistory([{ q: userQuery, a: "Thinking...", time: timestamp }, ...history]);
    setQuery("");

    try {
      // Send to your FastAPI backend
      const res = await askQuery(userQuery);
      
      // Replace the "Thinking..." message with actual response
      setHistory(prev => [
        { q: userQuery, a: res.answer, time: formatDate(res.created_at) },
        ...prev.filter(item => item.a !== "Thinking...")
      ]);

      // Optional: Read response aloud
      if (res.answer) {
        Speech.speak(res.answer, {
          language: 'en', // Change based on user's language
          pitch: 1.0,
          rate: 0.8
        });
      }

    } catch (err) {
      setHistory(prev => [
        { q: userQuery, a: "Sorry, I couldn't process your request. Please try again.", time: timestamp },
        ...prev.filter(item => item.a !== "Thinking...")
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const clearInput = () => {
    setQuery("");
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={90}
    >
      <Text style={styles.title}>Ask Your Farming Question 🌱</Text>
      
      {/* Input Area */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Type or speak your crop query..."
          value={query}
          onChangeText={setQuery}
          multiline
          maxLength={500}
          editable={!isLoading}
        />
        
        {query.length > 0 && (
          <TouchableOpacity onPress={clearInput} style={styles.clearButton}>
            <Ionicons name="close-circle" size={20} color={Colors.textSecondary} />
          </TouchableOpacity>
        )}
      </View>

      {/* Voice Recording Indicator */}
      {isRecording && (
        <View style={styles.recordingIndicator}>
          <View style={styles.recordingPulse} />
          <Ionicons name="mic" size={20} color={Colors.white} />
          <Text style={styles.recordingText}>Listening... Speak now</Text>
        </View>
      )}

      {/* Action Buttons */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={[styles.button, (!query.trim() || isLoading) && styles.buttonDisabled]} 
          onPress={handleSend}
          disabled={!query.trim() || isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color={Colors.white} />
          ) : (
            <>
              <Ionicons name="send" size={16} color={Colors.white} />
              <Text style={styles.buttonText}>Send Query</Text>
            </>
          )}
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.button, styles.voiceButton, isRecording && styles.recordingButton]}
          onPress={isRecording ? stopRecording : startRecording}
          disabled={isLoading}
        >
          <Ionicons 
            name={isRecording ? "mic-off" : "mic"} 
            size={16} 
            color={Colors.white} 
          />
          <Text style={styles.buttonText}>
            {isRecording ? "Stop" : "Voice Input"}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Chat History */}
      <View style={styles.historyContainer}>
        <Text style={styles.historyTitle}>Recent Queries</Text>
          <ChatHistory history={history} />
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: Colors.background, 
    padding: 16 
  },
  title: { 
    fontSize: 22, 
    fontWeight: "bold", 
    marginBottom: 20, 
    color: Colors.primary,
    textAlign: "center"
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
    position: 'relative',
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 12,
    borderRadius: 12,
    backgroundColor: Colors.white,
    minHeight: 50,
    textAlignVertical: "top",
  },
  clearButton: {
    position: "absolute",
    right: 10,
    top: 15,
  },
  recordingIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary,
    padding: 12,
    borderRadius: 8,
    marginBottom: 15,
    gap: 8,
  },
  recordingPulse: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: Colors.white,
    opacity: 0.8,
  },
  recordingText: {
    color: Colors.white,
    fontWeight: '500',
  },
  buttonContainer: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 20,
  },
  button: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: Colors.primary,
    padding: 12,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  voiceButton: {
    backgroundColor: Colors.secondary,
  },
  recordingButton: {
    backgroundColor: "#e53935",
  },
  buttonDisabled: {
    backgroundColor: Colors.textSecondary,
    opacity: 0.6,
  },
  buttonText: {
    color: Colors.white,
    fontWeight: "600",
  },
  historyContainer: {
    flex: 1,
  },
  historyTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 12,
    color: Colors.text,
  },
  historyScroll: {
    flex: 1,
  },
});