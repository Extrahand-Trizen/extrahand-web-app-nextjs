import { Metadata } from 'next';

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

          <h2 className="text-2xl font-bold mt-8 mb-4 text-gray-900">Your Rights</h2>
          <p className="mb-6 text-gray-700">
            Users may request access, correction, or deletion of their personal data 
            by contacting us at support@extrahand.in.
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
