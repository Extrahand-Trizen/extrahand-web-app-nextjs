import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cookie Policy | ExtraHand",
  description:
    "Information about how ExtraHand uses cookies and similar technologies.",
};

export default function CookiePolicyPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8 md:py-12 max-w-4xl">
        <h1 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900">
          Cookie Policy
        </h1>

        <div className="prose prose-gray max-w-none bg-white rounded-lg shadow-sm p-6 md:p-8">
          <p className="mb-4 text-gray-700">
            This Cookie Policy explains how ExtraHand, operated by{" "}
            <strong>Naipunya AI Labs Private Limited</strong>, uses cookies and
            similar technologies on our website and applications.
          </p>

          <h2 className="text-2xl font-bold mt-8 mb-4 text-gray-900">
            1. What Are Cookies?
          </h2>
          <p className="mb-6 text-gray-700">
            Cookies are small text files that are stored on your device when you
            visit a website. They help us remember your preferences, improve your
            experience, and understand how our services are used.
          </p>

          <h2 className="text-2xl font-bold mt-8 mb-4 text-gray-900">
            2. Types of Cookies We Use
          </h2>
          <ul className="list-disc pl-6 mb-6 space-y-2 text-gray-700">
            <li>
              <strong>Essential cookies:</strong> Required for the basic
              functioning of the site (e.g., login, security, session
              management).
            </li>
            <li>
              <strong>Performance and analytics cookies:</strong> Help us
              understand how users interact with our platform so we can improve
              it.
            </li>
            <li>
              <strong>Preference cookies:</strong> Remember your settings and
              choices (such as language or location preferences).
            </li>
          </ul>

          <h2 className="text-2xl font-bold mt-8 mb-4 text-gray-900">
            3. Third-Party Cookies
          </h2>
          <p className="mb-6 text-gray-700">
            We may use third-party tools (such as analytics or payment providers)
            that place their own cookies on your device. These cookies are
            governed by the respective third party&apos;s privacy and cookie
            policies.
          </p>

          <h2 className="text-2xl font-bold mt-8 mb-4 text-gray-900">
            4. Managing Cookies
          </h2>
          <p className="mb-6 text-gray-700">
            You can manage or disable cookies through your browser settings. If
            you disable certain cookies, some features of the ExtraHand platform
            may not function correctly.
          </p>

          <h2 className="text-2xl font-bold mt-8 mb-4 text-gray-900">
            5. Updates to This Policy
          </h2>
          <p className="mb-6 text-gray-700">
            We may update this Cookie Policy from time to time. Any changes will
            be posted on this page with an updated effective date.
          </p>

          <h2 className="text-2xl font-bold mt-8 mb-4 text-gray-900">
            6. Contact
          </h2>
          <p className="mb-4 text-gray-700">
            If you have any questions about this Cookie Policy, please contact:
          </p>
          <div className="mb-6 text-gray-700">
            <p className="font-semibold">Naipunya AI Labs Private Limited</p>
            <p>Email: support@extrahand.in</p>
            <p>Website: https://extrahand.in</p>
          </div>

          <p className="text-xs text-gray-500 mt-8">
            This policy may be updated from time to time. The latest version will
            always be available on this page.
          </p>
        </div>
      </div>
    </div>
  );
}

