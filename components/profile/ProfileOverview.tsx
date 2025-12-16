"use client";

/**
 * Profile Overview Section
 * Summary view of account status, stats, and quick actions
 */

import React from "react";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import {
  Star,
  CheckCircle2,
  AlertCircle,
  Clock,
  ArrowRight,
  Shield,
  Briefcase,
  MapPin,
} from "lucide-react";
import { UserProfile } from "@/types/user";
import { ProfileSection } from "@/types/profile";

interface ProfileOverviewProps {
  user: UserProfile;
  onNavigate: (section: ProfileSection) => void;
}

export function ProfileOverview({ user, onNavigate }: ProfileOverviewProps) {
  const completionPercentage = calculateCompletionPercentage(user);
  const verificationItems = getVerificationStatus(user);
  const verifiedCount = verificationItems.filter(v => v.status === 'verified').length;

  return (
    <div className="space-y-6">
      {/* Header Card */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-start gap-4">
          <Avatar className="w-16 h-16">
            <AvatarImage src={user.photoURL || undefined} alt={user.name} />
            <AvatarFallback className="bg-gray-100 text-gray-600 text-xl font-medium">
              {user.name?.charAt(0).toUpperCase() || "U"}
            </AvatarFallback>
          </Avatar>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-xl font-semibold text-gray-900 truncate">
                {user.name}
              </h1>
              {user.verificationBadge && user.verificationBadge !== 'none' && (
                <Badge 
                  variant="secondary" 
                  className={cn(
                    "capitalize text-xs",
                    user.verificationBadge === 'trusted' && "bg-green-100 text-green-700",
                    user.verificationBadge === 'verified' && "bg-blue-100 text-blue-700",
                    user.verificationBadge === 'basic' && "bg-gray-100 text-gray-700"
                  )}
                >
                  <Shield className="w-3 h-3 mr-1" />
                  {user.verificationBadge}
                </Badge>
              )}
            </div>
            
            <div className="flex items-center gap-3 mt-1 text-sm text-gray-500">
              {user.location?.city && (
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5" />
                  {user.location.city}
                </span>
              )}
              <span className="flex items-center gap-1">
                <Briefcase className="w-3.5 h-3.5" />
                {user.roles?.includes('tasker') && user.roles?.includes('poster') 
                  ? 'Tasker & Poster'
                  : user.roles?.includes('tasker') 
                    ? 'Tasker' 
                    : 'Poster'}
              </span>
            </div>
            
            <div className="flex items-center gap-4 mt-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onNavigate('public-profile')}
                className="text-sm"
              >
                View Public Profile
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onNavigate('edit-profile')}
                className="text-sm"
              >
                Edit Profile
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Profile Completion */}
      {completionPercentage < 100 && (
        <div className="bg-white rounded-lg border border-gray-200 p-5">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="text-sm font-medium text-gray-900">
                Profile Completion
              </h3>
              <p className="text-xs text-gray-500 mt-0.5">
                Complete your profile to increase visibility
              </p>
            </div>
            <span className="text-sm font-semibold text-gray-900">
              {completionPercentage}%
            </span>
          </div>
          <Progress value={completionPercentage} className="h-2" />
          
          {completionPercentage < 100 && (
            <button
              onClick={() => onNavigate('edit-profile')}
              className="flex items-center gap-1 mt-3 text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              Complete your profile
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          label="Rating"
          value={user.rating?.toFixed(1) || "0.0"}
          icon={<Star className="w-4 h-4 text-amber-500" />}
          subtext={`${user.totalReviews || 0} reviews`}
        />
        <StatCard
          label="Tasks Completed"
          value={String(user.completedTasks || 0)}
          icon={<CheckCircle2 className="w-4 h-4 text-green-500" />}
        />
        <StatCard
          label="Total Tasks"
          value={String(user.totalTasks || 0)}
          icon={<Briefcase className="w-4 h-4 text-blue-500" />}
        />
        <StatCard
          label="Verifications"
          value={`${verifiedCount}/${verificationItems.length}`}
          icon={<Shield className="w-4 h-4 text-purple-500" />}
          onClick={() => onNavigate('verifications')}
        />
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="px-5 py-4 border-b border-gray-100">
          <h3 className="text-sm font-medium text-gray-900">Quick Actions</h3>
        </div>
        <div className="divide-y divide-gray-100">
          <QuickActionItem
            icon={<Shield className="w-5 h-5" />}
            title="Complete Verifications"
            description={
              verifiedCount === verificationItems.length
                ? "All verifications complete"
                : `${verificationItems.length - verifiedCount} pending`
            }
            status={verifiedCount === verificationItems.length ? 'complete' : 'pending'}
            onClick={() => onNavigate('verifications')}
          />
          <QuickActionItem
            icon={<CheckCircle2 className="w-5 h-5" />}
            title="Update Preferences"
            description="Set your task categories and availability"
            onClick={() => onNavigate('preferences')}
          />
          <QuickActionItem
            icon={<Clock className="w-5 h-5" />}
            title="Review Notifications"
            description="Manage your communication settings"
            onClick={() => onNavigate('notifications')}
          />
        </div>
      </div>

      {/* Account Status */}
      <div className="bg-white rounded-lg border border-gray-200 p-5">
        <h3 className="text-sm font-medium text-gray-900 mb-4">Account Status</h3>
        <div className="space-y-3">
          <StatusRow
            label="Account Status"
            value={user.isActive ? "Active" : "Inactive"}
            status={user.isActive ? "success" : "warning"}
          />
          <StatusRow
            label="Member Since"
            value={formatDate(user.createdAt)}
            status="neutral"
          />
          <StatusRow
            label="Last Updated"
            value={formatDate(user.updatedAt)}
            status="neutral"
          />
        </div>
      </div>
    </div>
  );
}

// Helper Components
interface StatCardProps {
  label: string;
  value: string;
  icon: React.ReactNode;
  subtext?: string;
  onClick?: () => void;
}

function StatCard({ label, value, icon, subtext, onClick }: StatCardProps) {
  const Component = onClick ? 'button' : 'div';
  return (
    <Component
      onClick={onClick}
      className={cn(
        "bg-white rounded-lg border border-gray-200 p-4",
        onClick && "hover:border-gray-300 transition-colors cursor-pointer text-left"
      )}
    >
      <div className="flex items-center gap-2 mb-2">
        {icon}
        <span className="text-xs text-gray-500 font-medium">{label}</span>
      </div>
      <p className="text-2xl font-semibold text-gray-900">{value}</p>
      {subtext && (
        <p className="text-xs text-gray-500 mt-1">{subtext}</p>
      )}
    </Component>
  );
}

interface QuickActionItemProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  status?: 'complete' | 'pending' | 'warning';
  onClick: () => void;
}

function QuickActionItem({ icon, title, description, status, onClick }: QuickActionItemProps) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-4 px-5 py-4 hover:bg-gray-50 transition-colors text-left"
    >
      <span className="text-gray-400">{icon}</span>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-900">{title}</p>
        <p className="text-xs text-gray-500 mt-0.5">{description}</p>
      </div>
      {status === 'complete' && (
        <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
      )}
      {status === 'pending' && (
        <AlertCircle className="w-5 h-5 text-amber-500 flex-shrink-0" />
      )}
      <ArrowRight className="w-4 h-4 text-gray-400 flex-shrink-0" />
    </button>
  );
}

interface StatusRowProps {
  label: string;
  value: string;
  status: 'success' | 'warning' | 'error' | 'neutral';
}

function StatusRow({ label, value, status }: StatusRowProps) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm text-gray-500">{label}</span>
      <span
        className={cn(
          "text-sm font-medium",
          status === 'success' && "text-green-600",
          status === 'warning' && "text-amber-600",
          status === 'error' && "text-red-600",
          status === 'neutral' && "text-gray-900"
        )}
      >
        {value}
      </span>
    </div>
  );
}

// Helper functions
function calculateCompletionPercentage(user: UserProfile): number {
  const fields = {
    name: !!user.name,
    email: !!user.email,
    phone: !!user.phone,
    location: !!user.location,
    roles: !!user.roles && user.roles.length > 0,
    skills: !!user.skills && user.skills.list && user.skills.list.length > 0,
  };
  
  const completedFields = Object.values(fields).filter(Boolean).length;
  return Math.round((completedFields / Object.keys(fields).length) * 100);
}

function getVerificationStatus(user: UserProfile) {
  return [
    { type: 'phone', status: user.phone ? 'verified' : 'not_started' },
    { type: 'email', status: user.email ? 'verified' : 'not_started' },
    { type: 'aadhaar', status: user.isAadhaarVerified ? 'verified' : 'not_started' },
  ];
}

function formatDate(date?: Date | string): string {
  if (!date) return 'N/A';
  const d = new Date(date);
  return d.toLocaleDateString('en-IN', { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric' 
  });
}

export default ProfileOverview;
