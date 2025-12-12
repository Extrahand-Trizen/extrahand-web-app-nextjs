/**
 * Input sanitization utilities for production-grade security
 */

/**
 * Sanitize string input by trimming whitespace and preventing XSS
 */
export function sanitizeString(input: string): string {
   return input
      .trim()
      .replace(/[<>]/g, "") // Remove potential HTML tags
      .replace(/javascript:/gi, "") // Remove javascript: protocol
      .replace(/on\w+=/gi, ""); // Remove inline event handlers
}

/**
 * Validate coordinate bounds
 */
export function isValidCoordinate(
   longitude: number,
   latitude: number
): boolean {
   return (
      longitude >= -180 && longitude <= 180 && latitude >= -90 && latitude <= 90
   );
}

/**
 * Sanitize array of strings
 */
export function sanitizeStringArray(arr: string[]): string[] {
   return arr
      .map((item) => sanitizeString(item))
      .filter((item) => item.length > 0);
}

/**
 * Validate file type for uploads
 */
export function isValidImageType(type: string): boolean {
   const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
   return validTypes.includes(type.toLowerCase());
}

/**
 * Validate file size (in bytes)
 */
export function isValidFileSize(size: number, maxMB: number = 5): boolean {
   const maxBytes = maxMB * 1024 * 1024;
   return size > 0 && size <= maxBytes;
}

/**
 * Sanitize pin code (must be 6 digits)
 */
export function sanitizePinCode(pinCode: string): string {
   return pinCode.replace(/\D/g, "").slice(0, 6);
}

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
   const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
   return emailRegex.test(email);
}

/**
 * Sanitize phone number (keep only digits and +)
 */
export function sanitizePhoneNumber(phone: string): string {
   return phone.replace(/[^\d+]/g, "");
}

/**
 * Check if string contains only safe characters (alphanumeric + common punctuation)
 */
export function isSafeString(input: string): boolean {
   const safeRegex = /^[a-zA-Z0-9\s.,!?'"()\-–—:;]+$/;
   return safeRegex.test(input);
}
