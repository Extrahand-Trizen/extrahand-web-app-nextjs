/**
 * Payment Utility Functions
 */

/**
 * Format amount as Indian Rupees
 */
export function formatCurrency(amount: number): string {
   return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
   }).format(amount);
}

/**
 * Format date in short format
 */
export function formatShortDate(date: Date | string): string {
   const d = new Date(date);
   return d.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
   });
}

/**
 * Format date with time
 */
export function formatDateTime(date: Date | string): string {
   const d = new Date(date);
   return d.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
   });
}

/**
 * Calculate service fee (percentage-based)
 */
export function calculateServiceFee(amount: number, percentage: number = 5): number {
   return Math.round(amount * (percentage / 100));
}

/**
 * Calculate platform fee (5% of amount)
 */
export function calculatePlatformFee(amount: number): number {
   // 5% platform fee
   return Math.round(amount * 0.05);
}

/**
 * Calculate total amount including fees
 */
export function calculateTotalAmount(taskAmount: number): {
   taskAmount: number;
   serviceFee: number;
   platformFee: number;
   totalAmount: number;
} {
   const serviceFee = calculateServiceFee(taskAmount);
   const platformFee = calculatePlatformFee(taskAmount);
   return {
      taskAmount,
      serviceFee,
      platformFee,
      totalAmount: taskAmount + serviceFee + platformFee,
   };
}

/**
 * Mask card number
 */
export function maskCardNumber(cardNumber: string): string {
   if (cardNumber.length < 4) return cardNumber;
   return `•••• •••• •••• ${cardNumber.slice(-4)}`;
}

/**
 * Get card brand from number
 */
export function getCardBrand(cardNumber: string): string {
   const firstDigit = cardNumber.charAt(0);
   const firstTwo = cardNumber.substring(0, 2);
   
   if (firstDigit === "4") return "visa";
   if (["51", "52", "53", "54", "55"].includes(firstTwo)) return "mastercard";
   if (firstTwo === "60" || firstTwo === "65") return "rupay";
   if (["34", "37"].includes(firstTwo)) return "amex";
   
   return "unknown";
}
