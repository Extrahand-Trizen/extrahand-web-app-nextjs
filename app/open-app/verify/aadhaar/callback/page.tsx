/**
 * Public redirect page: DigiLocker (Cashfree) redirects here after Aadhaar verification.
 * Cashfree requires redirect_url to start with https, so we use this HTTPS page
 * and immediately redirect to the mobile app deep link (extrahand://).
 * Used by the ExtraHand Android/iOS app so the user returns to the app.
 */

"use client";

import React, { useEffect, useState } from "react";

const APP_DEEP_LINK = "extrahand://verify/aadhaar/callback";

export default function OpenAppAadhaarCallbackPage() {
  const [didRedirect, setDidRedirect] = useState(false);

  useEffect(() => {
    if (didRedirect) return;
    setDidRedirect(true);
    window.location.href = APP_DEEP_LINK;
  }, [didRedirect]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-gray-50">
      <p className="text-gray-600 text-center">
        Opening ExtraHand app…
      </p>
      <p className="mt-4 text-sm text-gray-500 text-center">
        If the app does not open,{" "}
        <a
          href={APP_DEEP_LINK}
          className="text-primary-600 hover:underline"
        >
          tap here
        </a>
        .
      </p>
    </div>
  );
}
