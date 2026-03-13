'use client';

import React, { useState } from 'react';
import { Copy, MessageCircle, Mail, Share2, Users, TrendingUp, Gift, Check } from 'lucide-react';
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
    return (
      <div className={`space-y-6 ${className}`}>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          <div className="h-6 w-48 bg-gray-200 rounded animate-pulse mb-6" />
          <div className="h-24 bg-gray-100 rounded-lg animate-pulse" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="h-32 bg-white rounded-xl border border-gray-200 animate-pulse" />
          <div className="h-32 bg-white rounded-xl border border-gray-200 animate-pulse" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-red-200 p-8 text-center">
        <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-red-600 text-xl">⚠</span>
        </div>
        <p className="text-gray-900 font-semibold mb-2">Unable to Load Referral Dashboard</p>
        <p className="text-sm text-gray-500">Please refresh the page or try again later.</p>
      </div>
    );
  }

  if (!dashboard || !dashboard.referralCode) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
        <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Gift className="w-6 h-6 text-gray-400" />
        </div>
        <p className="text-gray-900 font-semibold mb-2">Generating Your Referral Code</p>
        <p className="text-sm text-gray-500">Your unique referral code is being created. Please check back in a moment.</p>
      </div>
    );
  }

  const handleCopyCode = async () => {
    try {
      const shareUrl = dashboard.referralLink || `${window.location.origin}/signup?ref=${dashboard.referralCode}`;
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      toast.success('Referral link copied to clipboard');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error('Failed to copy link');
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
      {/* Header Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">Invite Friends & Earn Rewards</h2>
            <p className="text-gray-600">Share your unique referral code and get rewarded when friends join ExtraHand.</p>
          </div>
          <div className="hidden md:flex w-12 h-12 bg-gray-50 rounded-lg items-center justify-center">
            <Gift className="w-6 h-6 text-gray-700" />
          </div>
        </div>

        {/* Referral Code Display */}
        <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
          <label className="block text-sm font-medium text-gray-700 mb-3">Your Referral Code</label>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="flex-1 bg-white border-2 border-gray-300 rounded-lg px-4 py-3 font-mono text-xl font-semibold text-gray-900 tracking-wider">
              {dashboard.referralCode}
            </div>
            <button
              onClick={handleCopyCode}
              className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-2 ${
                copied
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-900 hover:bg-gray-800 text-white shadow-sm hover:shadow-md'
              }`}
            >
              {copied ? (
                <>
                  <Check size={18} />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Copy size={18} />
                  <span>Copy Link</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Share Options */}
        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-700 mb-3">Share via</label>
          <div className="grid grid-cols-3 gap-3">
            <button
              onClick={() => handleShare('whatsapp')}
              className="flex items-center justify-center gap-2 px-4 py-3 bg-white border-2 border-gray-200 hover:border-gray-300 hover:bg-gray-50 rounded-lg transition-all"
            >
              <MessageCircle size={18} className="text-gray-700" />
              <span className="text-sm font-medium text-gray-900">WhatsApp</span>
            </button>
            <button
              onClick={() => handleShare('email')}
              className="flex items-center justify-center gap-2 px-4 py-3 bg-white border-2 border-gray-200 hover:border-gray-300 hover:bg-gray-50 rounded-lg transition-all"
            >
              <Mail size={18} className="text-gray-700" />
              <span className="text-sm font-medium text-gray-900">Email</span>
            </button>
            <button
              onClick={() => handleShare('sms')}
              className="flex items-center justify-center gap-2 px-4 py-3 bg-white border-2 border-gray-200 hover:border-gray-300 hover:bg-gray-50 rounded-lg transition-all"
            >
              <Share2 size={18} className="text-gray-700" />
              <span className="text-sm font-medium text-gray-900">More</span>
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
              <Users className="w-5 h-5 text-blue-600" />
            </div>
            <span className="text-2xl font-bold text-gray-900">{totalReferrals}</span>
          </div>
          <h3 className="text-sm font-medium text-gray-600">Total Referrals</h3>
          <p className="text-xs text-gray-500 mt-1">People who used your code</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-green-600" />
            </div>
            <span className="text-2xl font-bold text-gray-900">{successfulReferrals}</span>
          </div>
          <h3 className="text-sm font-medium text-gray-600">Successful Referrals</h3>
          <p className="text-xs text-gray-500 mt-1">Completed sign-ups</p>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
        
        {dashboard.recentTransactions && dashboard.recentTransactions.length > 0 ? (
          <div className="space-y-3">
            {dashboard.recentTransactions.slice(0, 5).map((transaction, idx) => (
              <div
                key={transaction.transactionId || idx}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-100"
              >
                <div className="flex-1">
                  <p className="font-medium text-gray-900 text-sm">{transaction.description}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {new Date(transaction.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    })}
                  </p>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ${
                    transaction.status === 'completed'
                      ? 'bg-green-50 text-green-700 border border-green-200'
                      : transaction.status === 'failed'
                      ? 'bg-red-50 text-red-700 border border-red-200'
                      : 'bg-yellow-50 text-yellow-700 border border-yellow-200'
                  }`}
                >
                  {transaction.status === 'completed' ? 'Completed' : transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-gray-900 font-medium mb-1">No Referrals Yet</p>
            <p className="text-sm text-gray-500">Share your code above to start earning rewards!</p>
          </div>
        )}
      </div>
    </div>
  );
}
