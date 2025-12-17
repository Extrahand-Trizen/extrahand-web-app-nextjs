"use client";

/**
 * useRazorpay Hook
 * Handles Razorpay checkout integration
 */

import { useCallback, useEffect, useState } from "react";
import {
   RazorpayCheckoutOptions,
   RazorpayPaymentResponse,
   PaymentError,
} from "@/types/payment";
import { parsePaymentError } from "@/lib/utils/payment";

// Razorpay global type
declare global {
   interface Window {
      Razorpay: new (options: RazorpayCheckoutOptions) => {
         open: () => void;
         close: () => void;
         on: (event: string, callback: (response: unknown) => void) => void;
      };
   }
}

interface UseRazorpayReturn {
   isLoaded: boolean;
   isProcessing: boolean;
   error: PaymentError | null;
   openCheckout: (options: RazorpayCheckoutOptions) => void;
   clearError: () => void;
}

const RAZORPAY_SCRIPT_URL = "https://checkout.razorpay.com/v1/checkout.js";

export function useRazorpay(): UseRazorpayReturn {
   const [isLoaded, setIsLoaded] = useState(false);
   const [isProcessing, setIsProcessing] = useState(false);
   const [error, setError] = useState<PaymentError | null>(null);

   // Load Razorpay script
   useEffect(() => {
      // Check if already loaded
      if (window.Razorpay) {
         setIsLoaded(true);
         return;
      }

      // Check if script is already in DOM
      const existingScript = document.querySelector(
         `script[src="${RAZORPAY_SCRIPT_URL}"]`
      );

      if (existingScript) {
         existingScript.addEventListener("load", () => setIsLoaded(true));
         return;
      }

      // Load script
      const script = document.createElement("script");
      script.src = RAZORPAY_SCRIPT_URL;
      script.async = true;

      script.onload = () => {
         setIsLoaded(true);
      };

      script.onerror = () => {
         setError({
            code: "SCRIPT_LOAD_ERROR",
            message: "Failed to load Razorpay",
            userMessage:
               "Unable to load payment gateway. Please refresh the page and try again.",
            retryable: true,
         });
      };

      document.body.appendChild(script);

      return () => {
         // Cleanup is not needed as we want the script to persist
      };
   }, []);

   const openCheckout = useCallback(
      (options: RazorpayCheckoutOptions) => {
         if (!isLoaded || !window.Razorpay) {
            setError({
               code: "NOT_LOADED",
               message: "Razorpay not loaded",
               userMessage:
                  "Payment gateway is not ready. Please wait a moment and try again.",
               retryable: true,
            });
            return;
         }

         setIsProcessing(true);
         setError(null);

         try {
            const razorpay = new window.Razorpay({
               ...options,
               handler: (response: RazorpayPaymentResponse) => {
                  setIsProcessing(false);
                  options.handler(response);
               },
               modal: {
                  ...options.modal,
                  ondismiss: () => {
                     setIsProcessing(false);
                     options.modal?.ondismiss?.();
                  },
               },
            });

            razorpay.on("payment.failed", (response: unknown) => {
               setIsProcessing(false);
               setError(parsePaymentError(response));
            });

            razorpay.open();
         } catch (err) {
            setIsProcessing(false);
            setError(parsePaymentError(err));
         }
      },
      [isLoaded]
   );

   const clearError = useCallback(() => {
      setError(null);
   }, []);

   return {
      isLoaded,
      isProcessing,
      error,
      openCheckout,
      clearError,
   };
}
