import ChatHistory from "@/components/ChatHistory";
import { Colors } from "@/constants/Colors";
import i18n from "@/i18n";
import { askQuery, fetchQueries, getSupportedLanguages, speechToText } from "@/services/query";
import { formatDate } from "@/utils/date";
import { Ionicons } from "@expo/vector-icons";
import { Audio } from 'expo-av';
import * as Speech from 'expo-speech';
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

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



export default function QueryScreen() {
  const { t } = useTranslation();
  const [query, setQuery] = useState("");
  const [history, setHistory] = useState<{ q: string; a: string; time: string }[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [permissionResponse, requestPermission] = Audio.usePermissions();
  const [languages, setLanguages] = useState<LanguageMap>({});
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [currentSpeakingIndex, setCurrentSpeakingIndex] = useState<number | null>(null);

  // Get current language from i18n
  const getCurrentLanguageCode = () => {
    const currentLang = i18n.language || 'en';
    return languages[currentLang] || DEFAULT_LANGUAGES[currentLang as keyof typeof DEFAULT_LANGUAGES] || 'en-IN';
  };

  // Get TTS language code
  const getTTSLanguageCode = () => {
    const currentLang = i18n.language || 'en';
    const ttsLanguages: { [key: string]: string } = {
      'en': 'en-IN',
      'hi': 'hi-IN',
      'mr': 'mr-IN'
    };
    return ttsLanguages[currentLang] || 'en-IN';
  };

  // Text-to-Speech function
  const speakText = async (text: string, index?: number) => {
    try {
      // Stop any ongoing speech
      await Speech.stop();
      
      if (index !== undefined) {
        setCurrentSpeakingIndex(index);
      }
      setIsSpeaking(true);

      const languageCode = getTTSLanguageCode();
      
      await Speech.speak(text, {
        language: languageCode,
        pitch: 1.0,
        rate: 0.9, // Slightly slower for better comprehension
        onDone: () => {
          setIsSpeaking(false);
          setCurrentSpeakingIndex(null);
        },
        onStopped: () => {
          setIsSpeaking(false);
          setCurrentSpeakingIndex(null);
        },
        onError: () => {
          setIsSpeaking(false);
          setCurrentSpeakingIndex(null);
        }
      });
    } catch (error) {
      console.error('TTS Error:', error);
      setIsSpeaking(false);
      setCurrentSpeakingIndex(null);
    }
  };

  // Stop speech
  const stopSpeaking = async () => {
    await Speech.stop();
    setIsSpeaking(false);
    setCurrentSpeakingIndex(null);
  };

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
      Alert.alert(t('common.error'), t('query.micPermission'));
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
      Alert.alert(t('common.error'), t('query.recordingFailed'));
    } finally {
      setRecording(null);
    }
  };

  const processAudioRecording = async (uri: string) => {
    setIsLoading(true);
    try {
      const currentLanguageCode = getCurrentLanguageCode();
      console.log('Using app language:', i18n.language, '-> Speech code:', currentLanguageCode);
      const result = await speechToText(uri, currentLanguageCode);

      setQuery(result.text);

      // Show appropriate message based on result
      if (result.is_fallback) {
        Alert.alert(t('query.demoTitle'), t('query.demoDesc'), [{ text: t('common.ok') }]);
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
      const answer = res.answer;
      setHistory(prev => [
        { q: userQuery, a: answer, time: formatDate(res.created_at) },
        ...prev.filter(item => item.a !== "Thinking...")
      ]);
      
      // Automatically speak the answer
      await speakText(answer, 0);
    } catch (err) {
      const errorMsg = t('query.errorAnswer');
      setHistory(prev => [
        { q: userQuery, a: errorMsg, time: timestamp },
        ...prev.filter(item => item.a !== "Thinking...")
      ]);
      
      // Speak error message
      await speakText(errorMsg, 0);
    } finally {
      setIsLoading(false);
    }
  };

  const clearInput = () => {
    setQuery("");
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.background }}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <Text style={styles.title}>{t('query.title')}</Text>

        {/* Input Area */}
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder={t('query.placeholder') as string}
            placeholderTextColor="#888"
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
            <Text style={styles.recordingText}>{t('query.listening')}</Text>
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
                <Text style={styles.buttonText}>{t('query.send')}</Text>
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
              {isRecording ? t('query.stop') : t('query.voice')}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Chat History */}
        <View style={styles.historyContainer}>
          <Text style={styles.historyTitle}>{t('query.recent')}</Text>
          <ChatHistory 
            history={history}
            onSpeak={speakText}
            onStopSpeaking={stopSpeaking}
            isSpeaking={isSpeaking}
            currentSpeakingIndex={currentSpeakingIndex}
          />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
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
    marginBottom: 10,
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
    marginTop: 8,
  },
  historyTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 8,
    color: Colors.text,
  },
});