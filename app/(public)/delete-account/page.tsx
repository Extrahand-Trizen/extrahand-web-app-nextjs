'use client';

import { useState } from 'react';
import Link from 'next/link';
import { AlertCircle, ChevronLeft } from 'lucide-react';

export default function DeleteAccountPage() {
  const [step, setStep] = useState<'confirmation' | 'confirm'>('confirmation');
  const [agreed, setAgreed] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8 md:py-12 max-w-2xl">
        {/* Header with back button */}
        <div className="mb-8 flex items-center">
          <Link 
            href="/privacy-policy"
            className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium"
          >
            <ChevronLeft className="w-4 h-4" />
            Back to Privacy Policy
          </Link>
        </div>

        {step === 'confirmation' && (
          <div className="bg-white rounded-lg shadow-sm p-6 md:p-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900">Delete Account</h1>
            
            {/* Warning Alert */}
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 flex gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-red-900 mb-1">This action cannot be undone</h3>
                <p className="text-red-800 text-sm">
                  Deletion is processed after a 24-48 hour grace period, during which you can cancel the request.
                </p>
              </div>
            </div>

            {/* Information Section */}
            <div className="mb-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">What will be deleted:</h2>
              <ul className="space-y-3 text-gray-700">
                <li className="flex gap-3">
                  <span className="text-red-600 font-bold">•</span>
                  <span>Your personal profile data (name, phone, email, address, photo)</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-red-600 font-bold">•</span>
                  <span>Sensitive verification/payment profile details (PAN/bank related profile fields)</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-red-600 font-bold">•</span>
                  <span>Public identity on existing records, replaced with &quot;Helper (account deleted)&quot; or &quot;Customer (account deleted)&quot;</span>
                </li>
              </ul>
            </div>

            {/* What is retained */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8">
              <h3 className="font-semibold text-blue-900 mb-2">What we retain:</h3>
              <p className="text-blue-800 text-sm mb-2">
                Task history and payment/transaction records are retained for legal compliance, audits, payouts, refunds, and dispute handling.
              </p>
            </div>

            {/* Checkbox */}
            <div className="mb-8">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={agreed}
                  onChange={(e) => setAgreed(e.target.checked)}
                  className="w-5 h-5 text-red-600 rounded mt-0.5"
                />
                <span className="text-gray-700">
                  I understand account deletion is scheduled with a 24-48 hour cancellation window and that legal transaction records are retained.
                </span>
              </label>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4">
              <Link
                href="/privacy-policy"
                className="flex-1 px-6 py-3 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300 transition-colors text-center"
              >
                Cancel
              </Link>
              <button
                onClick={() => setStep('confirm')}
                disabled={!agreed}
                className={`flex-1 px-6 py-3 font-semibold rounded-lg transition-colors ${
                  agreed
                    ? 'bg-red-600 text-white hover:bg-red-700'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                Continue to Delete
              </button>
            </div>
          </div>
        )}

        {step === 'confirm' && (
          <div className="bg-white rounded-lg shadow-sm p-6 md:p-8">
            <h1 className="text-3xl font-bold mb-4 text-gray-900">Confirm Account Deletion</h1>
            
            {/* Final Warning */}
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 flex gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-red-900 mb-1">Final confirmation required</h3>
                <p className="text-red-800 text-sm">
                  Please confirm that you want to permanently delete your account.
                </p>
              </div>
            </div>

            <p className="text-gray-700 mb-8">
              To confirm, enter your email address associated with your account:
            </p>

            {/* Email Confirmation */}
            <div className="mb-8">
              <input
                type="email"
                placeholder="you@example.com"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>

            {/* Final Buttons */}
            <div className="flex gap-4">
              <button
                onClick={() => setStep('confirmation')}
                className="flex-1 px-6 py-3 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300 transition-colors"
              >
                Back
              </button>
              <button
                disabled
                className="flex-1 px-6 py-3 bg-gray-300 text-gray-500 font-semibold rounded-lg cursor-not-allowed"
                title="Demo UI - No actual deletion will occur"
              >
                Delete My Account (Demo)
              </button>
            </div>

            {/* Demo Notice */}
            <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg text-center">
              <p className="text-yellow-800 text-sm font-medium">
                ⚠️ This is a demo page. No actual deletion will occur.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
