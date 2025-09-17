import axios from "axios";
import Constants from "expo-constants";
const { OPENWEATHER_API_KEY } = Constants.expoConfig?.extra || {};

const CURRENT_URL = "https://api.openweathermap.org/data/2.5/weather";
const FORECAST_URL = "https://api.openweathermap.org/data/2.5/forecast";

// ✅ Current weather by coordinates
export const getWeatherByCoords = async (lat: number, lon: number) => {
  try {
    const response = await axios.get(CURRENT_URL, {
      params: { lat, lon, units: "metric", appid: OPENWEATHER_API_KEY },
    });

    return {
      temp: response.data.main.temp,
      desc: response.data.weather[0].description,
      icon: response.data.weather[0].icon,
      name: response.data.name,
      humidity: response.data.main.humidity,
      pressure: response.data.main.pressure,
      windSpeed: response.data.wind.speed,
    };
  } catch (error) {
    console.error("Current Weather Error:", error);
    return null;
  }
};

// ✅ 3-day forecast by coordinates
export const getForecastByCoords = async (lat: number, lon: number) => {
  try {
    const response = await axios.get(FORECAST_URL, {
      params: { lat, lon, units: "metric", appid: OPENWEATHER_API_KEY },
    });

    // Forecast returns every 3 hours → group by day
    const daily = response.data.list.filter((_: any, index: number) => index % 8 === 0);

    return daily.slice(0, 3).map((item: any) => ({
      date: item.dt_txt.split(" ")[0],
      temp: item.main.temp,
      desc: item.weather[0].description,
      icon: item.weather[0].icon,
    }));
  } catch (error) {
    console.error("Forecast Error:", error);
    return [];
  }
};