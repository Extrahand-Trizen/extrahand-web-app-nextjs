'use client';

import React, { useState } from 'react';
import {
  Copy, MessageCircle, Mail, Share2,
  Users, TrendingUp, Gift, Check, Coins,
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { referralsApi } from '@/lib/api/endpoints/referrals';
import { paymentApi } from '@/lib/api/endpoints/payment';
import { useAuth } from '@/lib/auth/context';
import LoadingSpinner from '../LoadingSpinner';
import { toast } from 'sonner';

const REFERRAL_SOURCES = ['referral_signup', 'referral_welcome', 'referral_task_bonus'];

function coinBadge(source: string) {
  const map: Record<string, { label: string; cls: string }> = {
    referral_signup:    { label: '🎉 Referral Bonus',  cls: 'bg-green-50 text-green-700 border-green-200' },
    referral_welcome:   { label: '👋 Welcome Bonus',   cls: 'bg-blue-50 text-blue-700 border-blue-200'   },
    referral_task_bonus:{ label: '⚡ Task Bonus',       cls: 'bg-amber-50 text-amber-700 border-amber-200' },
  };
  return map[source] ?? { label: source, cls: 'bg-gray-50 text-gray-700 border-gray-200' };
}

interface ReferralSimpleProps {
  className?: string;
}

export default function ReferralDashboardSimple({ className = '' }: ReferralSimpleProps) {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'share' | 'coins'>('share');

  // Get user uid from auth context (same pattern as profile page)
  const { userData } = useAuth();
  const uid = userData?.uid ?? '';

  // Dashboard stats from user-service
  const { data: program } = useQuery({
    queryKey: ['referralProgram'],
    queryFn: () => referralsApi.getReferralProgram(),
    staleTime: 5 * 60 * 1000,
  });

  const coinRate = program?.coinValueInr ?? 0.2;

  const { data: dashboard, isLoading: dashLoading, error: dashError } = useQuery({
    queryKey: ['referralSimple'],
    queryFn: () => referralsApi.getDashboard(),
    staleTime: 5 * 60 * 1000,
  });

  // ExtraCoins wallet — referral-only filter
  const { data: walletRes, isLoading: walletLoading } = useQuery({
    queryKey: ['extraCoinsWallet', uid],
    queryFn: () => paymentApi.getExtraCoinsWallet(uid),
    staleTime: 5 * 60 * 1000,
    enabled: !!uid,
  });

  const isLoading = dashLoading || walletLoading;

  // Filter referral ExtraCoins
  const earnedHistory = walletRes?.wallet?.earnedHistory ?? [];
  const referralTxns = earnedHistory.filter((tx) => {
    const src = (tx.metadata as any)?.source ?? '';
    return REFERRAL_SOURCES.includes(src);
  });
  const totalReferralCoins = referralTxns.reduce((s, tx) => s + Number(tx.coins), 0);
  const totalReferralRupees = (totalReferralCoins * coinRate).toFixed(2);

  if (isLoading) {
    return (
      <div className={`space-y-4 ${className}`}>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          <div className="h-6 w-48 bg-gray-200 rounded animate-pulse mb-6" />
          <div className="h-24 bg-gray-100 rounded-lg animate-pulse" />
        </div>
      </div>
    );
  }

  if (dashError) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-red-200 p-8 text-center">
        <p className="text-gray-900 font-semibold mb-2">Unable to load referral data</p>
        <p className="text-sm text-gray-500">Please refresh the page or try again later.</p>
      </div>
    );
  }

  if (!dashboard?.referralCode) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
        <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Gift className="w-6 h-6 text-gray-400" />
        </div>
        <p className="text-gray-900 font-semibold mb-2">Generating Your Referral Code</p>
        <p className="text-sm text-gray-500">Your unique referral code is being created. Please check back shortly.</p>
      </div>
    );
  }

  const referralCode = dashboard.referralCode;
  const shareUrl = dashboard.referralLink || `${typeof window !== 'undefined' ? window.location.origin : 'https://extrahand.in'}/signup?ref=${referralCode}`;
  const totalReferrals = dashboard.totalReferrals ?? 0;
  const successfulReferrals = dashboard.successfulReferrals ?? 0;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      toast.success('Referral link copied!');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error('Failed to copy link');
    }
  };

  const handleShare = (platform: 'whatsapp' | 'email' | 'sms') => {
    const msg = encodeURIComponent(
      `Join me on ExtraHand and earn ₹15 welcome coins! Use my referral code: ${referralCode}\n${shareUrl}`
    );
    const links: Record<string, string> = {
      whatsapp: `https://wa.me/?text=${msg}`,
      email: `mailto:?subject=Join ExtraHand!&body=${msg}`,
      sms: `sms:?body=${msg}`,
    };
    window.open(links[platform], '_blank');
    toast.success(`Opening ${platform}…`);
  };

  return (
    <div className={`space-y-6 ${className}`}>

      {/* ── ExtraCoins earned via referral ── */}
      <div className="flex items-stretch gap-4 flex-col sm:flex-row">
        {/* Coins card */}
        <div className="flex-1 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 p-5 text-white shadow-md">
          <p className="text-xs font-semibold uppercase tracking-wide opacity-80 mb-1">Referral ExtraCoins</p>
          <p className="text-4xl font-bold">{totalReferralCoins.toFixed(0)}</p>
          <p className="text-sm opacity-80 mt-0.5">≈ ₹{totalReferralRupees}</p>
          <p className="mt-3 text-xs opacity-70">(Referral-only · all coins shown in Payments)</p>
        </div>

        {/* Reward info */}
        <div className="flex-1 rounded-xl border border-amber-200 bg-amber-50 p-5 text-sm space-y-2">
          <p className="font-semibold text-gray-900 mb-1">How you earn</p>
          <div className="flex items-center gap-2 text-gray-700">
            <span className="text-amber-600 font-bold">125</span> coins <span className="text-xs text-gray-500">(₹25)</span>
            <span className="text-gray-400 ml-1">— when friend joins with your code</span>
          </div>
          <div className="flex items-center gap-2 text-gray-700">
            <span className="text-amber-600 font-bold">75</span> coins <span className="text-xs text-gray-500">(₹15)</span>
            <span className="text-gray-400 ml-1">— welcome bonus for friend</span>
          </div>
          <div className="flex items-center gap-2 text-gray-700">
            <span className="text-amber-600 font-bold">20%</span> <span className="text-gray-400">of platform fee — on first task ≥ ₹500</span>
          </div>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Total Referrals', value: totalReferrals, icon: Users, cls: 'text-blue-600 bg-blue-50' },
          { label: 'Successful', value: successfulReferrals, icon: TrendingUp, cls: 'text-green-600 bg-green-50' },
          { label: 'Coins Earned', value: totalReferralCoins.toFixed(0), icon: Coins, cls: 'text-amber-600 bg-amber-50' },
        ].map((s) => {
          const Icon = s.icon;
          return (
            <div key={s.label} className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
              <div className={`w-9 h-9 rounded-lg flex items-center justify-center mb-2 ${s.cls}`}>
                <Icon className="w-4 h-4" />
              </div>
              <p className="text-2xl font-bold text-gray-900">{s.value}</p>
              <p className="text-xs text-gray-500 mt-0.5">{s.label}</p>
            </div>
          );
        })}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 rounded-lg bg-gray-100 p-1">
        {(['share', 'coins'] as const).map((t) => (
          <button
            key={t}
            onClick={() => setActiveTab(t)}
            className={`flex-1 rounded-md py-2 text-sm font-medium transition-all ${
              activeTab === t ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {t === 'share' && 'Share Code'}
            {t === 'coins' && `Coins History (${referralTxns.length})`}
          </button>
        ))}
      </div>

      {/* ── SHARE TAB ── */}
      {activeTab === 'share' && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-start justify-between mb-5">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Invite Friends &amp; Earn</h2>
              <p className="text-sm text-gray-500 mt-1">
                You earn ₹25 in ExtraCoins; your friend gets ₹15 welcome coins when they join!
              </p>
            </div>
            <div className="hidden md:flex w-10 h-10 bg-amber-50 rounded-lg items-center justify-center">
              <Gift className="w-5 h-5 text-amber-600" />
            </div>
          </div>

          {/* Code display */}
          <div className="bg-gray-50 rounded-lg p-5 border border-gray-200 mb-5">
            <label className="block text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">Your Referral Code</label>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <div className="flex-1 bg-white border-2 border-gray-300 rounded-lg px-4 py-3 font-mono text-xl font-bold text-gray-900 tracking-widest">
                {referralCode}
              </div>
              <button
                onClick={handleCopyLink}
                className={`px-5 py-3 rounded-lg font-medium transition-all flex items-center justify-center gap-2 ${
                  copied ? 'bg-green-600 text-white' : 'bg-gray-900 hover:bg-gray-800 text-white'
                }`}
              >
                {copied ? <><Check size={17} /> Copied!</> : <><Copy size={17} /> Copy Link</>}
              </button>
            </div>
          </div>

          {/* Share buttons */}
          <label className="block text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">Share via</label>
          <div className="grid grid-cols-3 gap-3">
            {[
              { icon: MessageCircle, label: 'WhatsApp', platform: 'whatsapp' as const, bg: 'bg-green-500 hover:bg-green-600' },
              { icon: Mail,          label: 'Email',    platform: 'email'    as const, bg: 'bg-blue-500 hover:bg-blue-600'  },
              { icon: Share2,        label: 'More',     platform: 'sms'      as const, bg: 'bg-gray-700 hover:bg-gray-800'  },
            ].map((btn) => {
              const Icon = btn.icon;
              return (
                <button
                  key={btn.platform}
                  onClick={() => handleShare(btn.platform)}
                  className={`flex items-center justify-center gap-2 px-4 py-3 rounded-lg text-white font-medium text-sm transition-colors ${btn.bg}`}
                >
                  <Icon size={17} />
                  {btn.label}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* ── COINS HISTORY TAB ── */}
      {activeTab === 'coins' && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="border-b border-gray-100 bg-amber-50 px-5 py-3">
            <div className="flex items-center gap-2">
              <Coins className="h-4 w-4 text-amber-600" />
              <p className="text-sm font-semibold text-gray-900">Referral-only coins</p>
            </div>
            <p className="text-xs text-gray-500 mt-0.5">
              All coins (including task rewards) are visible in <strong>Payments → ExtraCoins</strong>.
            </p>
          </div>

          {referralTxns.length === 0 ? (
            <div className="py-14 text-center">
              <div className="w-14 h-14 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Users className="w-7 h-7 text-gray-400" />
              </div>
              <p className="font-medium text-gray-700">No referral coins yet</p>
              <p className="text-sm text-gray-400 mt-1">Share your code above — you'll earn 125 coins (₹25) when a friend joins!</p>
            </div>
          ) : (
            <>
              <div className="divide-y divide-gray-100">
                {referralTxns.map((tx) => {
                  const src = (tx.metadata as any)?.source ?? '';
                  const desc = (tx.metadata as any)?.description ?? '';
                  const badge = coinBadge(src);
                  return (
                    <div key={tx.transactionId} className="flex items-center justify-between px-5 py-4">
                      <div className="flex-1 min-w-0">
                        <div className="mb-0.5">
                          <span className={`text-xs font-medium rounded-full border px-2 py-0.5 ${badge.cls}`}>
                            {badge.label}
                          </span>
                        </div>
                        {desc && <p className="text-xs text-gray-500 mt-1 truncate">{desc}</p>}
                        <p className="text-xs text-gray-400 mt-0.5">
                          {new Date(tx.createdAt).toLocaleDateString('en-IN', { dateStyle: 'medium' })}
                          {tx.expiresAt && (
                            <span className="ml-2 text-orange-500">
                              · Exp {new Date(tx.expiresAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}
                            </span>
                          )}
                        </p>
                      </div>
                      <div className="ml-4 text-right shrink-0">
                        <p className="font-bold text-green-700">+{Number(tx.coins).toFixed(0)} coins</p>
                        <p className="text-xs text-gray-500">≈ ₹{(Number(tx.coins) * COIN_RATE).toFixed(2)}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="border-t border-gray-100 bg-gray-50 px-5 py-3 flex items-center justify-between">
                <p className="text-sm text-gray-500">Total from referrals</p>
                <p className="font-bold text-gray-900">{totalReferralCoins.toFixed(0)} coins ≈ ₹{totalReferralRupees}</p>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
