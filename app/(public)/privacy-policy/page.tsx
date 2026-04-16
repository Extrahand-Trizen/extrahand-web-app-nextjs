import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Privacy Policy | ExtraHand',
  description: 'Privacy Policy for ExtraHand platform operated by Naipunya AI Labs Private Limited',
};

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8 md:py-12 max-w-4xl">
        <h1 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900">Privacy Policy</h1>
        
        <div className="prose prose-gray max-w-none bg-white rounded-lg shadow-sm p-6 md:p-8">
          <p className="text-lg font-semibold mb-4 text-gray-900">
            This Privacy Policy describes how <strong>Naipunya AI Labs Private Limited</strong> ("we", "our", "us") 
            collects, uses, and protects personal information through the ExtraHand platform.
          </p>
          
          <p className="mb-6 text-gray-700">
            ExtraHand is owned and operated by <strong>Naipunya AI Labs Private Limited</strong>, India.
          </p>

          <p className="mb-6 text-gray-700">
            <strong>Effective date:</strong> April 16, 2026
          </p>

          <h2 className="text-2xl font-bold mt-8 mb-4 text-gray-900">Information We Collect</h2>
          <p className="mb-4 text-gray-700">
            We may collect the following personal information:
          </p>
          <ul className="list-disc pl-6 mb-6 space-y-2 text-gray-700">
            <li>Name, email address, phone number</li>
            <li>Government-issued identification details such as PAN and Aadhaar (for KYC purposes)</li>
            <li>Payment-related information (processed securely via third-party payment gateways)</li>
            <li>Location data for task matching</li>
            <li>Device and usage data for security and analytics</li>
          </ul>

          <h2 className="text-2xl font-bold mt-8 mb-4 text-gray-900">How We Use Your Information</h2>
          <p className="mb-4 text-gray-700">
            We collect personal data to:
          </p>
          <ul className="list-disc pl-6 mb-6 space-y-2 text-gray-700">
            <li>Verify user identity and prevent fraud</li>
            <li>Enable secure payments and payouts</li>
            <li>Match users with suitable taskers</li>
            <li>Comply with legal and regulatory requirements</li>
            <li>Improve platform functionality and user experience</li>
          </ul>

          <h2 className="text-2xl font-bold mt-8 mb-4 text-gray-900">Third-Party Services</h2>
          <p className="mb-4 text-gray-700">
            We may use trusted third-party services such as payment gateways, KYC 
            verification providers, and analytics tools to operate the platform.
            These services process data in accordance with their respective privacy policies.
          </p>
          <p className="mb-6 text-gray-700">
            Payment and identity verification services, where applicable, are provided 
            by RBI-compliant service providers.
          </p>

          <h2 className="text-2xl font-bold mt-8 mb-4 text-gray-900">Data Security</h2>
          <p className="mb-6 text-gray-700">
            We implement reasonable technical and organizational security measures to 
            protect user data against unauthorized access, loss, or misuse.
          </p>

          <h2 className="text-2xl font-bold mt-8 mb-4 text-gray-900">Data Retention</h2>
          <p className="mb-6 text-gray-700">
            We retain personal data only for as long as needed to provide services,
            meet legal or regulatory obligations, resolve disputes, and enforce our terms.
          </p>

          <h2 className="text-2xl font-bold mt-8 mb-4 text-gray-900">Cookies and Consent</h2>
          <p className="mb-6 text-gray-700">
            We use essential cookies for core functionality and optional cookies for analytics
            and map embeds only after consent. For details, see our <Link href="/cookie-policy" className="underline text-gray-800">Cookie Policy</Link>.
          </p>

          <h2 className="text-2xl font-bold mt-8 mb-4 text-gray-900">Your Rights</h2>
          <p className="mb-4 text-gray-700">
            Subject to applicable law, users may request access, correction, or deletion of
            personal data by contacting us at support@extrahand.in.
          </p>
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6">
            <p className="text-gray-800 font-medium mb-3">
              Want to delete your account? You can request account deletion here:
            </p>
            <Link
              href="/delete-account"
              className="inline-block px-6 py-3 border border-gray-300 text-gray-900 font-semibold rounded-lg hover:bg-gray-100 transition-colors"
            >
              Delete My Account
            </Link>
          </div>

          <h2 className="text-2xl font-bold mt-8 mb-4 text-gray-900">Policy Updates</h2>
          <p className="mb-6 text-gray-700">
            We may update this Privacy Policy from time to time. The latest version will always
            be posted on this page.
          </p>

          <h2 className="text-2xl font-bold mt-8 mb-4 text-gray-900">Contact Us</h2>
          <p className="mb-4 text-gray-700">
            For any privacy-related concerns, contact:
          </p>
          <div className="mb-6 text-gray-700">
            <p className="font-semibold">Naipunya AI Labs Private Limited</p>
            <p>Email: support@extrahand.in</p>
            <p>Website: https://extrahand.in</p>
          </div>

          <div className="border-t pt-6 mt-8">
            <p className="text-sm text-gray-500">
              © {new Date().getFullYear()} Naipunya AI Labs Private Limited. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
