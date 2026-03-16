/**
 * Phone number formatting utilities
 * Handles Indian phone numbers with +91 country code
 */

/**
 * Extract a 10-digit Indian mobile number from any input.
 * Accepts pasted forms like +919876543210 or 919876543210 and keeps last 10 digits.
 */
export function extractIndianMobileNumber(input: string): string {
  if (!input) return "";
  const digits = input.replace(/\D/g, "");
  if (!digits) return "";
  if (digits.length <= 10) return digits;
  return digits.slice(-10);
}

/**
 * Validate 10-digit Indian mobile number.
 * Must start with 6, 7, 8 or 9.
 */
export function isValidIndianMobileNumber(input: string): boolean {
  return /^[6-9]\d{9}$/.test(input);
}

/**
 * Format phone number to E.164 format
 * If no country code is present, assumes Indian number (+91)
 * 
 * @param phone - Phone number input (can include spaces, dashes, etc.)
 * @returns Formatted phone number in E.164 format (e.g., +917416337859)
 */
export function formatPhoneNumber(phone: string): string {
  const mobile = extractIndianMobileNumber(phone);
  if (!mobile) return "";
  return `+91${mobile}`;
}

/**
 * Validate phone number format
 * @param phone - Phone number to validate
 * @returns true if valid, false otherwise
 */
export function isValidPhoneNumber(phone: string): boolean {
  const mobile = extractIndianMobileNumber(phone);
  return isValidIndianMobileNumber(mobile);
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

/**
 * Parse phone number with country code
 * Similar to mobile app's parsePhoneWithCountryCode
 * @param phone - Phone number input
 * @returns Object with fullNumber (E.164 format) and other parsed data
 */
export function parsePhoneWithCountryCode(phone: string): {
  fullNumber: string;
  countryCode: string;
  number: string;
} {
  const number = extractIndianMobileNumber(phone);
  const fullNumber = number ? `+91${number}` : "";

  return {
    fullNumber,
    countryCode: "+91",
    number,
  };
}

