'use client';

import React, { useState } from 'react';
import {
  Copy, Share2, MessageCircle, Mail, TrendingUp,
  Coins, Check, Gift, Star,
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import { referralsApi } from '@/lib/api/endpoints/referrals';
import { paymentApi } from '@/lib/api/endpoints/payment';
import { useUserStore } from '@/lib/state/userStore';
import LoadingSpinner from '../LoadingSpinner';

const REFERRAL_SOURCES = ['referral_signup', 'referral_welcome', 'referral_task_bonus'];

const COIN_RATE = 0.20; // ₹ per coin

function coinLabel(source: string) {
  if (source === 'referral_signup')    return { label: '🎉 Referral Bonus', color: 'text-green-700 bg-green-50' };
  if (source === 'referral_welcome')   return { label: '👋 Welcome Bonus',  color: 'text-blue-700 bg-blue-50' };
  if (source === 'referral_task_bonus') return { label: '⚡ Task Bonus',    color: 'text-amber-700 bg-amber-50' };
  return { label: source, color: 'text-gray-700 bg-gray-50' };
}

export default function ReferralDashboardComponent({ className = '' }: { className?: string }) {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'coins' | 'how-it-works'>('overview');
  const user = useUserStore((s) => s.user);
  const uid = user?.uid || '';

  // Dashboard stats (from user-service)
  const { data: dashRaw, isLoading: dashLoading } = useQuery({
    queryKey: ['referralDashboard'],
    queryFn: () => referralsApi.getDashboard(),
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });

  // ExtraCoins wallet (from payment-service) — filtered to referral transactions
  const { data: walletRaw, isLoading: walletLoading } = useQuery({
    queryKey: ['extraCoinsWallet', uid],
    queryFn: () => (uid ? paymentApi.getExtraCoinsWallet(uid) : Promise.resolve(null)),
    staleTime: 5 * 60 * 1000,
    retry: 1,
    enabled: !!uid,
  });

  const isLoading = dashLoading || walletLoading;

  // Referral-only ExtraCoins transactions
  const wallet = walletRaw?.wallet;
  const allEarned = wallet?.earnedHistory ?? [];
  const referralTransactions = allEarned.filter((tx) => {
    const src = (tx.metadata as any)?.source ?? '';
    return REFERRAL_SOURCES.includes(src);
  });

  const totalReferralCoins = referralTransactions.reduce((sum, tx) => sum + Number(tx.coins), 0);
  const totalReferralRupees = totalReferralCoins * COIN_RATE;

  const dash = dashRaw as any;
  const referralCode = dash?.referralCode ?? '';
  const referralLink = `https://extrahand.in/signup?ref=${referralCode}`;
  const totalReferrals = dash?.totalReferrals ?? 0;
  const successfulReferrals = dash?.successfulReferrals ?? 0;
  const conversionRate = totalReferrals > 0 ? Math.round((successfulReferrals / totalReferrals) * 100) : 0;

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      toast.success('Copied!');
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const shareVia = (platform: 'whatsapp' | 'email') => {
    const msg = encodeURIComponent(`Join ExtraHand with my referral code ${referralCode} and earn ₹15 in ExtraCoins! Sign up: ${referralLink}`);
    if (platform === 'whatsapp') window.open(`https://wa.me/?text=${msg}`, '_blank');
    if (platform === 'email') window.open(`mailto:?subject=Join ExtraHand!&body=${msg}`, '_blank');
  };

  if (isLoading) return <LoadingSpinner />;

  return (
    <div className={`w-full max-w-3xl mx-auto ${className}`}>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Referral Program</h1>
        <p className="text-gray-500 text-sm mt-1">
          Earn ExtraCoins every time a friend joins and completes their first task.
        </p>
      </div>

      {/* Reward banner */}
      <div className="mb-6 rounded-xl bg-gradient-to-r from-amber-400 to-orange-500 p-5 text-white shadow-md">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide opacity-80 mb-1">Your Earnings</p>
            <p className="text-4xl font-bold">{totalReferralCoins.toFixed(0)} Coins</p>
            <p className="text-sm opacity-80 mt-1">≈ ₹{totalReferralRupees.toFixed(2)} worth (from referrals only)</p>
          </div>
          <div className="flex flex-col items-end gap-1.5 text-xs font-semibold bg-white/20 rounded-lg px-3 py-2">
            <span>🎉 Referrer: 125 coins (₹25)</span>
            <span>👋 Welcome: 75 coins (₹15)</span>
            <span>⚡ Task bonus: 20% of fee</span>
          </div>
        </div>
      </div>

      {/* Stats row */}
      <div className="mb-6 grid grid-cols-3 gap-3">
        {[
          { label: 'Total Referrals', value: totalReferrals, color: 'border-blue-400' },
          { label: 'Successful', value: successfulReferrals, color: 'border-green-400' },
          { label: 'Conversion', value: `${conversionRate}%`, color: 'border-purple-400' },
        ].map((s) => (
          <div key={s.label} className={`rounded-xl border-t-4 ${s.color} bg-white p-4 shadow-sm`}>
            <p className="text-2xl font-bold text-gray-900">{s.value}</p>
            <p className="text-xs text-gray-500 mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="mb-4 flex gap-1 rounded-lg bg-gray-100 p-1">
        {(['overview', 'coins', 'how-it-works'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 rounded-md py-2 text-sm font-medium transition-all ${
              activeTab === tab
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab === 'overview' && 'Share'}
            {tab === 'coins' && `Coins (${referralTransactions.length})`}
            {tab === 'how-it-works' && 'How it works'}
          </button>
        ))}
      </div>

      {/* ── OVERVIEW TAB ── */}
      {activeTab === 'overview' && (
        <div className="space-y-4">
          {/* Referral code */}
          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">Your Referral Code</p>
            <div className="flex items-center gap-3">
              <div className="flex-1 rounded-lg bg-gray-50 border border-gray-200 px-4 py-3 font-mono text-xl font-bold tracking-widest text-gray-900">
                {referralCode || '—'}
              </div>
              <button
                onClick={() => handleCopy(referralCode)}
                className={`flex items-center gap-2 rounded-lg px-4 py-3 text-sm font-medium transition-all ${
                  copied ? 'bg-green-500 text-white' : 'bg-gray-900 text-white hover:bg-gray-700'
                }`}
              >
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                {copied ? 'Copied!' : 'Copy'}
              </button>
            </div>
          </div>

          {/* Referral link */}
          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">Referral Link</p>
            <div className="flex items-center gap-2 rounded-lg bg-gray-50 border border-gray-200 px-3 py-2.5">
              <span className="flex-1 truncate text-sm text-gray-600">{referralLink}</span>
              <button onClick={() => handleCopy(referralLink)} className="text-gray-400 hover:text-gray-700">
                <Copy className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Share buttons */}
          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-3">Share via</p>
            <div className="grid grid-cols-3 gap-3">
              <button
                onClick={() => shareVia('whatsapp')}
                className="flex flex-col items-center gap-2 rounded-xl bg-green-500 py-4 text-white font-medium text-sm hover:bg-green-600 transition-colors"
              >
                <MessageCircle className="h-5 w-5" />
                WhatsApp
              </button>
              <button
                onClick={() => shareVia('email')}
                className="flex flex-col items-center gap-2 rounded-xl bg-blue-500 py-4 text-white font-medium text-sm hover:bg-blue-600 transition-colors"
              >
                <Mail className="h-5 w-5" />
                Email
              </button>
              <button
                onClick={() => handleCopy(referralLink)}
                className="flex flex-col items-center gap-2 rounded-xl bg-gray-700 py-4 text-white font-medium text-sm hover:bg-gray-800 transition-colors"
              >
                <Share2 className="h-5 w-5" />
                Copy Link
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── COINS TAB ── */}
      {activeTab === 'coins' && (
        <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
          <div className="border-b border-gray-100 bg-amber-50 px-5 py-4">
            <div className="flex items-center gap-2">
              <Coins className="h-5 w-5 text-amber-600" />
              <p className="font-semibold text-gray-900">
                ExtraCoins earned through referrals
              </p>
            </div>
            <p className="mt-0.5 text-xs text-gray-500">
              Only referral-related coins are shown here. All coins (including task rewards) are visible in Payments → ExtraCoins.
            </p>
          </div>

          {referralTransactions.length === 0 ? (
            <div className="py-14 text-center">
              <Gift className="mx-auto h-10 w-10 text-gray-300 mb-3" />
              <p className="font-medium text-gray-500">No referral coins yet.</p>
              <p className="mt-1 text-sm text-gray-400">
                Share your code — you'll earn 125 coins (₹25) when a friend joins!
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {referralTransactions.map((tx) => {
                const src = (tx.metadata as any)?.source ?? '';
                const { label, color } = coinLabel(src);
                const desc = (tx.metadata as any)?.description ?? '';
                return (
                  <div key={tx.transactionId} className="flex items-center justify-between px-5 py-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${color}`}>{label}</span>
                      </div>
                      {desc && <p className="text-xs text-gray-500 truncate">{desc}</p>}
                      <p className="text-xs text-gray-400 mt-0.5">
                        {new Date(tx.createdAt).toLocaleDateString('en-IN', { dateStyle: 'medium' })}
                        {tx.expiresAt && (
                          <span className="ml-2 text-orange-500">
                            Expires {new Date(tx.expiresAt).toLocaleDateString('en-IN', { dateStyle: 'medium' })}
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
          )}

          {referralTransactions.length > 0 && (
            <div className="border-t border-gray-100 bg-gray-50 px-5 py-3 flex items-center justify-between">
              <p className="text-sm text-gray-500">Total from referrals</p>
              <p className="font-bold text-gray-900">
                {totalReferralCoins.toFixed(0)} coins ≈ ₹{totalReferralRupees.toFixed(2)}
              </p>
            </div>
          )}
        </div>
      )}

      {/* ── HOW IT WORKS TAB ── */}
      {activeTab === 'how-it-works' && (
        <div className="space-y-4">
          {/* Steps */}
          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <h3 className="font-semibold text-gray-900 mb-4">Steps to earn</h3>
            <div className="space-y-5">
              {[
                {
                  num: '1', icon: Share2,
                  title: 'Share your code',
                  desc: `Send your code ${referralCode || 'XXXXXX'} to a friend via WhatsApp, Email, or link.`,
                },
                {
                  num: '2', icon: Star,
                  title: 'Friend signs up',
                  desc: 'When they register using your code, you instantly earn 125 ExtraCoins (₹25) and they get 75 welcome coins (₹15).',
                },
                {
                  num: '3', icon: TrendingUp,
                  title: 'Friend completes first task',
                  desc: 'When they complete a task worth ₹500+, you earn an extra 20% of the platform fee as bonus coins.',
                },
              ].map((step) => {
                const Icon = step.icon;
                return (
                  <div key={step.num} className="flex gap-4">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-amber-400 text-white flex items-center justify-center font-bold text-sm">
                      {step.num}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{step.title}</p>
                      <p className="text-sm text-gray-500 mt-0.5">{step.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Reward table */}
          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <h3 className="font-semibold text-gray-900 mb-3">Reward breakdown</h3>
            <div className="rounded-lg overflow-hidden border border-gray-100">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 text-xs uppercase tracking-wide text-gray-500">
                  <tr>
                    <th className="px-4 py-2 text-left">Event</th>
                    <th className="px-4 py-2 text-left">Who</th>
                    <th className="px-4 py-2 text-right">Coins</th>
                    <th className="px-4 py-2 text-right">Value</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {[
                    { event: 'Friend signs up', who: 'You (referrer)', coins: 125, rupees: 25 },
                    { event: 'Friend signs up', who: 'Friend (new tasker)', coins: 75, rupees: 15 },
                    { event: 'First task ₹500', who: 'You (referrer)', coins: '20% of fee', rupees: '~₹5' },
                    { event: 'First task ₹500', who: 'Friend', coins: '+50% onboarding', rupees: 'bonus' },
                  ].map((row, i) => (
                    <tr key={i} className="hover:bg-gray-50">
                      <td className="px-4 py-2.5 text-gray-700">{row.event}</td>
                      <td className="px-4 py-2.5 text-gray-500">{row.who}</td>
                      <td className="px-4 py-2.5 text-right font-semibold text-amber-700">{row.coins}</td>
                      <td className="px-4 py-2.5 text-right text-gray-700">
                        {typeof row.rupees === 'number' ? `₹${row.rupees}` : row.rupees}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-3 text-xs text-gray-400">1 ExtraCoins = ₹0.20. Coins valid for 180 days. Usable at payout (up to platform fee).</p>
          </div>

          {/* Terms */}
          <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
            <p className="font-semibold mb-2">Terms</p>
            <ul className="space-y-1 list-disc list-inside text-amber-800 text-xs">
              <li>Referral code must be applied at signup. Cannot be added later.</li>
              <li>Task bonus requires task value ≥ ₹500, completed within 30 days of signup.</li>
              <li>Self-referral is blocked. Each user can only be referred once.</li>
              <li>ExtraCoins expire after 180 days.</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
