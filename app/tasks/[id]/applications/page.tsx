'use client';

/**
 * Task Applications Page
 * Shows all applications for a specific task (for task owners)
 * Matches: web-apps/extrahand-web-app/src/screens/TaskApplicationsScreen.tsx
 * NO API CALLS - Just UI with mock data
 */

import React, { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

// Mock applications data
const mockApplications = [
  {
    _id: 'app1',
    applicantProfile: {
      name: 'John Smith',
      rating: 4.8,
      totalReviews: 45,
    },
    proposedBudget: { amount: 1400, currency: 'INR', isNegotiable: true },
    proposedTime: { estimatedDuration: 4 },
    coverLetter: 'I have 5 years of experience in deep cleaning. I use eco-friendly products and can complete the task within 4 hours. Available this weekend.',
    relevantExperience: ['5 years cleaning experience', 'Eco-friendly products', 'Weekend availability'],
    status: 'pending',
    createdAt: new Date().toISOString(),
  },
  {
    _id: 'app2',
    applicantProfile: {
      name: 'Sarah Johnson',
      rating: 4.9,
      totalReviews: 120,
    },
    proposedBudget: { amount: 1350, currency: 'INR', isNegotiable: false },
    proposedTime: { estimatedDuration: 3 },
    coverLetter: 'Professional cleaning service with 10 years of experience. I bring all equipment and supplies. Can start immediately.',
    relevantExperience: ['10 years professional cleaning', 'All equipment provided', 'Immediate availability'],
    status: 'accepted',
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    respondedAt: new Date(Date.now() - 43200000).toISOString(),
  },
  {
    _id: 'app3',
    applicantProfile: {
      name: 'Mike Davis',
      rating: 4.6,
      totalReviews: 28,
    },
    proposedBudget: { amount: 1600, currency: 'INR', isNegotiable: true },
    proposedTime: { estimatedDuration: 5 },
    coverLetter: 'Experienced cleaner specializing in deep cleaning. Available weekdays.',
    relevantExperience: ['Deep cleaning specialist', 'Weekday availability'],
    status: 'pending',
    createdAt: new Date(Date.now() - 172800000).toISOString(),
  },
];

// Mock task data
const mockTask = {
  _id: 'task1',
  title: 'Home Deep Cleaning',
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'pending': return '#FF9800';
    case 'accepted': return '#4CAF50';
    case 'rejected': return '#F44336';
    case 'withdrawn': return '#9E9E9E';
    default: return '#9E9E9E';
  }
};

export default function TaskApplicationsPage() {
  const router = useRouter();
  const params = useParams();
  const taskId = params.id as string;
  
  const [loading] = useState(false);
  const [refreshing] = useState(false);
  const [processingAppId, setProcessingAppId] = useState<string | null>(null);

  const handleAcceptApplication = async (applicationId: string) => {
    setProcessingAppId(applicationId);
    // Mock: Simulate API call
    setTimeout(() => {
      alert('Application accepted successfully! (Mock)');
      setProcessingAppId(null);
    }, 1000);
  };

  const handleRejectApplication = async (applicationId: string) => {
    setProcessingAppId(applicationId);
    // Mock: Simulate API call
    setTimeout(() => {
      alert('Application rejected. (Mock)');
      setProcessingAppId(null);
    }, 1000);
  };

  const handleTrackProgress = (taskId: string) => {
    router.push(`/tasks/${taskId}/track`);
  };

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen bg-gray-50">
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <LoadingSpinner size="lg" />
            <p className="mt-4 text-base text-gray-600">Loading applications...</p>
          </div>
        </div>
      </div>
    );
  }

  if (mockApplications.length === 0) {
    return (
      <div className="flex flex-col min-h-screen bg-gray-50">
        <div className="flex items-center px-4 py-4 bg-white border-b border-gray-200">
          <button onClick={() => router.back()} className="mr-4">
            <span className="text-base text-blue-500 font-semibold">← Back</span>
          </button>
          <div className="flex-1">
            <h1 className="text-xl font-bold text-gray-900">Applications</h1>
            <p className="text-sm text-gray-600">{mockTask.title}</p>
          </div>
        </div>
        <div className="flex-1 flex flex-col items-center justify-center py-20 px-4">
          <p className="text-2xl font-bold text-gray-900 mb-4">No Applications Yet</p>
          <p className="text-base text-gray-600 text-center leading-6 mb-6">
            No one has applied to this task yet. Share your task or wait for interested performers to apply.
          </p>
          <button
            onClick={() => router.back()}
            className="px-6 py-3 bg-blue-500 text-white rounded-lg font-semibold text-base"
          >
            Back to My Tasks
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Header */}
      <div className="flex items-center px-4 py-4 bg-white border-b border-gray-200">
        <button onClick={() => router.back()} className="mr-4">
          <span className="text-base text-blue-500 font-semibold">← Back</span>
        </button>
        <div className="flex-1">
          <h1 className="text-xl font-bold text-gray-900 mb-1">Applications</h1>
          <p className="text-sm text-gray-600 line-clamp-1 mb-1">{mockTask.title}</p>
          <p className="text-xs font-semibold" style={{ color: '#9C27B0' }}>
            {mockApplications.length} application{mockApplications.length !== 1 ? 's' : ''}
          </p>
        </div>
      </div>

      {/* Applications List */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="space-y-4">
          {mockApplications.map((application) => {
            const isProcessing = processingAppId === application._id;
            const applicantName = application.applicantProfile?.name || 'Anonymous Applicant';
            const applicantRating = application.applicantProfile?.rating || 0;
            const applicantReviews = application.applicantProfile?.totalReviews || 0;

            return (
              <div
                key={application._id}
                className="bg-white rounded-xl p-4 shadow-sm border border-gray-200"
              >
                {/* Application Header */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1 mr-3">
                    <p className="text-lg font-bold text-gray-900 mb-1">{applicantName}</p>
                    {applicantRating > 0 && (
                      <p className="text-sm text-gray-600">
                        ⭐ {applicantRating.toFixed(1)} ({applicantReviews} reviews)
                      </p>
                    )}
                  </div>
                  <div
                    className="px-2 py-1 rounded-xl min-w-[80px] text-center"
                    style={{ backgroundColor: getStatusColor(application.status) }}
                  >
                    <span className="text-white text-xs font-bold">
                      {application.status.toUpperCase()}
                    </span>
                  </div>
                </div>

                {/* Application Details */}
                <div className="space-y-2 mb-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600 font-medium">Proposed Budget:</span>
                    <span className="text-gray-900 font-semibold">
                      ₹{application.proposedBudget?.amount || 0}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600 font-medium">Negotiable:</span>
                    <span className="text-gray-900 font-semibold">
                      {application.proposedBudget?.isNegotiable ? 'Yes' : 'No'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600 font-medium">Applied:</span>
                    <span className="text-gray-900 font-semibold">
                      {new Date(application.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  {application.proposedTime?.estimatedDuration && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600 font-medium">Duration:</span>
                      <span className="text-gray-900 font-semibold">
                        {application.proposedTime.estimatedDuration} hours
                      </span>
                    </div>
                  )}
                </div>

                {/* Cover Letter */}
                {application.coverLetter && (
                  <div className="mb-3 p-3 bg-gray-50 rounded-lg">
                    <p className="text-xs text-gray-600 font-semibold mb-1.5">Cover Letter:</p>
                    <p className="text-sm text-gray-700 leading-5">{application.coverLetter}</p>
                  </div>
                )}

                {/* Relevant Experience */}
                {application.relevantExperience && application.relevantExperience.length > 0 && (
                  <div className="mb-3 p-3 rounded-lg" style={{ backgroundColor: '#E8F5E8' }}>
                    <p className="text-xs font-semibold mb-1.5" style={{ color: '#2E7D32' }}>
                      Experience:
                    </p>
                    {application.relevantExperience.map((exp, index) => (
                      <p key={index} className="text-sm mb-1" style={{ color: '#2E7D32' }}>
                        • {exp}
                      </p>
                    ))}
                  </div>
                )}

                {/* Action Buttons for Pending */}
                {application.status === 'pending' && (
                  <div className="flex gap-3 pt-3 border-t border-gray-200">
                    <button
                      onClick={() => handleAcceptApplication(application._id)}
                      disabled={isProcessing}
                      className={`flex-1 py-3 px-4 rounded-lg text-sm font-semibold text-white ${
                        isProcessing ? 'opacity-50 cursor-not-allowed' : ''
                      }`}
                      style={{ backgroundColor: '#4CAF50' }}
                    >
                      {isProcessing ? (
                        <LoadingSpinner size="sm" />
                      ) : (
                        'Accept'
                      )}
                    </button>
                    <button
                      onClick={() => handleRejectApplication(application._id)}
                      disabled={isProcessing}
                      className={`flex-1 py-3 px-4 rounded-lg text-sm font-semibold text-white ${
                        isProcessing ? 'opacity-50 cursor-not-allowed' : ''
                      }`}
                      style={{ backgroundColor: '#F44336' }}
                    >
                      {isProcessing ? (
                        <LoadingSpinner size="sm" />
                      ) : (
                        'Reject'
                      )}
                    </button>
                  </div>
                )}

                {/* Accepted Section */}
                {application.status === 'accepted' && (
                  <div className="pt-3 border-t border-gray-200">
                    <div className="p-2 mb-2 rounded" style={{ backgroundColor: '#E3F2FD' }}>
                      <p className="text-xs font-medium text-center" style={{ color: '#1976D2' }}>
                        ✅ Accepted on {new Date(application.respondedAt || application.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <button
                      onClick={() => handleTrackProgress(taskId)}
                      className="w-full py-2.5 px-4 rounded-lg text-sm font-semibold text-white"
                      style={{ backgroundColor: '#4CAF50' }}
                    >
                      📊 Track Task Progress
                    </button>
                  </div>
                )}

                {/* Rejected Section */}
                {application.status === 'rejected' && application.respondedAt && (
                  <div className="pt-3 border-t border-gray-200">
                    <div className="p-2 rounded" style={{ backgroundColor: '#E3F2FD' }}>
                      <p className="text-xs font-medium text-center" style={{ color: '#1976D2' }}>
                        ❌ Rejected on {new Date(application.respondedAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
