/**
 * Phone Authentication utilities
 * Handles OTP sending and verification
 */

import { setupRecaptcha, signInWithPhone, verifyOTP } from './firebase';

type SendResult = { confirmation?: any; success: boolean; error?: string; code?: string };
type VerifyResult = { user?: any; success: boolean; error?: string; code?: string };

async function webSend(phone: string): Promise<SendResult> {
  try {
    const containerId = 'recaptcha-container';
    
    // Ensure container exists and is visible
    let container = document.getElementById(containerId);
    if (!container) {
      container = document.createElement('div');
      container.id = containerId;
      container.style.cssText = 'position:fixed;bottom:8px;left:8px;z-index:9999;';
      document.body.appendChild(container);
    } else {
      container.style.display = 'block';
    }
    
    console.log('Setting up reCAPTCHA with container:', containerId);
    
    // Clear any existing reCAPTCHA
    if ((window as any).grecaptcha && (window as any).grecaptcha.reset) {
      try {
        (window as any).grecaptcha.reset();
      } catch (e) {
        console.log('No existing reCAPTCHA to reset');
      }
    }
    
    const verifier = setupRecaptcha(containerId, { 
      size: 'invisible',
      callback: () => {
        console.log('reCAPTCHA callback triggered');
      },
      'expired-callback': () => {
        console.log('reCAPTCHA expired');
      },
      'error-callback': (error: any) => {
        console.error('reCAPTCHA error:', error);
      }
    });
    
    console.log('Rendering reCAPTCHA...');
    // @ts-ignore
    await verifier.render?.();
    
    console.log('Sending OTP for phone:', phone);
    
    // Add a small delay to prevent rapid requests
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const res: any = await signInWithPhone(phone, verifier);
    console.log('signInWithPhone result:', res);
    
    if (res?.success) {
      console.log('OTP sent successfully, confirmation result:', res.confirmationResult);
      return { confirmation: res.confirmationResult, success: true };
    }
    
    // Handle specific reCAPTCHA errors
    if (res?.code === 'auth/invalid-app-credential') {
      console.error('reCAPTCHA configuration issue. Please check Firebase console settings.');
      
      const errorMessage = `Firebase reCAPTCHA configuration error. 
      
Please configure Firebase Console:
1. Go to Authentication → Sign-in method → Enable Phone
2. Go to Authentication → Settings → reCAPTCHA → Enable v2
3. Add domains: localhost, 127.0.0.1, your-production-domain

Error Code: ${res?.code}`;
      
      return { 
        success: false, 
        error: errorMessage, 
        code: res?.code 
      };
    }
    
    // Handle rate limiting
    if (res?.code === 'auth/too-many-requests') {
      console.error('Rate limit exceeded for this phone number.');
      
      const errorMessage = `Too many OTP requests for this phone number.
      
Please wait 60 minutes before trying again, or use a different phone number for testing.

Error Code: ${res?.code}`;
      
      return { 
        success: false, 
        error: errorMessage, 
        code: res?.code 
      };
    }
    
    console.error('Failed to send OTP:', res);
    return { success: false, error: res?.error, code: res?.code };
  } catch (e: any) {
    console.error('webSend error:', e);
    return { success: false, error: e?.message, code: e?.code };
  }
}

async function webVerify(confirmation: any, code: string): Promise<VerifyResult> {
  try {
    const res: any = await verifyOTP(confirmation, code);
    if (res?.success) return { user: res.user, success: true };
    return { success: false, error: res?.error, code: res?.code };
  } catch (e: any) {
    return { success: false, error: e?.message, code: e?.code };
  }
}

export async function sendOTP(phone: string): Promise<SendResult> {
  return webSend(phone);
}

export async function confirmOTP(confirmation: any, code: string): Promise<VerifyResult> {
  return webVerify(confirmation, code);
}

