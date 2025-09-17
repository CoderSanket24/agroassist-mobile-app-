import { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Alert
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { Ionicons } from "@expo/vector-icons";
import { askQuery, fetchQueries, speechToText, getSupportedLanguages } from "@/services/query";
import { formatDate } from "@/utils/date";
import { Colors } from "../../constants/Colors";
import ChatHistory from "@/components/ChatHistory";
import { Audio } from 'expo-av';

// Default languages as fallback
const DEFAULT_LANGUAGES = {
  'en': 'en-IN',    // English (India)
  'hi': 'hi-IN',    // Hindi
  'mr': 'mr-IN',    // Marathi
  'ta': 'ta-IN',    // Tamil
  'te': 'te-IN',    // Telugu
  'kn': 'kn-IN',    // Kannada
};

// Define TypeScript interfaces
interface LanguageMap {
  [key: string]: string;
}

interface SpeechToTextResult {
  text: string;
  success: boolean;
}

export default function QueryScreen() {
  const [query, setQuery] = useState("");
  const [history, setHistory] = useState<{ q: string; a: string; time: string }[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [permissionResponse, requestPermission] = Audio.usePermissions();
  const [languages, setLanguages] = useState<LanguageMap>({});
  const [selectedLanguage, setSelectedLanguage] = useState('en-IN');

  useEffect(() => {
    loadHistory();
    loadLanguages();
  }, []);

  const loadLanguages = async () => {
    try {
      const result = await getSupportedLanguages();
      if (result && result.languages) {
        setLanguages(result.languages);
      }
    } catch (error) {
      console.warn('Using default languages due to network error:', error);
      // Continue with default languages - this is not a critical error
      setLanguages(DEFAULT_LANGUAGES);
    }
  };

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
      Alert.alert('Error', 'Cannot start recording. Please check microphone permissions.');
    }
  };

  const stopRecording = async () => {
    try {
      setIsRecording(false);
      if (recording) {
        await recording.stopAndUnloadAsync();
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: false,
        });

        const uri = recording.getURI();
        if (uri) {
          await processAudioRecording(uri);
        }
      }
    } catch (err) {
      Alert.alert('Error', 'Failed to process recording.');
    } finally {
      setRecording(null);
    }
  };

  const processAudioRecording = async (uri: string) => {
    setIsLoading(true);
    try {
      console.log('Selected language:', selectedLanguage);
      const result = await speechToText(uri, selectedLanguage);

      setQuery(result.text);

      // Show appropriate message based on result
      if (result.is_fallback) {
        Alert.alert(
          'Demo Mode',
          'Using simulated response. Real speech recognition is working but this is a demo response.',
          [{ text: 'OK' }]
        );
      } else {
        // Success! You could show a subtle success message
        console.log('Real speech recognition successful!');
      }
    } catch (error) {
      console.error('Audio processing error:', error);
      
    } finally {
      setIsLoading(false);
    }
  };

  const handleSend = async () => {
    if (!query.trim() || isLoading) return;

    setIsLoading(true);
    const timestamp = formatDate(new Date().toISOString());
    const userQuery = query;

    setHistory([{ q: userQuery, a: "Thinking...", time: timestamp }, ...history]);
    setQuery("");

    try {
      const res = await askQuery(userQuery);
      setHistory(prev => [
        { q: userQuery, a: res.answer, time: formatDate(res.created_at) },
        ...prev.filter(item => item.a !== "Thinking...")
      ]);
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

      {/* Language Selector */}
      <View style={styles.languageSelector}>
        <Text style={styles.languageLabel}>Language:</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={selectedLanguage}
            style={styles.picker}
            onValueChange={(itemValue: string) => {
              console.log('Language selected:', itemValue);
              setSelectedLanguage(itemValue);
            }}
            dropdownIconColor={Colors.primary}
          >
            {Object.entries(languages).map(([code, googleCode]) => (
              <Picker.Item
                key={code}
                label={code.toUpperCase()}
                value={googleCode}
              />
            ))}
          </Picker>
        </View>
      </View>

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
  languageSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    backgroundColor: Colors.white,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  languageLabel: {
    marginRight: 10,
    color: Colors.text,
    fontWeight: '500',
  },
  pickerContainer: {
    flex: 1,
    borderWidth: 0,
  },
  picker: {
    height: 40,
    width: '100%',
    color: Colors.text,
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
    marginTop: 20,
  },
  historyTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 12,
    color: Colors.text,
  },
});