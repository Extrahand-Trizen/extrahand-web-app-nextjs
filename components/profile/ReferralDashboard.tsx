'use client';

import React, { useState } from 'react';
import {
  Copy,
  Share2,
  MessageCircle,
  Mail,
  Smartphone,
  TrendingUp,
  ExternalLink,
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import {
  getReferralDashboard,
  shareReferralLink,
  copyReferralCode,
  generateReferralShareUrl,
} from '@/lib/api/referral';
import type { ReferralDashboardData } from '@/types/referral';
import LoadingSpinner from '../LoadingSpinner';
import { toast } from 'sonner';

interface ReferralDashboardProps {
  className?: string;
}

export default function ReferralDashboardComponent({ className = '' }: ReferralDashboardProps) {
  const [copied, setCopied] = useState(false);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [activeTab, setActiveTab] = useState<'overview' | 'transactions' | 'how-it-works'>('overview');

  const {
    data: dashboardData,
    isLoading,
    error,
  } = useQuery<ReferralDashboardData>({
    queryKey: ['referralDashboard'],
    queryFn: getReferralDashboard,
    staleTime: 5 * 60 * 1000,
    retry: 2,
  });

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    toast.error('Failed to load referral dashboard');
    return null;
  }

  if (!dashboardData) {
    return null;
  }

  const handleCopyCode = () => {
    if (copyReferralCode(dashboardData.referralCode)) {
      setCopied(true);
      toast.success('Referral code copied!');
      setTimeout(() => setCopied(false), 2000);
    } else {
      toast.error('Failed to copy code');
    }
  };

  const handleShare = (platform: 'whatsapp' | 'telegram' | 'sms' | 'email' | 'copy') => {
    if (platform === 'copy') {
      handleCopyCode();
    } else {
      shareReferralLink(dashboardData.referralCode, platform);
      toast.success(`Opening ${platform}...`);
    }
  };

  const shareButtons = [
    { icon: MessageCircle, label: 'WhatsApp', platform: 'whatsapp' as const, color: 'bg-green-500 hover:bg-green-600' },
    { icon: Mail, label: 'Email', platform: 'email' as const, color: 'bg-blue-500 hover:bg-blue-600' },
    { icon: Smartphone, label: 'SMS', platform: 'sms' as const, color: 'bg-purple-500 hover:bg-purple-600' },
    { icon: Copy, label: 'Copy Link', platform: 'copy' as const, color: 'bg-gray-600 hover:bg-gray-700' },
  ];

  return (
    <div className={`w-full max-w-5xl mx-auto ${className}`}>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Referral Program</h1>
        <p className="text-gray-600 text-lg">Share your code and earn credits for every successful referral</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 mb-8 border-b border-gray-200">
        {(['overview', 'transactions', 'how-it-works'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-6 py-3 font-medium transition-colors ${
              activeTab === tab
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            {tab === 'overview' && 'Overview'}
            {tab === 'transactions' && 'Transactions'}
            {tab === 'how-it-works' && 'How It Works'}
          </button>
        ))}
      </div>

      {/* OVERVIEW TAB */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Referral Code Card */}
          <div className="bg-white rounded-xl shadow-lg p-8 border-l-4 border-blue-500">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Your Referral Code</h2>
            <div className="flex items-center gap-4 mb-6">
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-8 py-4 rounded-lg font-bold text-3xl tracking-widest">
                {dashboardData.referralCode}
              </div>
              <button
                onClick={handleCopyCode}
                className={`flex items-center gap-2 px-6 py-4 rounded-lg font-medium transition-all ${
                  copied
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                <Copy size={20} />
                {copied ? 'Copied!' : 'Copy'}
              </button>
            </div>

            {/* Referral Link */}
            <p className="text-sm font-medium text-gray-600 mb-3">Your Referral Link:</p>
            <div className="flex items-center gap-2 bg-gray-50 p-4 rounded-lg border border-gray-200 mb-4">
              <input
                type="text"
                value={generateReferralShareUrl(dashboardData.referralCode)}
                readOnly
                className="flex-1 bg-transparent text-gray-700 text-sm outline-none"
              />
              <button onClick={handleCopyCode} className="text-blue-600 hover:text-blue-700 p-2">
                <Copy size={20} />
              </button>
              <a
                href={generateReferralShareUrl(dashboardData.referralCode)}
                target="_blank"
                className="text-blue-600 hover:text-blue-700 p-2"
              >
                <ExternalLink size={20} />
              </a>
            </div>
          </div>

          {/* Share Options */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
              <Share2 size={24} /> Share Your Code
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {shareButtons.map((btn) => {
                const Icon = btn.icon;
                return (
                  <button
                    key={btn.platform}
                    onClick={() => handleShare(btn.platform)}
                    className={`flex flex-col items-center gap-3 py-6 px-4 rounded-lg text-white font-medium transition-all ${btn.color}`}
                  >
                    <Icon size={24} />
                    <span>{btn.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-lg shadow-md p-6 border-t-4 border-blue-500">
              <p className="text-gray-600 text-sm font-medium mb-2">Total Referrals</p>
              <p className="text-3xl font-bold text-gray-900">{dashboardData.stats.totalReferrals}</p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6 border-t-4 border-yellow-500">
              <p className="text-gray-600 text-sm font-medium mb-2">Pending</p>
              <p className="text-3xl font-bold text-gray-900">{dashboardData.stats.pendingReferrals}</p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6 border-t-4 border-green-500">
              <p className="text-gray-600 text-sm font-medium mb-2">Qualified</p>
              <p className="text-3xl font-bold text-gray-900">{dashboardData.stats.qualifiedReferrals}</p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6 border-t-4 border-purple-500">
              <p className="text-gray-600 text-sm font-medium mb-2">Conversion Rate</p>
              <p className="text-3xl font-bold text-gray-900">
                {dashboardData.stats.totalReferrals > 0
                  ? Math.round((dashboardData.stats.qualifiedReferrals / dashboardData.stats.totalReferrals) * 100)
                  : 0}
                %
              </p>
            </div>
          </div>

          {/* Credits Card */}
          <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl shadow-lg p-8 text-white">
            <h2 className="text-2xl font-semibold mb-2">Available Credits</h2>
            <p className="text-5xl font-bold mb-8">â‚¹{dashboardData.stats.currentCreditBalance}</p>
            <div className="flex gap-3 flex-wrap">
              <button
                onClick={() => setShowWithdrawModal(true)}
                className="flex-1 min-w-32 bg-white text-green-600 font-medium py-3 rounded-lg hover:bg-gray-100 transition-colors"
              >
                Withdraw
              </button>
              <button
                onClick={() => toast.info('Gift feature coming soon')}
                className="flex-1 min-w-32 bg-white text-green-600 font-medium py-3 rounded-lg hover:bg-gray-100 transition-colors"
              >
                Gift Credits
              </button>
              <button
                onClick={() => toast.info('Use credits on tasks')}
                className="flex-1 min-w-32 bg-white text-green-600 font-medium py-3 rounded-lg hover:bg-gray-100 transition-colors"
              >
                Use Credits
              </button>
            </div>
          </div>

          {/* Earnings Breakdown */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Earnings Breakdown</h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                <span className="text-gray-700 font-medium">Total Credits Earned</span>
                <span className="font-bold text-2xl text-green-600">â‚¹{dashboardData.stats.totalCreditsEarned}</span>
              </div>
              <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                <span className="text-gray-700 font-medium">From {dashboardData.stats.qualifiedReferrals} Qualified Referrals</span>
                <span className="font-bold text-lg">â‚¹{dashboardData.stats.qualifiedReferrals * 100}</span>
              </div>
              <div className="flex justify-between items-center p-4 bg-blue-50 rounded-lg border border-blue-200">
                <span className="text-gray-700 font-medium">Current Balance Available</span>
                <span className="font-bold text-lg text-blue-600">â‚¹{dashboardData.stats.currentCreditBalance}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TRANSACTIONS TAB */}
      {activeTab === 'transactions' && (
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Credit Transaction History</h2>
          {dashboardData.creditTransactions.length > 0 ? (
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {dashboardData.creditTransactions.map((txn, idx) => (
                <div key={idx} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex-1">
                    <p className="text-gray-900 font-medium">{txn.description}</p>
                    <p className="text-sm text-gray-600">{new Date(txn.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div className="text-right">
                    <p className={`font-bold text-lg ${txn.type === 'referral' ? 'text-green-600' : 'text-gray-900'}`}>
                      {['referral', 'badge', 'gift_received'].includes(txn.type) ? '+' : '-'}â‚¹{txn.amount}
                    </p>
                    <p className="text-xs text-gray-600 capitalize">{txn.type}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <TrendingUp className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-600">No transactions yet. Share your referral code to start earning!</p>
            </div>
          )}
        </div>
      )}

      {/* HOW IT WORKS TAB */}
      {activeTab === 'how-it-works' && (
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-8">How the Referral Program Works</h2>

          <div className="space-y-8">
            {/* Steps */}
            {[
              {
                num: '1',
                title: 'Share Your Code',
                desc: `Share your unique referral code ${dashboardData.referralCode} with friends via WhatsApp, email, SMS, or social media.`,
              },
              {
                num: '2',
                title: 'They Sign Up',
                desc: 'Your friend signs up using your code and creates their profile. They can browse and apply for tasks immediately.',
              },
              {
                num: '3',
                title: 'They Complete a Task',
                desc: 'Your friend completes their first task of â‚¹500 or more within 30 days and payment is processed.',
              },
              {
                num: 'âœ“',
                title: 'You Earn Credits!',
                desc: 'You get â‚¹100 credit, and your friend gets â‚¹50 credit + 3% fee discount on their first transaction!',
              },
            ].map((step, idx) => (
              <div key={idx} className="flex gap-6">
                <div className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center font-bold text-white text-lg ${step.num === 'âœ“' ? 'bg-green-600' : 'bg-blue-600'}`}>
                  {step.num}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{step.title}</h3>
                  <p className="text-gray-700">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Important Notes */}
          <div className="mt-10 p-6 bg-amber-50 border-l-4 border-amber-500 rounded-lg">
            <h4 className="font-semibold text-gray-900 mb-4 text-lg">Important Terms:</h4>
            <ul className="text-gray-700 space-y-2 list-disc list-inside">
              <li>Referral code must be used during signup (expires after 30 days)</li>
              <li>Task must be â‚¹500+ and completed with payment successfully processed</li>
              <li>Each email can only be referred once to the platform</li>
              <li>Credits cannot be used to refer (only earned referrals count)</li>
              <li>Self-referral attempts are automatically blocked</li>
              <li>Credits expire after 1 year if not used</li>
            </ul>
          </div>

          {/* Uses for Credits */}
          <div className="mt-10">
            <h4 className="font-semibold text-gray-900 mb-6 text-lg">What Can You Do With Credits?</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { icon: 'ðŸ’³', title: 'Pay for Tasks', desc: 'Use credits to pay when posting service requests' },
                { icon: 'ðŸ“‰', title: 'Reduce Fees', desc: 'Reduce platform fees on your payments' },
                { icon: 'ðŸ¦', title: 'Withdraw Cash', desc: 'Withdraw to your bank account (â‚¹500 minimum)' },
                { icon: 'ðŸŽ', title: 'Gift to Friends', desc: 'Send credits to your friends on the platform' },
              ].map((item, idx) => (
                <div key={idx} className="p-5 border border-gray-200 rounded-lg hover:border-blue-300 transition-colors">
                  <h5 className="text-xl font-medium text-gray-900 mb-2">{item.icon} {item.title}</h5>
                  <p className="text-gray-600">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Withdraw Modal */}
      {showWithdrawModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-8 max-w-md w-full">
            <h3 className="text-2xl font-semibold text-gray-900 mb-4">Withdraw Credits</h3>
            <p className="text-gray-600 mb-6">
              Available balance: <span className="font-bold text-xl text-green-600">â‚¹{dashboardData.stats.currentCreditBalance}</span>
            </p>
            <input
              type="number"
              value={withdrawAmount}
              onChange={(e) => setWithdrawAmount(e.target.value)}
              placeholder="Enter amount"
              min="500"
              max={dashboardData.stats.currentCreditBalance}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg mb-3 focus:outline-none focus:border-blue-500"
            />
            <p className="text-sm text-gray-600 mb-6">Minimum withdrawal: â‚¹500</p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowWithdrawModal(false)}
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  toast.success('Withdrawal initiated! Check your bank account within 2-3 business days.');
                  setShowWithdrawModal(false);
                  setWithdrawAmount('');
                }}
                className="flex-1 px-4 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={!withdrawAmount || parseFloat(withdrawAmount) < 500}
              >
                Withdraw
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
