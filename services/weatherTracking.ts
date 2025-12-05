import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL || 'http://172.168.2.99:8000';

interface WeatherSearchData {
  latitude: number;
  longitude: number;
  location_name?: string;
  temperature?: number;
  humidity?: number;
  wind_speed?: number;
  weather_condition?: string;
  advisories_count?: number;
}

/**
 * Log a weather search to the backend
 */
export const logWeatherSearch = async (data: WeatherSearchData): Promise<boolean> => {
  const token = await AsyncStorage.getItem('authToken');
  
  if (!token) {
    console.warn('Weather tracking skipped: User not logged in');
    return false;
  }

  try {
    const response = await axios.post(
      `${API_BASE_URL}/weather/log`,
      data,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        timeout: 10000
      }
    );

    return response.data.success;
  } catch (error: any) {
    console.error('Failed to log weather search:', error.message);
    return false;
  }
};

/**
 * Get weather search history
 */
export const getWeatherHistory = async (limit: number = 10) => {
  try {
    const token = await AsyncStorage.getItem('authToken');
    if (!token) {
      return [];
    }

    const response = await axios.get(
      `${API_BASE_URL}/weather/history?limit=${limit}`,
      {
        headers: {
          'Authorization': `Bearer ${token}`
        },
        timeout: 5000
      }
    );

    return response.data.searches || [];
  } catch (error) {
    console.error('Failed to fetch weather history:', error);
    return [];
  }
};

/**
 * Get weather search statistics
 */
export const getWeatherStats = async () => {
  try {
    const token = await AsyncStorage.getItem('authToken');
    if (!token) {
      return { total_weather_searches: 0 };
    }

    const response = await axios.get(
      `${API_BASE_URL}/weather/stats`,
      {
        headers: {
          'Authorization': `Bearer ${token}`
        },
        timeout: 5000
      }
    );

    return response.data;
  } catch (error) {
    console.error('Failed to fetch weather stats:', error);
    return { total_weather_searches: 0 };
  }
};
