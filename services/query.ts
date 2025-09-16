import axios from "axios";
import { Constants } from "expo-constants";

const API_BASE_URL = "http://172.168.2.99:8000";

export const askQuery = async (question: string) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/ask`, { question });
    return response.data; // { id, question, answer, created_at }
  } catch (error) {
    console.error("Error in askQuery:", error);
    throw error;
  }
};

export const fetchQueries = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/queries`);
    return response.data; // array of queries
  } catch (error) {
    console.error("Error in fetchQueries:", error);
    throw error;
  }
};

export const speechToText = async (audioUri: string, language: string = 'en-IN'): Promise<{ text: string; success: boolean }> => {
  try {
    console.log('Processing speech-to-text for:', audioUri);
    
    // First, check if backend is reachable
    const isBackendAvailable = await testBackendConnection();
    if (!isBackendAvailable) {
      console.log('Backend not available, using mock data');
      return getMockResponse(language, false);
    }

    // Create FormData
    const formData = new FormData();
    
    // @ts-ignore - React Native specific file object
    formData.append('file', {
      uri: audioUri,
      type: 'audio/m4a',
      name: 'recording.m4a',
    });
    
    formData.append('language', language);

    // Use AbortController for timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 second timeout

    const response = await fetch(`${API_BASE_URL}/stt`, {
      method: 'POST',
      body: formData,
      headers: {
        'Accept': 'application/json',
      },
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      console.warn('Server responded with error, using mock data');
      return getMockResponse(language, false);
    }

    const result = await response.json();
    
    if (result.success && result.text) {
      return { text: result.text, success: true };
    } else {
      console.warn('Server response indicates failure, using mock data');
      return getMockResponse(language, false);
    }

  } catch (error) {
    console.error('Speech to text error, using mock data:', error);
    return getMockResponse(language, false);
  }
};

const getMockResponse = (language: string, success: boolean = false): { text: string; success: boolean } => {
  const mockResponses: { [key: string]: string } = {
    'en-IN': 'My wheat plants have yellow spots on leaves, what should I do?',
    'hi-IN': 'मेरे गेहूं के पौधों की पत्तियों पर पीले धब्बे हैं, मैं क्या करूं?',
    'mr-IN': 'माझ्या गहू च्या झाडांच्या पानावर पिवळे डाग आहेत, मी काय करू?',
    'ta-IN': 'என் கோதுமை செடிகளின் இலைகளில் மஞ்சள் புள்ளிகள் உள்ளன, நான் என்ன செய்ய வேண்டும்?',
    'te-IN': 'నా గోధుమ పంటల యొక్క ఆకులపై పసుపు మచ్చలు ఉన్నాయి, నేను ఏమి చేయాలి?',
    'kn-IN': 'ನನ್ನ ಗೋಧಿ ಬೆಳೆಗಳ ಎಲೆಗಳ ಮೇಲೆ ಹಳದಿ ಚುಕ್ಕೆಗಳು ಇವೆ, ನಾನು ಏನು ಮಾಡಬೇಕು?',
  };
  
  const text = mockResponses[language] || mockResponses['en-IN'];
  
  return { text, success };
};

// Test backend connection
export const testBackendConnection = async (): Promise<boolean> => {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);
    
    const response = await fetch(`${API_BASE_URL}/supported-languages`, {
      method: 'GET',
      headers: { 'Accept': 'application/json' },
      signal: controller.signal,
    });
    
    clearTimeout(timeoutId);
    return response.ok;
  } catch (error) {
    console.log('Backend connection test failed:', error);
    return false;
  }
};


// Add language support
const fetchWithTimeout = async (url: string, options: RequestInit = {}, timeout = 5000) => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    throw error;
  }
};

export const getSupportedLanguages = async (): Promise<{ languages: { [key: string]: string } }> => {
  try {
    const response = await fetchWithTimeout(`${API_BASE_URL}/supported-languages`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    }, 5000); // 5 second timeout

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.warn('Failed to fetch languages from backend, using defaults:', error);
    
    // Return default languages as fallback
    return { 
      languages: {
        'en': 'en-IN',    // English (India)
        'hi': 'hi-IN',    // Hindi
        'mr': 'mr-IN',    // Marathi
        'ta': 'ta-IN',    // Tamil
        'te': 'te-IN',    // Telugu
        'kn': 'kn-IN',    // Kannada
        'ml': 'ml-IN',    // Malayalam
        'bn': 'bn-IN',    // Bengali
        'gu': 'gu-IN',    // Gujarati
        'pa': 'pa-IN',    // Punjabi
      }
    };
  }
};