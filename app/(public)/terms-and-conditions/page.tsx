import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms and Conditions | ExtraHand',
  description: 'Terms and Conditions for ExtraHand platform operated by Naipunya AI Labs Private Limited',
};

export default function TermsAndConditions() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8 md:py-12 max-w-4xl">
        <h1 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900">Terms and Conditions</h1>
        
        <div className="prose prose-gray max-w-none bg-white rounded-lg shadow-sm p-6 md:p-8">
          <p className="text-lg font-semibold mb-6 text-gray-900">
            These Terms and Conditions govern the use of the ExtraHand platform, 
            which is owned and operated by <strong>Naipunya AI Labs Private Limited</strong>.
          </p>

          <h2 className="text-2xl font-bold mt-8 mb-4 text-gray-900">Platform Role</h2>
          <p className="mb-6 text-gray-700">
            ExtraHand acts as a technology platform to connect users with independent 
            taskers. Naipunya AI Labs Private Limited does not directly provide task services 
            and is not responsible for the execution of tasks.
          </p>
          <p className="mb-6 text-gray-700">
            Any disputes between users and taskers are to be resolved directly between 
            the parties, and Naipunya AI Labs Private Limited shall not be a party to such disputes.
          </p>

          <h2 className="text-2xl font-bold mt-8 mb-4 text-gray-900">Prohibited Activities</h2>
          <p className="mb-4 text-gray-700">
            You must not:
          </p>
          <ul className="list-disc pl-6 mb-6 space-y-2 text-gray-700">
            <li>Provide false or misleading information</li>
            <li>Engage in fraudulent activities</li>
            <li>Harass, threaten, or abuse other users</li>
            <li>Attempt to circumvent platform fees</li>
            <li>Use the platform for illegal activities</li>
            <li>Share inappropriate content</li>
          </ul>

          <h2 className="text-2xl font-bold mt-8 mb-4 text-gray-900">Payments</h2>
          <p className="mb-4 text-gray-700">
            All payments on the platform, where applicable, are processed through secure 
            third-party payment gateways. Naipunya AI Labs Private Limited does not store sensitive 
            payment information.
          </p>
          <p className="mb-6 text-gray-700">
            Payments may be held temporarily to ensure successful task completion 
            before release to taskers.
          </p>

          <h2 className="text-2xl font-bold mt-8 mb-4 text-gray-900">Identity Verification (KYC)</h2>
          <p className="mb-6 text-gray-700">
            Users may be required to complete identity verification (KYC) in order 
            to access certain features such as payments or payouts.
          </p>

          <h2 className="text-2xl font-bold mt-8 mb-4 text-gray-900">Limitation of Liability</h2>
          <p className="mb-6 text-gray-700">
            Naipunya AI Labs Private Limited shall not be liable for any direct, indirect, 
            or incidental damages arising from interactions or services provided by users 
            on the platform.
          </p>

          <h2 className="text-2xl font-bold mt-8 mb-4 text-gray-900">Termination</h2>
          <p className="mb-6 text-gray-700">
            We reserve the right to suspend or terminate accounts that violate 
            these terms or applicable laws.
          </p>

          <h2 className="text-2xl font-bold mt-8 mb-4 text-gray-900">Governing Law</h2>
          <p className="mb-6 text-gray-700">
            These terms shall be governed by and interpreted in accordance with the 
            laws of India.
          </p>

          <h2 className="text-2xl font-bold mt-8 mb-4 text-gray-900">Contact Us</h2>
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
