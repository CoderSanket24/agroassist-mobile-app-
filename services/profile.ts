import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import Constants from "expo-constants";
const {API_BASE_URL} = Constants.expoConfig?.extra || {};

export interface FarmerProfile {
  id?: string;
  user_id?: string;
  name: string;
  phone: string;
  village: string;
  district: string;
  state: string;
  farm_size: string;
  crop_types: string[];
  farming_experience: string;
  soil_type?: string;
  irrigation_type?: string;
}

export interface ProfileResponse {
  success: boolean;
  message: string;
  profile?: FarmerProfile;
}

// Get user profile
export const getUserProfile = async (): Promise<ProfileResponse> => {
  try {
    const token = await AsyncStorage.getItem('authToken');
    const user = await AsyncStorage.getItem('user');
    
    console.log('🔍 getUserProfile - Token exists:', !!token);
    console.log('🔍 getUserProfile - User exists:', !!user);
    
    if (!token || !user) {
      console.log('❌ Not authenticated - missing token or user');
      return {
        success: false,
        message: 'Not authenticated'
      };
    }

    const userData = JSON.parse(user);
    console.log('🔍 getUserProfile - User ID:', userData.id);
    
    // Validate user ID exists
    if (!userData.id) {
      console.log('❌ User ID not found in stored data');
      return {
        success: false,
        message: 'User ID not found'
      };
    }
    
    // Try to get from backend
    try {
      console.log('📡 Calling API:', `${API_BASE_URL}/profile/${userData.id}`);
      console.log('🔑 Token (first 20 chars):', token.substring(0, 20));
      
      const response = await axios.get(`${API_BASE_URL}/profile/${userData.id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      console.log('✅ Profile fetched successfully');
      return response.data;
    } catch (apiError: any) {
      // Handle different types of errors
      console.log('❌ API Error:', apiError.response?.status, apiError.response?.data);
      
      if (apiError.response?.status === 401) {
        console.log('🔒 Authentication failed - token may be expired');
        return {
          success: false,
          message: 'Authentication failed. Please log in again.'
        };
      }
      
      // If backend not available, return user data from local storage
      console.log('⚠️ Backend not available, using local data');
      
      // Try to get saved profile from local storage
      const savedProfile = await AsyncStorage.getItem('farmerProfile');
      const profileData = savedProfile ? JSON.parse(savedProfile) : {};
      
      return {
        success: true,
        message: 'Profile loaded from local storage',
        profile: {
          id: userData.id,
          user_id: userData.id,
          name: userData.name || '',
          phone: userData.phone || '',
          village: userData.village || '',
          district: userData.district || '',
          state: userData.state || '',
          farm_size: profileData.farm_size || '',
          crop_types: profileData.crop_types || [],
          farming_experience: profileData.farming_experience || '',
          soil_type: profileData.soil_type || '',
          irrigation_type: profileData.irrigation_type || ''
        }
      };
    }
  } catch (error: any) {
    console.error('Get profile error:', error);
    
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to fetch profile'
    };
  }
};

// Update user profile
export const updateUserProfile = async (profile: Partial<FarmerProfile>): Promise<ProfileResponse> => {
  try {
    const token = await AsyncStorage.getItem('authToken');
    const user = await AsyncStorage.getItem('user');
    
    if (!token || !user) {
      return {
        success: false,
        message: 'Not authenticated'
      };
    }

    const userData = JSON.parse(user);
    
    // Validate user ID exists
    if (!userData.id) {
      return {
        success: false,
        message: 'User ID not found'
      };
    }
    
    // Try to update on backend
    try {
      const response = await axios.put(
        `${API_BASE_URL}/profile/${userData.id}`,
        profile,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      // Update local user data if name/phone/location changed
      if (profile.name || profile.village || profile.district || profile.state) {
        const updatedUser = {
          ...userData,
          ...(profile.name && { name: profile.name }),
          ...(profile.village && { village: profile.village }),
          ...(profile.district && { district: profile.district }),
          ...(profile.state && { state: profile.state })
        };
        await AsyncStorage.setItem('user', JSON.stringify(updatedUser));
      }
      
      // Save profile data locally
      await AsyncStorage.setItem('farmerProfile', JSON.stringify(profile));
      
      return response.data;
    } catch (apiError: any) {
      // Handle authentication errors specifically
      if (apiError.response?.status === 401) {
        return {
          success: false,
          message: 'Authentication failed. Please log in again.'
        };
      }
      
      // If backend not available, save locally
      console.log('Backend not available, saving locally');
      
      // Update local user data
      if (profile.name || profile.phone || profile.village || profile.district || profile.state) {
        const updatedUser = {
          ...userData,
          ...(profile.name && { name: profile.name }),
          ...(profile.phone && { phone: profile.phone }),
          ...(profile.village && { village: profile.village }),
          ...(profile.district && { district: profile.district }),
          ...(profile.state && { state: profile.state })
        };
        await AsyncStorage.setItem('user', JSON.stringify(updatedUser));
      }
      
      // Save profile data locally
      await AsyncStorage.setItem('farmerProfile', JSON.stringify(profile));
      
      return {
        success: true,
        message: 'Profile saved locally',
        profile: {
          ...profile,
          id: userData.id,
          user_id: userData.id
        } as FarmerProfile
      };
    }
  } catch (error: any) {
    console.error('Update profile error:', error);
    
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to update profile'
    };
  }
};

// Get profile statistics
export const getProfileStats = async () => {
  try {
    const token = await AsyncStorage.getItem('authToken');
    const user = await AsyncStorage.getItem('user');
    
    console.log('🔍 getProfileStats - Token exists:', !!token);
    console.log('🔍 getProfileStats - User exists:', !!user);
    
    if (!token || !user) {
      console.log('❌ Stats: Not authenticated');
      return null;
    }

    const userData = JSON.parse(user);
    
    // Validate user ID exists
    if (!userData.id) {
      console.error('❌ Stats: User ID not found');
      return null;
    }
    
    try {
      console.log('📡 Calling stats API:', `${API_BASE_URL}/profile/${userData.id}/stats`);
      console.log('🔑 Token (first 20 chars):', token.substring(0, 20));
      
      const response = await axios.get(`${API_BASE_URL}/profile/${userData.id}/stats`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      console.log('✅ Stats fetched successfully');
      return response.data;
    } catch (apiError: any) {
      // Handle authentication errors specifically
      console.log('❌ Stats API Error:', apiError.response?.status, apiError.response?.data);
      
      if (apiError.response?.status === 401) {
        console.error('🔒 Stats: Authentication failed - token may be expired');
        return null;
      }
      
      // If backend not available, return mock stats
      console.log('⚠️ Backend not available, using mock stats');
      
      return {
        total_queries: 0,
        total_detections: 0,
        total_weather_searches: 0,
        member_since: userData.created_at || new Date().toISOString()
      };
    }
  } catch (error) {
    console.error('Get stats error:', error);
    return null;
  }
};
