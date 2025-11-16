// Form validation utilities

export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

// Validate phone number (Indian format)
export const validatePhone = (phone: string): ValidationResult => {
  // Remove spaces and special characters
  const cleanPhone = phone.replace(/[\s\-\(\)]/g, '');
  
  // Check if it's a valid Indian phone number (10 digits)
  const phoneRegex = /^[6-9]\d{9}$/;
  
  if (!cleanPhone) {
    return { isValid: false, error: 'Phone number is required' };
  }
  
  if (!phoneRegex.test(cleanPhone)) {
    return { isValid: false, error: 'Please enter a valid 10-digit phone number' };
  }
  
  return { isValid: true };
};

// Validate password
export const validatePassword = (password: string): ValidationResult => {
  if (!password) {
    return { isValid: false, error: 'Password is required' };
  }
  
  if (password.length < 6) {
    return { isValid: false, error: 'Password must be at least 6 characters' };
  }
  
  return { isValid: true };
};

// Validate name
export const validateName = (name: string): ValidationResult => {
  if (!name || !name.trim()) {
    return { isValid: false, error: 'Name is required' };
  }
  
  if (name.trim().length < 2) {
    return { isValid: false, error: 'Name must be at least 2 characters' };
  }
  
  return { isValid: true };
};

// Validate confirm password
export const validateConfirmPassword = (password: string, confirmPassword: string): ValidationResult => {
  if (!confirmPassword) {
    return { isValid: false, error: 'Please confirm your password' };
  }
  
  if (password !== confirmPassword) {
    return { isValid: false, error: 'Passwords do not match' };
  }
  
  return { isValid: true };
};

// Format phone number for display
export const formatPhoneNumber = (phone: string): string => {
  const cleaned = phone.replace(/\D/g, '');
  
  if (cleaned.length === 10) {
    return `${cleaned.slice(0, 5)} ${cleaned.slice(5)}`;
  }
  
  return phone;
};

// Clean phone number for API
export const cleanPhoneNumber = (phone: string): string => {
  return phone.replace(/\D/g, '');
};
