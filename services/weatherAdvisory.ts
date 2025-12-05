/**
 * Weather Advisory Service
 * Provides intelligent farming suggestions based on weather conditions
 */

export interface WeatherConditions {
  temp: number;
  humidity: number;
  windSpeed: number;
  pressure: number;
  desc: string;
  rainfall?: number;
}

export interface ForecastDay {
  date: string;
  temp: number;
  humidity?: number;
  desc: string;
  rainfall?: number;
}

export interface Advisory {
  category: 'irrigation' | 'pest' | 'spraying' | 'harvesting';
  priority: 'high' | 'medium' | 'low';
  titleKey: string;
  messageKey: string;
  icon: string;
  color: string;
}

/**
 * Analyze weather and generate farming advisories
 */
export const generateAdvisories = (
  current: WeatherConditions,
  forecast: ForecastDay[]
): Advisory[] => {
  const advisories: Advisory[] = [];

  // 1. IRRIGATION AND WATER MANAGEMENT
  advisories.push(...getIrrigationAdvisories(current, forecast));

  // 2. PEST, DISEASE, AND FUNGUS CONTROL
  advisories.push(...getPestDiseaseAdvisories(current, forecast));

  // 3. APPLICATION AND SPRAYING EFFICACY
  advisories.push(...getSprayingAdvisories(current, forecast));

  // 4. HARVESTING AND STORAGE
  advisories.push(...getHarvestingAdvisories(current, forecast));

  // Sort by priority
  const priorityOrder = { high: 0, medium: 1, low: 2 };
  return advisories.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);
};

function getIrrigationAdvisories(
  current: WeatherConditions,
  forecast: ForecastDay[]
): Advisory[] {
  const advisories: Advisory[] = [];

  const rainfallExpected = forecast.some(day => 
    day.desc.toLowerCase().includes('rain') || 
    (day.rainfall && day.rainfall > 10)
  );

  if (rainfallExpected) {
    advisories.push({
      category: 'irrigation',
      priority: 'high',
      titleKey: 'weather.messages.stopIrrigation.title',
      messageKey: 'weather.messages.stopIrrigation.message',
      icon: 'water-outline',
      color: '#2196F3'
    });
  }

  if (current.temp > 35 && current.humidity < 40) {
    advisories.push({
      category: 'irrigation',
      priority: 'high',
      titleKey: 'weather.messages.increaseWatering.title',
      messageKey: 'weather.messages.increaseWatering.message',
      icon: 'sunny-outline',
      color: '#FF5722'
    });
  }

  const recentRain = current.desc.toLowerCase().includes('rain');
  if (recentRain && current.humidity > 70) {
    advisories.push({
      category: 'irrigation',
      priority: 'medium',
      titleKey: 'weather.messages.checkDrainage.title',
      messageKey: 'weather.messages.checkDrainage.message',
      icon: 'water',
      color: '#00BCD4'
    });
  }

  return advisories;
}

function getPestDiseaseAdvisories(
  current: WeatherConditions,
  forecast: ForecastDay[]
): Advisory[] {
  const advisories: Advisory[] = [];

  const highHumidityDays = forecast.filter(day => 
    (day.humidity && day.humidity > 70) || 
    day.desc.toLowerCase().includes('cloud')
  ).length;

  if (current.humidity > 70 && highHumidityDays >= 2) {
    advisories.push({
      category: 'pest',
      priority: 'high',
      titleKey: 'weather.messages.fungicideAlert.title',
      messageKey: 'weather.messages.fungicideAlert.message',
      icon: 'warning-outline',
      color: '#FF9800'
    });
  }

  const avgForecastTemp = forecast.reduce((sum, day) => sum + day.temp, 0) / forecast.length;
  if (current.temp - avgForecastTemp > 5) {
    advisories.push({
      category: 'pest',
      priority: 'medium',
      titleKey: 'weather.messages.coldStress.title',
      messageKey: 'weather.messages.coldStress.message',
      icon: 'snow-outline',
      color: '#3F51B5'
    });
  }

  const clearDays = forecast.filter(day => 
    day.desc.toLowerCase().includes('clear') || 
    day.desc.toLowerCase().includes('sun')
  ).length;

  if (clearDays >= 2 && current.humidity < 50) {
    advisories.push({
      category: 'pest',
      priority: 'low',
      titleKey: 'weather.messages.pestInspection.title',
      messageKey: 'weather.messages.pestInspection.message',
      icon: 'bug-outline',
      color: '#8BC34A'
    });
  }

  return advisories;
}

function getSprayingAdvisories(
  current: WeatherConditions,
  forecast: ForecastDay[]
): Advisory[] {
  const advisories: Advisory[] = [];

  if (current.windSpeed > 15) {
    advisories.push({
      category: 'spraying',
      priority: 'high',
      titleKey: 'weather.messages.postponeSpraying.title',
      messageKey: 'weather.messages.postponeSpraying.message',
      icon: 'flag-outline',
      color: '#F44336'
    });
  }

  const imminentRain = forecast.length > 0 && 
    forecast[0].desc.toLowerCase().includes('rain');

  if (imminentRain) {
    advisories.push({
      category: 'spraying',
      priority: 'high',
      titleKey: 'weather.messages.doNotSpray.title',
      messageKey: 'weather.messages.doNotSpray.message',
      icon: 'close-circle-outline',
      color: '#F44336'
    });
  }

  const noRainSoon = !imminentRain;
  const lowWind = current.windSpeed < 10;
  
  if (noRainSoon && lowWind) {
    advisories.push({
      category: 'spraying',
      priority: 'low',
      titleKey: 'weather.messages.bestTimeSpray.title',
      messageKey: 'weather.messages.bestTimeSpray.message',
      icon: 'checkmark-circle-outline',
      color: '#4CAF50'
    });
  }

  return advisories;
}

function getHarvestingAdvisories(
  current: WeatherConditions,
  forecast: ForecastDay[]
): Advisory[] {
  const advisories: Advisory[] = [];

  const heavyRainSoon = forecast.slice(0, 2).some(day => 
    day.desc.toLowerCase().includes('rain') || 
    day.desc.toLowerCase().includes('storm') ||
    day.desc.toLowerCase().includes('thunder')
  );

  if (heavyRainSoon) {
    advisories.push({
      category: 'harvesting',
      priority: 'high',
      titleKey: 'weather.messages.accelerateHarvest.title',
      messageKey: 'weather.messages.accelerateHarvest.message',
      icon: 'alert-circle-outline',
      color: '#FF5722'
    });
  }

  const recentRain = current.desc.toLowerCase().includes('rain') || 
                     current.desc.toLowerCase().includes('drizzle');
  
  if (recentRain && current.humidity > 70) {
    advisories.push({
      category: 'harvesting',
      priority: 'medium',
      titleKey: 'weather.messages.checkMoisture.title',
      messageKey: 'weather.messages.checkMoisture.message',
      icon: 'cube-outline',
      color: '#FF9800'
    });
  }

  return advisories;
}

export const getPriorityColor = (priority: 'high' | 'medium' | 'low'): string => {
  switch (priority) {
    case 'high': return '#F44336';
    case 'medium': return '#FF9800';
    case 'low': return '#4CAF50';
  }
};
