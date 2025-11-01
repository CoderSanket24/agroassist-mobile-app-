import Constants from "expo-constants";
const {API_BASE_URL} = Constants.expoConfig?.extra || {};

export interface CropRecommendationInput {
  nitrogen: string;
  phosphorus: string;
  potassium: string;
  temperature: string;
  humidity: string;
  ph: string;
  rainfall: string;
  state?: string;
  season?: string;
}

export interface CropRecommendation {
  recommended_crop: string;
  confidence: number;
  reasons: string[];
  alternative_crops: string[];
  farming_tips: string[];
}

// Mock data for testing (remove when your API is ready)
const MOCK_RECOMMENDATIONS: { [key: string]: CropRecommendation } = {
  rice: {
    recommended_crop: "Rice",
    confidence: 0.92,
    reasons: [
      "High humidity levels are ideal for rice cultivation",
      "Temperature range is suitable for rice growth",
      "Adequate rainfall for rice farming",
      "Soil pH is within optimal range for rice"
    ],
    alternative_crops: ["Wheat", "Sugarcane", "Cotton"],
    farming_tips: [
      "Maintain water level at 2-3 inches during growing season",
      "Apply organic fertilizers for better yield",
      "Monitor for pest attacks during monsoon",
      "Harvest when 80% of grains turn golden"
    ]
  },
  wheat: {
    recommended_crop: "Wheat",
    confidence: 0.87,
    reasons: [
      "Temperature conditions favor wheat growth",
      "Soil nutrients are adequate for wheat cultivation",
      "Moderate rainfall suitable for wheat",
      "pH level is optimal for wheat production"
    ],
    alternative_crops: ["Barley", "Mustard", "Gram"],
    farming_tips: [
      "Sow seeds at proper depth (3-4 cm)",
      "Apply nitrogen fertilizer in split doses",
      "Ensure proper drainage to prevent waterlogging",
      "Monitor for rust diseases"
    ]
  },
  corn: {
    recommended_crop: "Maize (Corn)",
    confidence: 0.89,
    reasons: [
      "Nutrient levels support corn growth",
      "Temperature is ideal for maize cultivation",
      "Rainfall pattern suits corn farming",
      "Soil conditions are favorable"
    ],
    alternative_crops: ["Sorghum", "Pearl Millet", "Sunflower"],
    farming_tips: [
      "Plant seeds 2-3 cm deep with proper spacing",
      "Apply balanced NPK fertilizer",
      "Provide adequate irrigation during tasseling",
      "Control weeds during early growth stages"
    ]
  }
};

export const getCropRecommendation = async (data: CropRecommendationInput): Promise<CropRecommendation> => {
  try {
    // For production, uncomment this and replace with your actual API endpoint
    /*
    const response = await axios.post(`${API_BASE_URL}/crop-recommendation`, {
      nitrogen: parseFloat(data.nitrogen),
      phosphorus: parseFloat(data.phosphorus),
      potassium: parseFloat(data.potassium),
      temperature: parseFloat(data.temperature),
      humidity: parseFloat(data.humidity),
      ph: parseFloat(data.ph),
      rainfall: parseFloat(data.rainfall),
      state: data.state,
      season: data.season,
    });
    
    return response.data;
    */

    // Mock implementation for testing
    await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate API delay
    
    // Simple logic to determine crop based on temperature and humidity
    const temp = parseFloat(data.temperature);
    const humidity = parseFloat(data.humidity);
    
    let recommendedCrop = 'wheat';
    
    if (humidity > 70 && temp > 25) {
      recommendedCrop = 'rice';
    } else if (temp > 20 && temp < 30 && humidity < 60) {
      recommendedCrop = 'corn';
    } else if (temp < 25) {
      recommendedCrop = 'wheat';
    }

    return MOCK_RECOMMENDATIONS[recommendedCrop] || MOCK_RECOMMENDATIONS.wheat;
    
  } catch (error) {
    console.error('Error fetching crop recommendation:', error);
    throw new Error('Failed to get crop recommendation');
  }
};

// Additional utility functions
export const validateSoilData = (data: CropRecommendationInput): string[] => {
  const errors: string[] = [];
  
  const nitrogen = parseFloat(data.nitrogen);
  const phosphorus = parseFloat(data.phosphorus);
  const potassium = parseFloat(data.potassium);
  const temperature = parseFloat(data.temperature);
  const humidity = parseFloat(data.humidity);
  const ph = parseFloat(data.ph);
  const rainfall = parseFloat(data.rainfall);

  if (isNaN(nitrogen) || nitrogen < 0 || nitrogen > 140) {
    errors.push('Nitrogen should be between 0-140 kg/ha');
  }
  
  if (isNaN(phosphorus) || phosphorus < 5 || phosphorus > 145) {
    errors.push('Phosphorus should be between 5-145 kg/ha');
  }
  
  if (isNaN(potassium) || potassium < 5 || potassium > 205) {
    errors.push('Potassium should be between 5-205 kg/ha');
  }
  
  if (isNaN(temperature) || temperature < 8 || temperature > 44) {
    errors.push('Temperature should be between 8-44°C');
  }
  
  if (isNaN(humidity) || humidity < 14 || humidity > 100) {
    errors.push('Humidity should be between 14-100%');
  }
  
  if (isNaN(ph) || ph < 3.5 || ph > 10) {
    errors.push('pH should be between 3.5-10');
  }
  
  if (isNaN(rainfall) || rainfall < 20 || rainfall > 300) {
    errors.push('Rainfall should be between 20-300mm');
  }

  return errors;
};

export const getCropsByRegion = (state: string): string[] => {
  const cropsByRegion: { [key: string]: string[] } = {
    'Punjab': ['Wheat', 'Rice', 'Maize', 'Cotton'],
    'Haryana': ['Wheat', 'Rice', 'Sugarcane', 'Cotton'],
    'Uttar Pradesh': ['Wheat', 'Rice', 'Sugarcane', 'Potato'],
    'Maharashtra': ['Cotton', 'Sugarcane', 'Soybean', 'Rice'],
    'Karnataka': ['Rice', 'Sugarcane', 'Cotton', 'Ragi'],
    'Tamil Nadu': ['Rice', 'Sugarcane', 'Cotton', 'Groundnut'],
    'Andhra Pradesh': ['Rice', 'Cotton', 'Sugarcane', 'Chili'],
    'Telangana': ['Rice', 'Cotton', 'Maize', 'Soybean'],
    'Gujarat': ['Cotton', 'Groundnut', 'Wheat', 'Rice'],
    'Rajasthan': ['Wheat', 'Mustard', 'Barley', 'Gram'],
    'Madhya Pradesh': ['Wheat', 'Rice', 'Soybean', 'Cotton'],
    'West Bengal': ['Rice', 'Jute', 'Potato', 'Wheat'],
  };
  
  return cropsByRegion[state] || ['Rice', 'Wheat', 'Maize', 'Cotton'];
};