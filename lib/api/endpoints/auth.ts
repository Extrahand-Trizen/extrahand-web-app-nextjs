
export const authApi = {
   /**
    * Check if phone number exists
    * POST /api/v1/auth/check-phone
    */
   async checkPhone(
      phone: string
   ): Promise<{ success: boolean; exists: boolean; phone: string }> {
      // This is a public endpoint, so we need to use fetch directly without auth
      const { getApiBaseUrl } = await import("@/lib/config");
      const baseUrl = getApiBaseUrl().replace(/\/$/, "");
      const url = `${baseUrl}/api/v1/auth/check-phone`;

      const response = await fetch(url, {
         method: "POST",
         headers: {
            "Content-Type": "application/json",
         },
         body: JSON.stringify({ phone }),
      });

      if (!response.ok) {
         const error = await response
            .json()
            .catch(() => ({ error: "Failed to check phone" }));
         throw new Error(error.error || "Failed to check phone");
      }

      return response.json();
   },

   /**
    * Complete OTP authentication
    * POST /api/v1/auth/otp/complete
    */
   async completeOTP(
      idToken: string,
      mode: "login" | "signup",
      phone: string,
      name?: string
   ): Promise<{ success: boolean; profile?: any; user?: any; error?: string }> {
      // This is a public endpoint (no auth header needed, but requires ID token in body)
      const { getApiBaseUrl } = await import("@/lib/config");
      const baseUrl = getApiBaseUrl().replace(/\/$/, "");
      const url = `${baseUrl}/api/v1/auth/otp/complete`;

      const response = await fetch(url, {
         method: "POST",
         headers: {
            "Content-Type": "application/json",
         },
         body: JSON.stringify({ idToken, mode, phone, name }),
      });

      if (!response.ok) {
         const error = await response
            .json()
            .catch(() => ({ error: "Failed to complete OTP" }));
         throw new Error(error.error || "Failed to complete OTP");
      }

      return response.json();
   },
};
