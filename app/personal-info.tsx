import { Colors } from "@/constants/Colors";
import { FarmerProfile, getProfileStats, getUserProfile, updateUserProfile } from "@/services/profile";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  ActivityIndicator,
  Alert,
  Animated,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface ProfileStats {
  total_queries: number;
  total_detections: number;
  total_weather_searches: number;
  member_since: string;
}

export default function PersonalInfoScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const [profile, setProfile] = useState<FarmerProfile>({
    name: '',
    phone: '',
    village: '',
    district: '',
    state: '',
    farm_size: '',
    crop_types: [],
    farming_experience: '',
    soil_type: '',
    irrigation_type: ''
  });
  const [stats, setStats] = useState<ProfileStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  useEffect(() => {
    loadProfile();
    
    // Entrance animation
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const loadProfile = async () => {
    setIsLoading(true);
    try {
      const [profileResponse, statsData] = await Promise.all([
        getUserProfile(),
        getProfileStats()
      ]);
      
      if (profileResponse.success && profileResponse.profile) {
        setProfile(profileResponse.profile);
      }
      
      if (statsData) {
        setStats(statsData);
      }
    } catch (error) {
      console.error('Failed to load profile:', error);
      Alert.alert(t('common.error'), 'Failed to load profile data');
    } finally {
      setIsLoading(false);
    }
  };

  const saveProfile = async () => {
    if (!profile.name.trim() || !profile.phone.trim()) {
      Alert.alert(t('common.error'), t('personalInfo.requiredFields'));
      return;
    }

    setIsSaving(true);
    try {
      const response = await updateUserProfile(profile);
      
      if (response.success) {
        Alert.alert(t('personalInfo.success'), t('personalInfo.profileSaved'), [
          { text: t('common.ok'), onPress: () => router.back() }
        ]);
      } else {
        Alert.alert(t('common.error'), response.message);
      }
    } catch (error) {
      Alert.alert(t('common.error'), t('personalInfo.saveFailed'));
    } finally {
      setIsSaving(false);
    }
  };

  const updateField = (field: keyof FarmerProfile, value: string | string[]) => {
    setProfile(prev => ({ ...prev, [field]: value }));
  };

  const formFields = [
    {
      key: 'name' as keyof FarmerProfile,
      label: t('personalInfo.name'),
      placeholder: t('personalInfo.namePlaceholder'),
      icon: 'person-outline',
      required: true,
      section: 'basic'
    },
    {
      key: 'phone' as keyof FarmerProfile,
      label: t('personalInfo.phone'),
      placeholder: t('personalInfo.phonePlaceholder'),
      icon: 'call-outline',
      keyboardType: 'phone-pad' as const,
      required: true,
      section: 'basic'
    },
    {
      key: 'village' as keyof FarmerProfile,
      label: t('personalInfo.village'),
      placeholder: t('personalInfo.villagePlaceholder'),
      icon: 'home-outline',
      section: 'location'
    },
    {
      key: 'district' as keyof FarmerProfile,
      label: t('personalInfo.district'),
      placeholder: t('personalInfo.districtPlaceholder'),
      icon: 'location-outline',
      section: 'location'
    },
    {
      key: 'state' as keyof FarmerProfile,
      label: t('personalInfo.state'),
      placeholder: t('personalInfo.statePlaceholder'),
      icon: 'map-outline',
      section: 'location'
    },
    {
      key: 'farm_size' as keyof FarmerProfile,
      label: t('personalInfo.farmSize'),
      placeholder: t('personalInfo.farmSizePlaceholder'),
      icon: 'resize-outline',
      keyboardType: 'numeric' as const,
      section: 'farming'
    },
    {
      key: 'crop_types' as keyof FarmerProfile,
      label: t('personalInfo.cropTypes'),
      placeholder: t('personalInfo.cropTypesPlaceholder'),
      icon: 'leaf-outline',
      section: 'farming'
    },
    {
      key: 'farming_experience' as keyof FarmerProfile,
      label: t('personalInfo.experience'),
      placeholder: t('personalInfo.experiencePlaceholder'),
      icon: 'time-outline',
      keyboardType: 'numeric' as const,
      section: 'farming'
    },
    {
      key: 'soil_type' as keyof FarmerProfile,
      label: t('personalInfo.soilType'),
      placeholder: t('personalInfo.soilTypePlaceholder'),
      icon: 'earth-outline',
      section: 'farming'
    },
    {
      key: 'irrigation_type' as keyof FarmerProfile,
      label: t('personalInfo.irrigationType'),
      placeholder: t('personalInfo.irrigationTypePlaceholder'),
      icon: 'water-outline',
      section: 'farming'
    }
  ];

  const renderStatsCard = (icon: string, label: string, value: string | number, color: string) => (
    <View style={[styles.statCard, { borderLeftColor: color }]}>
      <Ionicons name={icon as any} size={24} color={color} />
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );

  if (isLoading) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: Colors.background }}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text style={styles.loadingText}>{t('home.loading')}</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.background }}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={Colors.primary} />
          </TouchableOpacity>
          <Text style={styles.title}>{t('personalInfo.title')}</Text>
          <View style={styles.placeholder} />
        </View>

        <Animated.ScrollView 
          style={[styles.scrollView, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]} 
          showsVerticalScrollIndicator={false}
        >
          {/* Profile Header Card */}
          <View style={styles.profileHeader}>
            <View style={styles.avatarContainer}>
              <Ionicons name="person" size={40} color={Colors.white} />
            </View>
            <View style={styles.profileHeaderInfo}>
              <Text style={styles.profileName}>{profile.name || 'Farmer'}</Text>
              <Text style={styles.profilePhone}>{profile.phone || 'Not set'}</Text>
              {stats && (
                <Text style={styles.memberSince}>
                  Member since {new Date(stats.member_since).toLocaleDateString()}
                </Text>
              )}
            </View>
          </View>

          {/* Stats Cards */}
          {stats && (
            <View style={styles.statsContainer}>
              {renderStatsCard('chatbubbles-outline', 'Queries', stats.total_queries, '#4CAF50')}
              {renderStatsCard('scan-outline', 'Detections', stats.total_detections, '#2196F3')}
              {renderStatsCard('cloud-outline', 'Weather', stats.total_weather_searches, '#FF9800')}
            </View>
          )}

          {/* Basic Information Section */}
          <View style={styles.sectionContainer}>
            <View style={styles.sectionHeader}>
              <Ionicons name="person-circle-outline" size={24} color={Colors.primary} />
              <Text style={styles.sectionTitle}>Basic Information</Text>
            </View>
            {formFields.filter(f => f.section === 'basic').map((field) => (
              <View key={field.key} style={styles.fieldContainer}>
                <Text style={styles.fieldLabel}>
                  {field.label}
                  {field.required && <Text style={styles.required}> *</Text>}
                </Text>
                <View style={styles.inputContainer}>
                  <Ionicons 
                    name={field.icon as any} 
                    size={20} 
                    color={Colors.textSecondary} 
                    style={styles.inputIcon}
                  />
                  <TextInput
                    style={styles.input}
                    placeholder={field.placeholder}
                    placeholderTextColor={Colors.textSecondary}
                    value={profile[field.key] as string}
                    onChangeText={(value) => updateField(field.key, value)}
                    keyboardType={field.keyboardType || 'default'}
                  />
                </View>
              </View>
            ))}
          </View>

          {/* Location Section */}
          <View style={styles.sectionContainer}>
            <View style={styles.sectionHeader}>
              <Ionicons name="location-outline" size={24} color={Colors.primary} />
              <Text style={styles.sectionTitle}>Location Details</Text>
            </View>
            {formFields.filter(f => f.section === 'location').map((field) => (
              <View key={field.key} style={styles.fieldContainer}>
                <Text style={styles.fieldLabel}>{field.label}</Text>
                <View style={styles.inputContainer}>
                  <Ionicons 
                    name={field.icon as any} 
                    size={20} 
                    color={Colors.textSecondary} 
                    style={styles.inputIcon}
                  />
                  <TextInput
                    style={styles.input}
                    placeholder={field.placeholder}
                    placeholderTextColor={Colors.textSecondary}
                    value={profile[field.key] as string}
                    onChangeText={(value) => updateField(field.key, value)}
                  />
                </View>
              </View>
            ))}
          </View>

          {/* Farming Details Section */}
          <View style={styles.sectionContainer}>
            <View style={styles.sectionHeader}>
              <Ionicons name="leaf-outline" size={24} color={Colors.primary} />
              <Text style={styles.sectionTitle}>Farming Details</Text>
            </View>
            {formFields.filter(f => f.section === 'farming').map((field) => (
              <View key={field.key} style={styles.fieldContainer}>
                <Text style={styles.fieldLabel}>{field.label}</Text>
                <View style={styles.inputContainer}>
                  <Ionicons 
                    name={field.icon as any} 
                    size={20} 
                    color={Colors.textSecondary} 
                    style={styles.inputIcon}
                  />
                  <TextInput
                    style={styles.input}
                    placeholder={field.placeholder}
                    placeholderTextColor={Colors.textSecondary}
                    value={
                      field.key === 'crop_types' 
                        ? (Array.isArray(profile[field.key]) ? (profile[field.key] as string[]).join(', ') : String(profile[field.key] || ''))
                        : String(profile[field.key] || '')
                    }
                    onChangeText={(value) => {
                      if (field.key === 'crop_types') {
                        updateField(field.key, value.split(',').map(s => s.trim()).filter(s => s));
                      } else {
                        updateField(field.key, value);
                      }
                    }}
                    keyboardType={field.keyboardType || 'default'}
                  />
                </View>
              </View>
            ))}
          </View>

          {/* Save Button */}
          <TouchableOpacity
            style={[styles.saveButton, isSaving && styles.saveButtonDisabled]}
            onPress={saveProfile}
            disabled={isSaving}
          >
            {isSaving ? (
              <ActivityIndicator color={Colors.white} />
            ) : (
              <Ionicons name="checkmark-circle-outline" size={20} color={Colors.white} />
            )}
            <Text style={styles.saveButtonText}>
              {isSaving ? t('personalInfo.saving') : t('personalInfo.save')}
            </Text>
          </TouchableOpacity>

          <View style={styles.bottomSpacing} />
        </Animated.ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
  },
  loadingText: {
    fontSize: 16,
    color: Colors.textSecondary,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  backButton: {
    padding: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
  },
  placeholder: {
    width: 40,
  },
  scrollView: {
    flex: 1,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    margin: 16,
    padding: 20,
    borderRadius: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  avatarContainer: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  profileHeaderInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 4,
  },
  profilePhone: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 4,
  },
  memberSince: {
    fontSize: 12,
    color: Colors.textSecondary,
    fontStyle: 'italic',
  },
  statsContainer: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginBottom: 16,
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: Colors.white,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    borderLeftWidth: 4,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.text,
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 4,
  },
  sectionContainer: {
    backgroundColor: Colors.white,
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 16,
    borderRadius: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
    marginLeft: 8,
  },
  fieldContainer: {
    marginBottom: 16,
  },
  fieldLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.text,
    marginBottom: 8,
  },
  required: {
    color: '#e53935',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: 12,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
    color: Colors.text,
  },
  saveButton: {
    flexDirection: 'row',
    backgroundColor: Colors.primary,
    margin: 16,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  saveButtonDisabled: {
    backgroundColor: Colors.textSecondary,
    opacity: 0.6,
  },
  saveButtonText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
  bottomSpacing: {
    height: 20,
  },
});