import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import Constants from "expo-constants";

const OPENWEATHER_API_KEY = Constants.expoConfig?.extra?.OPENWEATHER_API_KEY;
const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL || 'http://172.168.2.99:8000';

export interface DashboardStats {
  totalQueries: number;
  totalDetections: number;
  weatherChecks: number;
}

export interface WeatherData {
  temperature: number;
  condition: string;
  humidity: number;
}

export interface SeasonalTrend {
  crops: string[];
  season: string;
}

// Get user statistics
export const getUserStats = async (): Promise<DashboardStats> => {
  try {
    const token = await AsyncStorage.getItem('authToken');
    const user = await AsyncStorage.getItem('user');
    
    if (!token || !user) {
      return { totalQueries: 0, totalDetections: 0, weatherChecks: 0 };
    }

    const userData = JSON.parse(user);
    const userId = userData.id;

    const response = await axios.get(`${API_BASE_URL}/dashboard/stats?user_id=${userId}`, {
      headers: { Authorization: `Bearer ${token}` },
      timeout: 5000
    });

    return response.data;
  } catch (error) {
    console.log('getUserStats error:', error);
    // Backend not available, return defaults
    return { totalQueries: 0, totalDetections: 0, weatherChecks: 0 };
  }
};

// Get current weather (simplified)
export const getCurrentWeather = async (latitude?: number, longitude?: number): Promise<WeatherData | null> => {
  try {
    if (!OPENWEATHER_API_KEY) {
      // Return default weather if no API key
      return {
        temperature: 28,
        condition: 'Clear',
        humidity: 65
      };
    }

    // Use provided coordinates or default location
    const lat = latitude || 19.0760; // Default: Mumbai
    const lon = longitude || 72.8777;

    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${OPENWEATHER_API_KEY}`,
      { timeout: 8000 }
    );

    return {
      temperature: Math.round(response.data.main.temp),
      condition: response.data.weather[0].main,
      humidity: response.data.main.humidity
    };
  } catch (error) {
    // Return default weather on error
    return {
      temperature: 28,
      condition: 'Clear',
      humidity: 65
    };
  }
};

// Get seasonal crop trends
export const getSeasonalTrends = async (language: string = 'en'): Promise<SeasonalTrend> => {
  try {
    const token = await AsyncStorage.getItem('authToken');
    const user = await AsyncStorage.getItem('user');
    
    if (token && user) {
      const userData = JSON.parse(user);
      const userId = userData.id;
      
      const response = await axios.get(`${API_BASE_URL}/dashboard/seasonal-trends`, {
        params: { user_id: userId, language },
        headers: { Authorization: `Bearer ${token}` },
        timeout: 5000
      });
      return response.data;
    }
  } catch (error) {
    console.log('getSeasonalTrends error:', error);
    // Backend not available, use fallback
  }

  // Fallback: Determine season-based crops
  const month = new Date().getMonth();
  
  // Kharif season (June-October)
  if (month >= 5 && month <= 9) {
    return {
      crops: ['Rice', 'Cotton', 'Maize'],
      season: 'Kharif'
    };
  }
  // Rabi season (November-March)
  else if (month >= 10 || month <= 2) {
    return {
      crops: ['Wheat', 'Barley', 'Mustard'],
      season: 'Rabi'
    };
  }
  // Zaid season (March-June)
  else {
    return {
      crops: ['Watermelon', 'Cucumber', 'Vegetables'],
      season: 'Zaid'
    };
  }
};

// Get water/irrigation status
export const getIrrigationStatus = async (language: string = 'en'): Promise<string> => {
  try {
    const token = await AsyncStorage.getItem('authToken');
    const user = await AsyncStorage.getItem('user');
    
    if (token && user) {
      const userData = JSON.parse(user);
      const userId = userData.id;
      
      const response = await axios.get(`${API_BASE_URL}/dashboard/irrigation-status`, {
        params: { user_id: userId, language },
        headers: { Authorization: `Bearer ${token}` },
        timeout: 5000
      });
      return response.data.status;
    }
  } catch (error) {
    console.log('getIrrigationStatus error:', error);
    // Backend not available, use fallback
  }

  // Fallback: Check recent weather
  try {
    const weather = await getCurrentWeather();
    if (weather) {
      if (weather.humidity > 70) {
        return 'Good';
      } else if (weather.humidity > 50) {
        return 'Moderate';
      } else {
        return 'Low';
      }
    }
  } catch (error) {
    // Weather API also failed
  }

  return 'Optimal';
};

// Get recent activity count
export const getRecentActivityCount = async (): Promise<number> => {
  try {
    const token = await AsyncStorage.getItem('authToken');
    const user = await AsyncStorage.getItem('user');
    
    if (token && user) {
      const userData = JSON.parse(user);
      const userId = userData.id;
      
      const response = await axios.get(`${API_BASE_URL}/dashboard/recent-activity?user_id=${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
        timeout: 5000
      });
      return response.data.count || 0;
    }
  } catch (error) {
    console.log('getRecentActivityCount error:', error);
    // Backend not available
  }

  return 0;
};

// Get farming tip of the day
export const getTipOfTheDay = async (language: string = 'en'): Promise<string | null> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/dashboard/tip-of-day`, {
      params: { language },
      timeout: 5000
    });
    return response.data.tip;
  } catch (error) {
    // Backend not available, will use default tip
    return null;
  }
};
