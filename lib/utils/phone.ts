/**
 * Phone number formatting utilities
 * Handles Indian phone numbers with +91 country code
 */

/**
 * Format phone number to E.164 format
 * If no country code is present, assumes Indian number (+91)
 * 
 * @param phone - Phone number input (can include spaces, dashes, etc.)
 * @returns Formatted phone number in E.164 format (e.g., +917416337859)
 */
export function formatPhoneNumber(phone: string): string {
  if (!phone) return '';
  
  // Remove all non-digit characters except +
  const cleaned = phone.replace(/[^\d+]/g, '');
  
  // If it already starts with +, check if it has a country code
  if (cleaned.startsWith('+')) {
    // If it starts with +91, it's already formatted correctly
    if (cleaned.startsWith('+91')) {
      return cleaned;
    }
    // If it starts with + but not +91, it might be another country code
    // For now, we'll assume it's correct if it has a + prefix
    // But for Indian numbers, we'll normalize to +91
    if (cleaned.length >= 10) {
      // If it's a valid length with +, return as is
      return cleaned;
    }
  }
  
  // Extract only digits
  const digits = cleaned.replace(/\+/g, '');
  
  // If it starts with 91 and has 12 digits, it's already +91XXXXXXXXXX
  if (digits.startsWith('91') && digits.length === 12) {
    return `+${digits}`;
  }
  
  // If it starts with 0 (Indian landline format), remove the 0
  if (digits.startsWith('0')) {
    const withoutZero = digits.substring(1);
    if (withoutZero.length === 10) {
      return `+91${withoutZero}`;
    }
  }
  
  // If it's 10 digits, assume it's an Indian mobile number
  if (digits.length === 10) {
    return `+91${digits}`;
  }
  
  // If it's already 12 digits and doesn't start with 91, might be missing +
  if (digits.length === 12 && !digits.startsWith('91')) {
    // This is unusual, but we'll prepend +91 anyway
    return `+91${digits.substring(2)}`;
  }
  
  // Default: prepend +91 if it looks like a valid length
  if (digits.length >= 10 && digits.length <= 12) {
    // Take last 10 digits if it's longer
    const last10 = digits.slice(-10);
    return `+91${last10}`;
  }
  
  // Return as is with +91 if we can't determine
  return `+91${digits}`;
}

/**
 * Validate phone number format
 * @param phone - Phone number to validate
 * @returns true if valid, false otherwise
 */
export function isValidPhoneNumber(phone: string): boolean {
  const formatted = formatPhoneNumber(phone);
  // E.164 format: + followed by 1-15 digits
  // For Indian numbers: +91 followed by 10 digits
  return /^\+91\d{10}$/.test(formatted);
}

/**
 * Display phone number in a user-friendly format
 * @param phone - Phone number in E.164 format
 * @returns Formatted display string (e.g., +91 74163 37859)
 */
export function displayPhoneNumber(phone: string): string {
  const formatted = formatPhoneNumber(phone);
  if (formatted.startsWith('+91') && formatted.length === 13) {
    const digits = formatted.substring(3);
    return `+91 ${digits.substring(0, 5)} ${digits.substring(5)}`;
  }
  return formatted;
}

