'use client';

import React, { useState } from 'react';
import { Copy, MessageCircle, Mail, Smartphone } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { referralsApi } from '@/lib/api/endpoints/referrals';
import LoadingSpinner from '../LoadingSpinner';
import { toast } from 'sonner';

interface ReferralSimpleProps {
  className?: string;
}

export default function ReferralDashboardSimple({ className = '' }: ReferralSimpleProps) {
  const [copied, setCopied] = useState(false);

  const { data: dashboard, isLoading, error } = useQuery({
    queryKey: ['referralSimple'],
    queryFn: () => referralsApi.getDashboard(),
    staleTime: 5 * 60 * 1000,
  });

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
        <p className="text-red-600 font-medium">Failed to load referral dashboard</p>
        <p className="text-sm text-red-500 mt-2">Please try refreshing the page</p>
      </div>
    );
  }

  if (!dashboard || !dashboard.referralCode) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
        <p className="text-yellow-800 font-medium">Referral code not available</p>
        <p className="text-sm text-yellow-600 mt-2">Your referral code is being generated. Please check back soon.</p>
      </div>
    );
  }

  const handleCopyCode = async () => {
    try {
      const shareUrl = dashboard.referralLink || `${window.location.origin}/signup?ref=${dashboard.referralCode}`;
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      toast.success('Referral link copied!');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error('Failed to copy');
    }
  };

  const handleShare = (platform: string) => {
    const shareUrl = dashboard.referralLink || `${window.location.origin}/signup?ref=${dashboard.referralCode}`;
    const message = `Join me on ExtraHand and earn credits! Use my referral code: ${dashboard.referralCode}`;

    const shareLinks = {
      whatsapp: `https://wa.me/?text=${encodeURIComponent(message + ' ' + shareUrl)}`,
      email: `mailto:?subject=Join ExtraHand&body=${encodeURIComponent(message)}`,
      sms: `sms:?body=${encodeURIComponent(message)}`,
    };

    if (platform in shareLinks) {
      window.open(shareLinks[platform as keyof typeof shareLinks], '_blank');
      toast.success(`Opening ${platform}...`);
    }
  };

  const totalReferrals = dashboard.totalReferrals || 0;
  const successfulReferrals = dashboard.successfulReferrals || 0;

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Main Referral Card */}
      <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg border-2 border-blue-200 p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Your Referral Code</h2>

        {/* Code Display */}
        <div className="bg-white rounded-lg p-6 mb-6 border border-blue-200">
          <p className="text-gray-600 text-sm mb-2">Unique Referral Code</p>
          <div className="flex items-center justify-between">
            <span className="text-4xl font-bold text-blue-600 font-mono">{dashboard.referralCode}</span>
            <button
              onClick={handleCopyCode}
              className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-colors ${
                copied
                  ? 'bg-green-500 text-white'
                  : 'bg-blue-500 hover:bg-blue-600 text-white'
              }`}
            >
              <Copy size={18} />
              {copied ? 'Copied!' : 'Copy'}
            </button>
          </div>
        </div>

        {/* Share Buttons */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <button
            onClick={() => handleShare('whatsapp')}
            className="flex items-center justify-center gap-2 px-4 py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg transition-all shadow-sm hover:shadow-md"
          >
            <MessageCircle size={18} />
            <span className="hidden sm:inline text-sm font-medium">WhatsApp</span>
          </button>
          <button
            onClick={() => handleShare('email')}
            className="flex items-center justify-center gap-2 px-4 py-3 bg-sky-500 hover:bg-sky-600 text-white rounded-lg transition-all shadow-sm hover:shadow-md"
          >
            <Mail size={18} />
            <span className="hidden sm:inline text-sm font-medium">Email</span>
          </button>
          <button
            onClick={() => handleShare('sms')}
            className="flex items-center justify-center gap-2 px-4 py-3 bg-fuchsia-500 hover:bg-fuchsia-600 text-white rounded-lg transition-all shadow-sm hover:shadow-md"
          >
            <Smartphone size={18} />
            <span className="hidden sm:inline text-sm font-medium">SMS</span>
          </button>
          <button
            onClick={handleCopyCode}
            className="flex items-center justify-center gap-2 px-4 py-3 bg-slate-600 hover:bg-slate-700 text-white rounded-lg transition-all shadow-sm hover:shadow-md"
          >
            <Copy size={18} />
            <span className="hidden sm:inline text-sm font-medium">Copy</span>
          </button>
        </div>
      </div>

      {/* Referrals Stats */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Your Referrals</h3>
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <p className="text-3xl font-bold text-blue-600">{totalReferrals}</p>
            <p className="text-sm text-gray-600">Total Referred</p>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <p className="text-3xl font-bold text-green-600">{successfulReferrals}</p>
            <p className="text-sm text-gray-600">Downloaded</p>
          </div>
        </div>

        {/* Referred People List - Show based on recentTransactions */}
        {dashboard.recentTransactions && dashboard.recentTransactions.length > 0 ? (
          <div>
            <h4 className="font-semibold text-gray-900 mb-3">Recent Activity</h4>
            <div className="space-y-2">
              {dashboard.recentTransactions.slice(0, 5).map((transaction, idx) => (
                <div
                  key={transaction.transactionId || idx}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div>
                    <p className="font-medium text-gray-900">{transaction.description}</p>
                    <p className="text-xs text-gray-500">
                      {new Date(transaction.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      transaction.status === 'completed'
                        ? 'bg-green-100 text-green-800'
                        : transaction.status === 'failed'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}
                  >
                    {transaction.status === 'completed' ? '✓ Done' : transaction.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-8 bg-gray-50 rounded-lg">
            <p className="text-gray-500">No referrals yet. Share your code to get started!</p>
          </div>
        )}
      </div>
    </div>
  );
}
