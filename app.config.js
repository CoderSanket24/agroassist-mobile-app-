import 'dotenv/config';

export default ({ config }) => ({
  ...config,
  extra: {
    OPENWEATHER_API_KEY: process.env.OPENWEATHER_API_KEY,
    API_BASE_URL: process.env.API_BASE_URL,
    eas: {
      projectId: "2efcd939-0431-4af3-9b3c-1bfb9fb493ea"
    }
  },
});
