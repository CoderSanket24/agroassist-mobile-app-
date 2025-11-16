import { Colors } from "@/constants/Colors";
import { registerUser } from "@/services/auth";
import {
  cleanPhoneNumber,
  validateConfirmPassword,
  validateName,
  validatePassword,
  validatePhone
} from "@/utils/validation";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  ActivityIndicator,
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

export default function RegisterScreen() {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    password: "",
    confirmPassword: "",
    village: "",
    district: "",
    state: ""
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const router = useRouter();
  const { t } = useTranslation();

  const updateField = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      const newErrors = { ...errors };
      delete newErrors[field];
      setErrors(newErrors);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};
    
    const nameValidation = validateName(formData.name);
    if (!nameValidation.isValid) {
      newErrors.name = nameValidation.error!;
    }
    
    const phoneValidation = validatePhone(formData.phone);
    if (!phoneValidation.isValid) {
      newErrors.phone = phoneValidation.error!;
    }
    
    const passwordValidation = validatePassword(formData.password);
    if (!passwordValidation.isValid) {
      newErrors.password = passwordValidation.error!;
    }
    
    const confirmPasswordValidation = validateConfirmPassword(formData.password, formData.confirmPassword);
    if (!confirmPasswordValidation.isValid) {
      newErrors.confirmPassword = confirmPasswordValidation.error!;
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async () => {
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    
    try {
      const cleanedPhone = cleanPhoneNumber(formData.phone);
      const response = await registerUser({
        name: formData.name.trim(),
        phone: cleanedPhone,
        password: formData.password,
        village: formData.village.trim() || undefined,
        district: formData.district.trim() || undefined,
        state: formData.state.trim() || undefined
      });

      if (response.success) {
        Alert.alert(
          t('register.success'),
          t('register.successMessage'),
          [{ text: t('common.ok'), onPress: () => router.replace("/(tabs)") }]
        );
      } else {
        Alert.alert(t('common.error'), response.message);
      }
    } catch (error) {
      Alert.alert(t('common.error'), t('register.registerFailed'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.background }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
              <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                <Ionicons name="arrow-back" size={24} color={Colors.primary} />
              </TouchableOpacity>
              <Text style={styles.emoji}>🌱</Text>
              <Text style={styles.title}>{t('register.title')}</Text>
              <Text style={styles.subtitle}>{t('register.subtitle')}</Text>
            </View>

            {/* Form */}
            <View style={styles.form}>
              {/* Name Input */}
              <View style={styles.inputContainer}>
                <Text style={styles.label}>
                  {t('register.nameLabel')} <Text style={styles.required}>*</Text>
                </Text>
                <View style={[styles.inputWrapper, errors.name && styles.inputError]}>
                  <Ionicons name="person-outline" size={20} color={Colors.textSecondary} style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder={t('register.namePlaceholder') as string}
                    placeholderTextColor={Colors.textSecondary}
                    value={formData.name}
                    onChangeText={(text) => updateField('name', text)}
                    editable={!isLoading}
                  />
                </View>
                {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}
              </View>

              {/* Phone Input */}
              <View style={styles.inputContainer}>
                <Text style={styles.label}>
                  {t('register.phoneLabel')} <Text style={styles.required}>*</Text>
                </Text>
                <View style={[styles.inputWrapper, errors.phone && styles.inputError]}>
                  <Ionicons name="call-outline" size={20} color={Colors.textSecondary} style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder={t('register.phonePlaceholder') as string}
                    placeholderTextColor={Colors.textSecondary}
                    keyboardType="phone-pad"
                    value={formData.phone}
                    onChangeText={(text) => updateField('phone', text)}
                    maxLength={10}
                    editable={!isLoading}
                  />
                </View>
                {errors.phone && <Text style={styles.errorText}>{errors.phone}</Text>}
              </View>

              {/* Password Input */}
              <View style={styles.inputContainer}>
                <Text style={styles.label}>
                  {t('register.passwordLabel')} <Text style={styles.required}>*</Text>
                </Text>
                <View style={[styles.inputWrapper, errors.password && styles.inputError]}>
                  <Ionicons name="lock-closed-outline" size={20} color={Colors.textSecondary} style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder={t('register.passwordPlaceholder') as string}
                    placeholderTextColor={Colors.textSecondary}
                    secureTextEntry={!showPassword}
                    value={formData.password}
                    onChangeText={(text) => updateField('password', text)}
                    editable={!isLoading}
                  />
                  <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                    <Ionicons
                      name={showPassword ? "eye-off-outline" : "eye-outline"}
                      size={20}
                      color={Colors.textSecondary}
                    />
                  </TouchableOpacity>
                </View>
                {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}
              </View>

              {/* Confirm Password Input */}
              <View style={styles.inputContainer}>
                <Text style={styles.label}>
                  {t('register.confirmPasswordLabel')} <Text style={styles.required}>*</Text>
                </Text>
                <View style={[styles.inputWrapper, errors.confirmPassword && styles.inputError]}>
                  <Ionicons name="lock-closed-outline" size={20} color={Colors.textSecondary} style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder={t('register.confirmPasswordPlaceholder') as string}
                    placeholderTextColor={Colors.textSecondary}
                    secureTextEntry={!showConfirmPassword}
                    value={formData.confirmPassword}
                    onChangeText={(text) => updateField('confirmPassword', text)}
                    editable={!isLoading}
                  />
                  <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
                    <Ionicons
                      name={showConfirmPassword ? "eye-off-outline" : "eye-outline"}
                      size={20}
                      color={Colors.textSecondary}
                    />
                  </TouchableOpacity>
                </View>
                {errors.confirmPassword && <Text style={styles.errorText}>{errors.confirmPassword}</Text>}
              </View>

              {/* Optional Fields Section */}
              <Text style={styles.sectionTitle}>{t('register.optionalInfo')}</Text>

              {/* Village Input */}
              <View style={styles.inputContainer}>
                <Text style={styles.label}>{t('register.villageLabel')}</Text>
                <View style={styles.inputWrapper}>
                  <Ionicons name="home-outline" size={20} color={Colors.textSecondary} style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder={t('register.villagePlaceholder') as string}
                    placeholderTextColor={Colors.textSecondary}
                    value={formData.village}
                    onChangeText={(text) => updateField('village', text)}
                    editable={!isLoading}
                  />
                </View>
              </View>

              {/* District Input */}
              <View style={styles.inputContainer}>
                <Text style={styles.label}>{t('register.districtLabel')}</Text>
                <View style={styles.inputWrapper}>
                  <Ionicons name="location-outline" size={20} color={Colors.textSecondary} style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder={t('register.districtPlaceholder') as string}
                    placeholderTextColor={Colors.textSecondary}
                    value={formData.district}
                    onChangeText={(text) => updateField('district', text)}
                    editable={!isLoading}
                  />
                </View>
              </View>

              {/* State Input */}
              <View style={styles.inputContainer}>
                <Text style={styles.label}>{t('register.stateLabel')}</Text>
                <View style={styles.inputWrapper}>
                  <Ionicons name="map-outline" size={20} color={Colors.textSecondary} style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder={t('register.statePlaceholder') as string}
                    placeholderTextColor={Colors.textSecondary}
                    value={formData.state}
                    onChangeText={(text) => updateField('state', text)}
                    editable={!isLoading}
                  />
                </View>
              </View>

              {/* Register Button */}
              <TouchableOpacity
                style={[styles.button, isLoading && styles.buttonDisabled]}
                onPress={handleRegister}
                disabled={isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator color={Colors.white} />
                ) : (
                  <>
                    <Ionicons name="person-add-outline" size={20} color={Colors.white} />
                    <Text style={styles.buttonText}>{t('register.register')}</Text>
                  </>
                )}
              </TouchableOpacity>

              {/* Login Link */}
              <View style={styles.loginContainer}>
                <Text style={styles.loginText}>{t('register.haveAccount')}</Text>
                <TouchableOpacity onPress={() => router.back()} disabled={isLoading}>
                  <Text style={styles.loginLink}>{t('register.loginHere')}</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    alignItems: "center",
    marginTop: 20,
    marginBottom: 30,
  },
  backButton: {
    position: "absolute",
    left: 0,
    top: 0,
    padding: 8,
  },
  emoji: {
    fontSize: 50,
    marginBottom: 12,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: Colors.primary,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    color: Colors.textSecondary,
    textAlign: "center",
  },
  form: {
    width: "100%",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: Colors.text,
    marginTop: 10,
    marginBottom: 16,
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 15,
    fontWeight: "500",
    color: Colors.text,
    marginBottom: 6,
  },
  required: {
    color: "#e53935",
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.white,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: 12,
  },
  inputError: {
    borderColor: "#e53935",
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
  errorText: {
    color: "#e53935",
    fontSize: 13,
    marginTop: 4,
  },
  button: {
    flexDirection: "row",
    backgroundColor: Colors.primary,
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
    gap: 8,
  },
  buttonDisabled: {
    backgroundColor: Colors.textSecondary,
    opacity: 0.6,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: Colors.white,
  },
  loginContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
    gap: 4,
  },
  loginText: {
    fontSize: 15,
    color: Colors.textSecondary,
  },
  loginLink: {
    fontSize: 15,
    fontWeight: "600",
    color: Colors.primary,
  },
});
