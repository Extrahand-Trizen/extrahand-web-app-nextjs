'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { CheckCircle, XCircle, Award, Calendar, Star } from 'lucide-react';
import { fetchWithAuth } from '@/lib/api/client';

interface EliteApplication {
  userId: string;
  userName: string;
  email: string;
  currentBadge: string;
  reputationScore: number;
  totalTasksCompleted: number;
  averageRating: number;
  totalReviews: number;
  applicationDate: string;
  coverLetter?: string;
}

export function EliteBadgeApprovalPanel() {
  const [applications, setApplications] = useState<EliteApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedApp, setSelectedApp] = useState<string | null>(null);
  const [reviewNotes, setReviewNotes] = useState('');
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    loadApplications();
  }, []);

  const loadApplications = async () => {
    try {
      setLoading(true);
      // This would be an actual API call
      const response = await fetchWithAuth('user/admin/badge/elite-applications');
      if (response.success) {
        setApplications(response.data || []);
      }
    } catch (error) {
      console.error('Failed to load applications:', error);
      // Mock data for demonstration
      setApplications([]);
    } finally {
      setLoading(false);
    }
  };

  const handleApproval = async (userId: string, approve: boolean) => {
    try {
      setProcessing(true);
      const response = await fetchWithAuth('user/admin/badge/approve-elite', {
        method: 'POST',
        body: JSON.stringify({
          userId,
          approve,
          reviewNotes
        })
      });

      if (response.success) {
        // Remove from list
        setApplications(prev => prev.filter(app => app.userId !== userId));
        setSelectedApp(null);
        setReviewNotes('');
      }
    } catch (error) {
      console.error('Failed to process approval:', error);
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center text-muted-foreground">Loading applications...</div>
        </CardContent>
      </Card>
    );
  }

  if (applications.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5" />
            Elite Badge Applications
          </CardTitle>
          <CardDescription>Review and approve Elite badge applications</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center text-muted-foreground py-8">
            <Award className="h-12 w-12 mx-auto mb-4 opacity-20" />
            <p>No pending applications</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Award className="h-5 w-5" />
          Elite Badge Applications ({applications.length})
        </CardTitle>
        <CardDescription>Review and approve Elite badge applications</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {applications.map((app) => (
          <Card key={app.userId} className="border-2">
            <CardContent className="pt-6">
              <div className="space-y-4">
                {/* User Info */}
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-lg">{app.userName}</h3>
                    <p className="text-sm text-muted-foreground">{app.email}</p>
                  </div>
                  <Badge variant="secondary" className="capitalize">
                    {app.currentBadge}
                  </Badge>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <div className="text-2xl font-bold">{app.reputationScore}</div>
                    <div className="text-xs text-muted-foreground">Reputation Score</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold">{app.totalTasksCompleted}</div>
                    <div className="text-xs text-muted-foreground">Tasks Completed</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold flex items-center gap-1">
                      {app.averageRating.toFixed(1)}
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    </div>
                    <div className="text-xs text-muted-foreground">Average Rating</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold">{app.totalReviews}</div>
                    <div className="text-xs text-muted-foreground">Total Reviews</div>
                  </div>
                </div>

                {/* Application Date */}
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  Applied on {new Date(app.applicationDate).toLocaleDateString()}
                </div>

                {/* Cover Letter */}
                {app.coverLetter && (
                  <div>
                    <div className="text-sm font-medium mb-2">Cover Letter:</div>
                    <div className="text-sm p-3 bg-muted rounded-lg">
                      {app.coverLetter}
                    </div>
                  </div>
                )}

                {/* Review Notes */}
                {selectedApp === app.userId && (
                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      Review Notes (optional)
                    </label>
                    <Textarea
                      value={reviewNotes}
                      onChange={(e) => setReviewNotes(e.target.value)}
                      placeholder="Enter any notes about this decision..."
                      className="mb-4"
                    />
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-2">
                  {selectedApp === app.userId ? (
                    <>
                      <Button
                        onClick={() => handleApproval(app.userId, true)}
                        disabled={processing}
                        className="flex-1"
                      >
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Confirm Approval
                      </Button>
                      <Button
                        onClick={() => handleApproval(app.userId, false)}
                        disabled={processing}
                        variant="destructive"
                        className="flex-1"
                      >
                        <XCircle className="h-4 w-4 mr-2" />
                        Confirm Rejection
                      </Button>
                      <Button
                        onClick={() => {
                          setSelectedApp(null);
                          setReviewNotes('');
                        }}
                        disabled={processing}
                        variant="outline"
                      >
                        Cancel
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button
                        onClick={() => setSelectedApp(app.userId)}
                        className="flex-1"
                        variant="outline"
                      >
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Approve
                      </Button>
                      <Button
                        onClick={() => setSelectedApp(app.userId)}
                        variant="outline"
                        className="flex-1"
                      >
                        <XCircle className="h-4 w-4 mr-2" />
                        Reject
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </CardContent>
    </Card>
  );
}
