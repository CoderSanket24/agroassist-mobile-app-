import { Colors } from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
    Alert,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface FarmerProfile {
  name: string;
  phone: string;
  village: string;
  district: string;
  state: string;
  farmSize: string;
  cropTypes: string;
  experience: string;
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
    farmSize: '',
    cropTypes: '',
    experience: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const savedProfile = await AsyncStorage.getItem('farmerProfile');
      if (savedProfile) {
        setProfile(JSON.parse(savedProfile));
      }
    } catch (error) {
      console.error('Failed to load profile:', error);
    }
  };

  const saveProfile = async () => {
    if (!profile.name.trim() || !profile.phone.trim()) {
      Alert.alert(t('common.error'), t('personalInfo.requiredFields'));
      return;
    }

    setIsLoading(true);
    try {
      await AsyncStorage.setItem('farmerProfile', JSON.stringify(profile));
      Alert.alert(t('personalInfo.success'), t('personalInfo.profileSaved'), [
        { text: t('common.ok'), onPress: () => router.back() }
      ]);
    } catch (error) {
      Alert.alert(t('common.error'), t('personalInfo.saveFailed'));
    } finally {
      setIsLoading(false);
    }
  };

  const updateField = (field: keyof FarmerProfile, value: string) => {
    setProfile(prev => ({ ...prev, [field]: value }));
  };

  const formFields = [
    {
      key: 'name' as keyof FarmerProfile,
      label: t('personalInfo.name'),
      placeholder: t('personalInfo.namePlaceholder'),
      icon: 'person-outline',
      required: true
    },
    {
      key: 'phone' as keyof FarmerProfile,
      label: t('personalInfo.phone'),
      placeholder: t('personalInfo.phonePlaceholder'),
      icon: 'call-outline',
      keyboardType: 'phone-pad' as const,
      required: true
    },
    {
      key: 'village' as keyof FarmerProfile,
      label: t('personalInfo.village'),
      placeholder: t('personalInfo.villagePlaceholder'),
      icon: 'home-outline'
    },
    {
      key: 'district' as keyof FarmerProfile,
      label: t('personalInfo.district'),
      placeholder: t('personalInfo.districtPlaceholder'),
      icon: 'location-outline'
    },
    {
      key: 'state' as keyof FarmerProfile,
      label: t('personalInfo.state'),
      placeholder: t('personalInfo.statePlaceholder'),
      icon: 'map-outline'
    },
    {
      key: 'farmSize' as keyof FarmerProfile,
      label: t('personalInfo.farmSize'),
      placeholder: t('personalInfo.farmSizePlaceholder'),
      icon: 'resize-outline',
      keyboardType: 'numeric' as const
    },
    {
      key: 'cropTypes' as keyof FarmerProfile,
      label: t('personalInfo.cropTypes'),
      placeholder: t('personalInfo.cropTypesPlaceholder'),
      icon: 'leaf-outline',
      multiline: true
    },
    {
      key: 'experience' as keyof FarmerProfile,
      label: t('personalInfo.experience'),
      placeholder: t('personalInfo.experiencePlaceholder'),
      icon: 'time-outline',
      keyboardType: 'numeric' as const
    }
  ];

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

        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          <Text style={styles.subtitle}>{t('personalInfo.subtitle')}</Text>

          {/* Form Fields */}
          <View style={styles.formContainer}>
            {formFields.map((field) => (
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
                    style={[styles.input, field.multiline && styles.multilineInput]}
                    placeholder={field.placeholder}
                    placeholderTextColor={Colors.textSecondary}
                    value={profile[field.key]}
                    onChangeText={(value) => updateField(field.key, value)}
                    keyboardType={field.keyboardType || 'default'}
                    multiline={field.multiline}
                    numberOfLines={field.multiline ? 3 : 1}
                  />
                </View>
              </View>
            ))}
          </View>

          {/* Save Button */}
          <TouchableOpacity
            style={[styles.saveButton, isLoading && styles.saveButtonDisabled]}
            onPress={saveProfile}
            disabled={isLoading}
          >
            <Ionicons name="checkmark-circle-outline" size={20} color={Colors.white} />
            <Text style={styles.saveButtonText}>
              {isLoading ? t('personalInfo.saving') : t('personalInfo.save')}
            </Text>
          </TouchableOpacity>

          <View style={styles.bottomSpacing} />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
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
  subtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
    margin: 16,
  },
  formContainer: {
    padding: 16,
  },
  fieldContainer: {
    marginBottom: 20,
  },
  fieldLabel: {
    fontSize: 16,
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
    backgroundColor: Colors.white,
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
  multilineInput: {
    paddingVertical: 12,
    textAlignVertical: 'top',
    minHeight: 80,
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