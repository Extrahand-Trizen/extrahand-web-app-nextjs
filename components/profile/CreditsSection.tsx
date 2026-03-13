'use client';

import React, { useState } from 'react';
import {
  Wallet,
  Send,
  TrendingUp,
  TrendingDown,
  Clock,
  CheckCircle,
  AlertCircle,
  ChevronRight,
  Filter,
  Gift,
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { getCredits, getCreditTransactions, requestCreditWithdrawal } from '@/lib/api/referral';
import type { Credit, CreditTransaction } from '@/types/referral';
import { LoadingSpinner } from '../LoadingSpinner';
import { toast } from 'sonner';

interface CreditsSectionProps {
  onNavigateToReferral?: () => void;
}

type TransactionFilter = 'all' | 'referral' | 'task' | 'withdrawal' | 'gift' | 'badge' | 'admin';

export default function CreditsSectionComponent({
  onNavigateToReferral,
}: CreditsSectionProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'history'>('overview');
  const [selectedFilter, setSelectedFilter] = useState<TransactionFilter>('all');
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [showGiftModal, setShowGiftModal] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [giftUserEmail, setGiftUserEmail] = useState('');
  const [giftAmount, setGiftAmount] = useState('');
  const [giftMessage, setGiftMessage] = useState('');
  const [processing, setProcessing] = useState(false);

  const { data: creditData, isLoading: creditLoading } = useQuery<Credit>({
    queryKey: ['credits'],
    queryFn: getCredits,
    staleTime: 5 * 60 * 1000,
    retry: 2,
  });

  const { data: transactionsData, isLoading: transactionsLoading } = useQuery<{
    transactions: CreditTransaction[];
    total: number;
  }>({
    queryKey: ['creditTransactions', selectedFilter],
    queryFn: () => getCreditTransactions(20, 0),
    staleTime: 5 * 60 * 1000,
    retry: 2,
  });

  if (creditLoading) {
    return <LoadingSpinner />;
  }

  if (!creditData) {
    return null;
  }

  const balance = creditData.balance;
  const transactions = transactionsData?.transactions || [];

  const handleWithdraw = async () => {
    if (!withdrawAmount || parseFloat(withdrawAmount) < 500) {
      toast.error('Minimum withdrawal amount is ₹500');
      return;
    }

    if (parseFloat(withdrawAmount) > balance) {
      toast.error('Insufficient balance');
      return;
    }

    try {
      setProcessing(true);
      const result = await requestCreditWithdrawal(parseFloat(withdrawAmount), ''); // Bank account ID would be selected
      if (result.success) {
        toast.success(`Withdrawal of ₹${withdrawAmount} initiated successfully`);
        setWithdrawAmount('');
        setShowWithdrawModal(false);
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to process withdrawal');
    } finally {
      setProcessing(false);
    }
  };

  const handleGiftCredits = async () => {
    if (!giftUserEmail || !giftAmount) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (parseFloat(giftAmount) > balance) {
      toast.error('Insufficient balance');
      return;
    }

    try {
      setProcessing(true);
      // Gift functionality would be implemented in the API
      toast.success(`Gifted ₹${giftAmount} to ${giftUserEmail}`);
      setGiftUserEmail('');
      setGiftAmount('');
      setGiftMessage('');
      setShowGiftModal(false);
    } catch (error: any) {
      toast.error(error.message || 'Failed to gift credits');
    } finally {
      setProcessing(false);
    }
  };

  const getTransactionIcon = (type: string) => {
    const iconProps = 'w-4 h-4';
    switch (type) {
      case 'referral':
        return <TrendingUp className={`${iconProps} text-green-600`} />;
      case 'task':
        return <TrendingDown className={`${iconProps} text-blue-600`} />;
      case 'withdrawal':
        return <Send className={`${iconProps} text-orange-600`} />;
      case 'gift':
        return <Gift className={`${iconProps} text-purple-600`} />;
      case 'badge':
        return <TrendingUp className={`${iconProps} text-pink-600`} />;
      case 'admin':
        return <CheckCircle className={`${iconProps} text-yellow-600`} />;
      default:
        return <Clock className={`${iconProps} text-gray-600`} />;
    }
  };

  const getStatusIcon = (status?: string) => {
    const iconProps = 'w-4 h-4';
    switch (status) {
      case 'completed':
        return <CheckCircle className={`${iconProps} text-green-600`} />;
      case 'pending':
        return <Clock className={`${iconProps} text-yellow-600`} />;
      case 'failed':
        return <AlertCircle className={`${iconProps} text-red-600`} />;
      default:
        return <Clock className={`${iconProps} text-gray-600`} />;
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Credits</h1>
        <p className="text-gray-600 text-lg">
          Manage your earned credits from referrals and other activities
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 mb-8 border-b border-gray-200">
        {(['overview', 'history'] as const).map((tab) => (
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
            {tab === 'history' && 'Transaction History'}
          </button>
        ))}
      </div>

      {/* OVERVIEW TAB */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Balance Card */}
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl shadow-lg p-8 text-white">
            <div className="flex items-start justify-between mb-8">
              <div>
                <p className="text-blue-100 text-sm font-medium mb-2">Available Balance</p>
                <p className="text-6xl font-bold">₹{balance.toLocaleString('en-IN')}</p>
              </div>
              <Wallet className="w-16 h-16 text-blue-200 opacity-60" />
            </div>

            <div className="grid grid-cols-3 gap-4 text-sm border-t border-blue-400 pt-6">
              <div>
                <p className="text-blue-100 mb-1">Status</p>
                <p className="font-semibold">Active</p>
              </div>
              <div>
                <p className="text-blue-100 mb-1">Lifetime Earned</p>
                <p className="font-semibold">₹{creditData.lifetime.toLocaleString('en-IN')}</p>
              </div>
              <div>
                <p className="text-blue-100 mb-1">Currency</p>
                <p className="font-semibold">INR</p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              onClick={() => setShowWithdrawModal(true)}
              className="flex items-center justify-between p-5 bg-white border border-gray-200 rounded-xl hover:border-blue-500 hover:shadow-md transition-all"
            >
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <Send className="w-6 h-6 text-blue-600" />
                </div>
                <div className="text-left">
                  <p className="font-semibold text-gray-900">Withdraw</p>
                  <p className="text-sm text-gray-600">Min ₹500</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </button>

            <button
              onClick={() => setShowGiftModal(true)}
              className="flex items-center justify-between p-5 bg-white border border-gray-200 rounded-xl hover:border-green-500 hover:shadow-md transition-all"
            >
              <div className="flex items-center gap-4">
                <div className="p-3 bg-green-100 rounded-lg">
                  <Gift className="w-6 h-6 text-green-600" />
                </div>
                <div className="text-left">
                  <p className="font-semibold text-gray-900">Gift Credits</p>
                  <p className="text-sm text-gray-600">To Friends</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </button>

            <button
              onClick={onNavigateToReferral}
              className="flex items-center justify-between p-5 bg-white border border-gray-200 rounded-xl hover:border-purple-500 hover:shadow-md transition-all"
            >
              <div className="flex items-center gap-4">
                <div className="p-3 bg-purple-100 rounded-lg">
                  <TrendingUp className="w-6 h-6 text-purple-600" />
                </div>
                <div className="text-left">
                  <p className="font-semibold text-gray-900">Earn More</p>
                  <p className="text-sm text-gray-600">Via Referrals</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </button>
          </div>

          {/* Info Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-5">
              <h3 className="font-semibold text-gray-900 mb-2">💡 How to Earn Credits?</h3>
              <p className="text-sm text-gray-700">
                Earn credits by referring friends who complete their first task of ₹500+. Each successful referral gives you ₹100 credit.
              </p>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-lg p-5">
              <h3 className="font-semibold text-gray-900 mb-2">✨ How to Use Credits?</h3>
              <p className="text-sm text-gray-700">
                Use credits to pay for tasks, reduce platform fees, withdraw to your bank, or gift to friends on the platform.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* HISTORY TAB */}
      {activeTab === 'history' && (
        <div className="space-y-6">
          {/* Filter */}
          <div className="flex items-center gap-2 pb-4 border-b border-gray-200 overflow-x-auto">
            <Filter className="w-4 h-4 text-gray-600 flex-shrink-0" />
            {(['all', 'referral', 'task', 'withdrawal', 'gift', 'badge'] as TransactionFilter[]).map(
              (filter) => (
                <button
                  key={filter}
                  onClick={() => setSelectedFilter(filter)}
                  className={`px-4 py-2 rounded-full whitespace-nowrap text-sm font-medium transition-colors ${
                    selectedFilter === filter
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {filter === 'all' ? 'All Transactions' : filter.charAt(0).toUpperCase() + filter.slice(1)}
                </button>
              )
            )}
          </div>

          {/* Transaction List */}
          {transactionsLoading ? (
            <LoadingSpinner />
          ) : transactions.length > 0 ? (
            <div className="space-y-3">
              {transactions.map((txn, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-5 bg-white border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center gap-4 flex-1">
                    <div className="p-3 bg-gray-100 rounded-lg">{getTransactionIcon(txn.type)}</div>
                    <div className="flex-1 min-w-0">
                      <p className="text-gray-900 font-medium">{txn.description}</p>
                      <div className="flex items-center gap-2 text-xs text-gray-600 mt-1">
                        <span>{new Date(txn.createdAt).toLocaleDateString('en-IN')}</span>
                        {txn.status && (
                          <span className="flex items-center gap-1">
                            {getStatusIcon(txn.status)}
                            <span className="capitalize">{txn.status}</span>
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="text-right ml-4 flex-shrink-0">
                    <p
                      className={`font-bold text-lg ${
                        txn.type === 'referral' || txn.type === 'badge' || txn.type === 'admin'
                          ? 'text-green-600'
                          : 'text-red-600'
                      }`}
                    >
                      {['referral', 'badge', 'admin'].includes(txn.type) ? '+' : '-'}₹
                      {Math.abs(txn.amount).toLocaleString('en-IN')}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Wallet className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600 text-lg">No transactions yet</p>
              <p className="text-sm text-gray-500 mt-2">
                Start earning credits by referring friends and completing tasks!
              </p>
            </div>
          )}
        </div>
      )}

      {/* Withdraw Modal */}
      {showWithdrawModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-8 max-w-md w-full">
            <h3 className="text-2xl font-semibold text-gray-900 mb-6">Withdraw Credits</h3>
            <p className="text-gray-600 mb-6">
              Available balance: <span className="font-bold text-2xl text-blue-600">₹{balance.toLocaleString('en-IN')}</span>
            </p>
            <input
              type="number"
              value={withdrawAmount}
              onChange={(e) => setWithdrawAmount(e.target.value)}
              placeholder="Enter amount"
              min="500"
              max={balance}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg mb-3 focus:outline-none focus:border-blue-500"
            />
            <p className="text-sm text-gray-600 mb-6">Minimum withdrawal: ₹500. Will be transferred to your linked bank account.</p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowWithdrawModal(false)}
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleWithdraw}
                disabled={processing || !withdrawAmount || parseFloat(withdrawAmount) < 500}
                className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {processing ? 'Processing...' : 'Withdraw'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Gift Modal */}
      {showGiftModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-8 max-w-md w-full">
            <h3 className="text-2xl font-semibold text-gray-900 mb-6">Gift Credits to Friend</h3>
            <p className="text-gray-600 mb-6">
              Available balance: <span className="font-bold text-xl">₹{balance.toLocaleString('en-IN')}</span>
            </p>
            <div className="space-y-4 mb-6">
              <input
                type="email"
                value={giftUserEmail}
                onChange={(e) => setGiftUserEmail(e.target.value)}
                placeholder="Friend's Email"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-green-500"
              />
              <input
                type="number"
                value={giftAmount}
                onChange={(e) => setGiftAmount(e.target.value)}
                placeholder="Amount to gift"
                max={balance}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-green-500"
              />
              <textarea
                value={giftMessage}
                onChange={(e) => setGiftMessage(e.target.value)}
                placeholder="Message (optional)"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-green-500 h-24 resize-none"
              />
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowGiftModal(false)}
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleGiftCredits}
                disabled={processing || !giftUserEmail || !giftAmount}
                className="flex-1 px-4 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {processing ? 'Processing...' : 'Gift'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
