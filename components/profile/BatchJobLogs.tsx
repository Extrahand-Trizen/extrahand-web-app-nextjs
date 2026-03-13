'use client';

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { referralsApi } from '@/lib/api/endpoints/referrals';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, CheckCircle, Clock, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';

interface BatchJobLogsProps {
  className?: string;
}

const statusColors = {
  completed: { bg: 'bg-green-50', border: 'border-green-200', text: 'text-green-700', icon: CheckCircle },
  running: { bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-700', icon: Clock },
  failed: { bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-700', icon: AlertTriangle },
  pending: { bg: 'bg-yellow-50', border: 'border-yellow-200', text: 'text-yellow-700', icon: Clock },
};

export function BatchJobLogs({ className = '' }: BatchJobLogsProps) {
  const {
    data: jobLogs,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['batchJobLogs'],
    queryFn: () => referralsApi.getBatchJobLogs({ limit: 20, page: 1 }),
    staleTime: 60 * 1000, // 1 minute
    retry: 2,
  });

  const {
    data: jobStatus,
  } = useQuery({
    queryKey: ['batchJobStatus'],
    queryFn: () => referralsApi.getBatchJobStatus(),
    staleTime: 60 * 1000,
    retry: 2,
  });

  if (error) {
    toast.error('Failed to load batch job logs');
    return <div className="text-center text-red-600">Error loading batch job logs</div>;
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Status Overview */}
      {jobStatus && (
        <Card>
          <CardHeader>
            <CardTitle>Batch Job Status</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {jobStatus.lastDailyBadgeCheck && (
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <div>
                    <p className="text-sm text-gray-600">Last Badge Check</p>
                    <p className="text-sm font-medium">
                      {new Date(jobStatus.lastDailyBadgeCheck).toLocaleString()}
                    </p>
                  </div>
                </div>
              )}
              {jobStatus.lastReferralExpiryCheck && (
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <div>
                    <p className="text-sm text-gray-600">Last Referral Expiry Check</p>
                    <p className="text-sm font-medium">
                      {new Date(jobStatus.lastReferralExpiryCheck).toLocaleString()}
                    </p>
                  </div>
                </div>
              )}
            </div>
            {jobStatus.nextScheduledRun && (
              <div className="flex items-center gap-3 pt-2 border-t">
                <Clock className="w-5 h-5 text-blue-600" />
                <div>
                  <p className="text-sm text-gray-600">Next Scheduled Run</p>
                  <p className="text-sm font-medium">
                    {new Date(jobStatus.nextScheduledRun).toLocaleString()}
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Job Logs */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Batch Jobs</CardTitle>
          <CardDescription>
            {isLoading ? 'Loading...' : `${jobLogs?.total || 0} total jobs`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8 text-gray-500">Loading batch job logs...</div>
          ) : jobLogs?.logs && jobLogs.logs.length > 0 ? (
            <div className="space-y-4">
              {jobLogs.logs.map((job) => (
                <div
                  key={job.jobId}
                  className={`p-4 rounded-lg border ${statusColors[job.status as keyof typeof statusColors]?.border || 'border-gray-200'} ${statusColors[job.status as keyof typeof statusColors]?.bg || 'bg-gray-50'}`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-medium text-gray-900">{job.jobName}</h4>
                        <Badge
                          variant={
                            job.status === 'completed'
                              ? 'default'
                              : job.status === 'failed'
                                ? 'destructive'
                                : 'secondary'
                          }
                        >
                          {job.status}
                        </Badge>
                      </div>
                      <p className="text-xs text-gray-600 mb-3">{job.jobType}</p>

                      {/* Stats */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                        <div>
                          <span className="text-gray-600">Processed:</span>
                          <p className="font-medium">{job.processedCount}</p>
                        </div>
                        <div>
                          <span className="text-gray-600">Success:</span>
                          <p className="font-medium text-green-600">{job.successCount}</p>
                        </div>
                        <div>
                          <span className="text-gray-600">Failed:</span>
                          <p className="font-medium text-red-600">{job.failureCount}</p>
                        </div>
                        {job.duration && (
                          <div>
                            <span className="text-gray-600">Duration:</span>
                            <p className="font-medium">{(job.duration / 1000).toFixed(2)}s</p>
                          </div>
                        )}
                      </div>

                      {/* Timestamps */}
                      <div className="mt-3 text-xs text-gray-600 space-y-1">
                        <p>
                          Started: {new Date(job.startedAt).toLocaleString()}
                        </p>
                        {job.completedAt && (
                          <p>Completed: {new Date(job.completedAt).toLocaleString()}</p>
                        )}
                      </div>

                      {/* Error Message */}
                      {job.errorMessage && (
                        <div className="mt-3 flex items-start gap-2">
                          <AlertCircle className="w-4 h-4 text-red-600 mt-0.5 shrink-0" />
                          <p className="text-xs text-red-700">{job.errorMessage}</p>
                        </div>
                      )}

                      {/* Logs */}
                      {job.logs && job.logs.length > 0 && (
                        <details className="mt-3">
                          <summary className="cursor-pointer text-xs font-medium text-gray-700 hover:text-gray-900">
                            View Logs ({job.logs.length})
                          </summary>
                          <div className="mt-2 bg-gray-900 text-gray-100 p-3 rounded text-xs font-mono overflow-x-auto max-h-40 overflow-y-auto">
                            {job.logs.map((log, idx) => (
                              <div key={idx}>{log}</div>
                            ))}
                          </div>
                        </details>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">No batch jobs found</div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default BatchJobLogs;
