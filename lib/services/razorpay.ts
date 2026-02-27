/**
 * Razorpay Integration Service
 * Handles Razorpay SDK loading and payment initiation
 */

import type { RazorpayOrder, RazorpayPaymentResponse } from '@/types/payment';

// Razorpay script URL
const RAZORPAY_SCRIPT_URL = 'https://checkout.razorpay.com/v1/checkout.js';

/** Cached key ID from API (avoids repeated fetches) */
let cachedKeyId: string | null = null;

/**
 * Get Razorpay key ID: fetch from server API first (runtime env), then fall back to build-time NEXT_PUBLIC_.
 * This allows setting RAZORPAY_KEY_ID only on the server without rebuilding the frontend.
 */
async function getRazorpayKeyId(): Promise<string> {
  if (cachedKeyId) return cachedKeyId;
  if (typeof window !== 'undefined' && process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID) {
    cachedKeyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
    return cachedKeyId;
  }
  try {
    const res = await fetch('/api/razorpay-key', { cache: 'no-store' });
    const data = await res.json();
    if (res.ok && data?.keyId) {
      cachedKeyId = data.keyId;
      return cachedKeyId;
    }
  } catch {
    // Fall through to build-time env or throw
  }
  if (process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID) {
    cachedKeyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
    return cachedKeyId;
  }
  throw new Error('Razorpay key not configured');
}

// Declare Razorpay global type
declare global {
  interface Window {
    Razorpay: any;
  }
}

/**
 * Load Razorpay SDK script dynamically
 */
export async function loadRazorpayScript(): Promise<boolean> {
  return new Promise((resolve) => {
    // Check if already loaded
    if (window.Razorpay) {
      console.log('✅ Razorpay SDK already loaded');
      resolve(true);
      return;
    }

    // Check if script is already in DOM
    const existingScript = document.querySelector(`script[src="${RAZORPAY_SCRIPT_URL}"]`);
    if (existingScript) {
      // Wait for it to load
      if ((existingScript as any).loaded) {
        resolve(true);
      } else {
        existingScript.addEventListener('load', () => {
          console.log('✅ Razorpay SDK loaded from existing script');
          resolve(true);
        }, { once: true });
        existingScript.addEventListener('error', () => {
          console.error('❌ Error loading existing Razorpay script');
          resolve(false);
        }, { once: true });
      }
      return;
    }

    // Load script
    const script = document.createElement('script');
    script.src = RAZORPAY_SCRIPT_URL;
    script.async = true;
    script.defer = false; // Load immediately for payment flow
    
    script.onload = () => {
      (script as any).loaded = true;
      console.log('✅ Razorpay SDK loaded successfully');
      // Small delay to ensure Razorpay global is available
      setTimeout(() => resolve(true), 100);
    };
    
    script.onerror = () => {
      console.error('❌ Failed to load Razorpay SDK');
      resolve(false);
    };
    
    // Insert at head for faster loading
    document.head ? document.head.appendChild(script) : document.body.appendChild(script);
  });
}

/**
 * Razorpay payment options
 */
export interface RazorpayOptions {
  key: string; // Razorpay key ID
  amount: number; // Amount in paise
  currency: string;
  name: string;
  description: string;
  order_id: string;
  handler: (response: RazorpayPaymentResponse) => void;
  prefill?: {
    name?: string;
    email?: string;
    contact?: string;
  };
  notes?: Record<string, any>;
  theme?: {
    color?: string;
  };
  modal?: {
    ondismiss?: () => void;
    escape?: boolean;
    backdropclose?: boolean;
  };
  method?: string; // Preferred payment method (card, upi, netbanking, wallet, emandate)
  recurring?: boolean; // For recurring payments
  readonly?: {
    contact?: boolean;
    email?: boolean;
  };
}

/**
 * Initialize Razorpay payment
 */
export async function initiateRazorpayPayment(
  order: RazorpayOrder,
  options: Partial<RazorpayOptions>,
  callbacks: {
    onSuccess: (response: RazorpayPaymentResponse) => void | Promise<void>;
    onDismiss?: () => void;
    onError?: (error: Error) => void;
  }
): Promise<void> {
  try {
    // Load Razorpay SDK
    console.log('📦 Loading Razorpay SDK...');
    const loaded = await loadRazorpayScript();
    if (!loaded) {
      throw new Error('Failed to load Razorpay SDK');
    }

    // Verify Razorpay is available
    if (!window.Razorpay) {
      throw new Error('Razorpay SDK not available');
    }

    // Get Razorpay key: from server API (RAZORPAY_KEY_ID) or build-time NEXT_PUBLIC_RAZORPAY_KEY_ID
    console.log('🔑 Fetching Razorpay key...');
    const razorpayKey = await getRazorpayKeyId();

    // Prepare Razorpay options
    const razorpayOptions: RazorpayOptions = {
      key: razorpayKey,
      amount: order.amount,
      currency: order.currency || 'INR',
      name: options.name || 'ExtraHand',
      description: options.description || 'Task Payment',
      order_id: order.id,
      handler: async (response: RazorpayPaymentResponse) => {
        console.log('✅ Payment successful:', response);
        try {
          await callbacks.onSuccess(response);
        } catch (error) {
          console.error('❌ Error in success handler:', error);
          callbacks.onError?.(error as Error);
        }
      },
      prefill: options.prefill || {
        contact: '',
        email: '',
      },
      notes: options.notes || order.notes,
      theme: {
        color: options.theme?.color || '#10b981', // Green primary color
      },
      modal: {
        ondismiss: () => {
          console.log('⚠️ Payment modal dismissed');
          callbacks.onDismiss?.();
        },
        escape: options.modal?.escape !== false,
        backdropclose: options.modal?.backdropclose !== false,
      },
      readonly: {
        contact: false, // Allow user to edit contact
        email: false,  // Allow user to edit email
      },
    };

    console.log('💳 Creating Razorpay checkout instance...');
    // Create Razorpay checkout instance
    const rzp = new window.Razorpay(razorpayOptions);
    
    // Set up all event handlers BEFORE opening the modal
    // These handlers capture various payment flow events
    rzp.on('payment.failed', function (response: any) {
      console.error('❌ Payment failed event:', response.error);
      const error = new Error(response.error?.description || 'Payment failed');
      callbacks.onError?.(error);
    });

    rzp.on('payment.error', function (response: any) {
      console.error('❌ Payment error event:', response.error);
      const error = new Error(response.error?.description || 'Payment error occurred');
      callbacks.onError?.(error);
    });

    rzp.on('payment.authorized', function (response: any) {
      console.log('✅ Payment authorized event:', response);
    });

    rzp.on('payment.success', function (response: any) {
      console.log('✅ Payment success event:', response);
    });

    // Additional event handlers for better UX
    rzp.on('payment.submit', function () {
      console.log('📤 Payment submission initiated');
    });

    // Handle radio selection (for payment method selection)
    rzp.on('method.select', function (method: any) {
      console.log('📌 Payment method selected:', method);
    });

    // Handle phone input
    rzp.on('input.contact', function (data: any) {
      console.log('📱 Contact updated:', data);
    });
    
    // Open the modal AFTER all handlers are registered
    console.log('🎯 Opening Razorpay payment modal...');
    rzp.open();
  } catch (error) {
    console.error('❌ Error initiating Razorpay payment:', error);
    callbacks.onError?.(error as Error);
    throw error;
  }
}

/**
 * Verify payment signature (client-side)
 * Note: This is just for display purposes. Actual verification happens on server.
 */
export function generatePaymentSignature(orderId: string, paymentId: string, secret: string): string {
  // This should NOT be done on client-side in production
  // Server-side verification is mandatory
  // This is just for reference
  console.warn('⚠️ Client-side signature generation is for reference only. Use server-side verification.');
  return '';
}

/**
 * Format amount for Razorpay (convert rupees to paise)
 */
export function formatAmountForRazorpay(amountInRupees: number): number {
  return Math.round(amountInRupees * 100);
}

/**
 * Format amount from Razorpay (convert paise to rupees)
 */
export function formatAmountFromRazorpay(amountInPaise: number): number {
  return amountInPaise / 100;
}

/**
 * Format currency display
 */
export function formatCurrency(amount: number, currency: string = 'INR'): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
  }).format(amount);
}
