'use client';

/**
 * Profile Page
 * User profile with edit functionality
 * Matches: web-apps/extrahand-web-app/src/ProfileScreen.tsx
 * NO API CALLS - Just UI with mock data
 */

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { NavBar } from '@/components/layout/NavBar';
import { Footer } from '@/components/layout/Footer';
import { useAuth } from '@/lib/auth/context';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

const PRIMARY_YELLOW = '#f9b233';
const PRIMARY_BLUE = '#2563eb';

export default function ProfilePage() {
  const router = useRouter();
  const { currentUser, userData, loading: authLoading } = useAuth();
  const [isMobileView, setIsMobileView] = useState(false);
  const [saving, setSaving] = useState(false);

  // Form state
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [tagline, setTagline] = useState('');
  const [location, setLocation] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [description, setDescription] = useState('');
  const [skills, setSkills] = useState<string[]>([]);
  const [roles, setRoles] = useState<string[]>(['both']);
  const [userType, setUserType] = useState<'individual' | 'business'>('individual');
  const [photoURL, setPhotoURL] = useState('');

  // Stats (mock data - would come from userData)
  const [rating, setRating] = useState(0);
  const [totalReviews, setTotalReviews] = useState(0);
  const [totalTasks, setTotalTasks] = useState(0);
  const [completedTasks, setCompletedTasks] = useState(0);
  const [postedTasks, setPostedTasks] = useState(0);
  const [earnedAmount, setEarnedAmount] = useState(0);

  useEffect(() => {
    const checkScreenSize = () => {
      const width = window.innerWidth;
      setIsMobileView(width <= 768);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  useEffect(() => {
    if (userData) {
      loadUserData();
    }
  }, [userData]);

  const loadUserData = () => {
    if (!userData) return;

    const nameParts = userData.name ? userData.name.split(' ') : ['', ''];
    setFirstName(nameParts[0] || '');
    setLastName(nameParts.slice(1).join(' ') || '');
    setEmail(userData.email || '');
    setPhone(userData.phone || '');
    setLocation(userData.location?.address || '');
    // photoURL is not part of UserProfile type, keeping as empty for now
    setPhotoURL('');
    setRoles(userData.roles || ['both']);
    setUserType((userData.userType as 'individual' | 'business') || 'individual');
    // Extract skills list from UserProfile skills object
    setSkills(userData.skills?.list?.map(s => s.name) || []);
    setRating(userData.rating || 0);
    setTotalReviews(userData.totalReviews || 0);
    setTotalTasks(userData.totalTasks || 0);
    setCompletedTasks(userData.completedTasks || 0);
    // postedTasks and earnedAmount are not part of UserProfile type, using mock values
    setPostedTasks(0);
    setEarnedAmount(0);
    
    if (userData.business?.description) {
      setDescription(userData.business.description);
    }
  };

  const handleSaveProfile = async () => {
    if (!firstName || !lastName) {
      alert('Please fill in your first and last name.');
      return;
    }

    setSaving(true);
    // Mock: Simulate API call
    setTimeout(() => {
      alert('Profile saved successfully! (Mock)');
      setSaving(false);
    }, 1000);
  };

  const handleDeleteAccount = () => {
    if (confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      alert('Account deleted successfully! (Mock)');
      router.push('/');
    }
  };

  const handleViewPublicProfile = () => {
    alert('Viewing your public profile... (Mock)');
  };

  const handleUploadPhoto = () => {
    alert('Photo upload functionality would be implemented here.');
  };

  const handleUploadProfileImage = () => {
    alert('Profile image upload functionality would be implemented here.');
  };

  const handleAddSkill = () => {
    const skill = prompt('Enter a new skill:');
    if (skill && skill.trim()) {
      setSkills([...skills, skill.trim().toLowerCase()]);
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setSkills(skills.filter(skill => skill !== skillToRemove));
  };

  const getVerificationProgress = () => {
    let progress = 0;
    if (firstName && lastName) progress += 20;
    if (email) progress += 20;
    if (phone) progress += 20;
    if (location) progress += 20;
    if (photoURL) progress += 10;
    if (skills.length > 0) progress += 10;
    return Math.min(progress, 100);
  };

  const getPrimaryRole = () => {
    if (!roles || roles.length === 0) return 'both';
    if (roles.includes('tasker') && !roles.includes('poster')) return 'tasker';
    if (roles.includes('poster') && !roles.includes('tasker')) return 'poster';
    return 'both';
  };

  const isPerformer = () => {
    return roles.includes('tasker');
  };

  const isPoster = () => {
    return roles.includes('poster');
  };

  // Show loading if no user
  if (authLoading || !currentUser) {
    return (
      <div className="flex flex-col min-h-screen bg-white items-center justify-center">
        <LoadingSpinner size="lg" />
        <p className="mt-4 text-gray-600">Please sign in to view your profile</p>
      </div>
    );
  }

  // Mobile layout
  if (isMobileView) {
    return (
      <div className="flex flex-col min-h-screen bg-white">
        <NavBar title="Profile" showBackButton />

        <div className="flex-1 overflow-y-auto">
          {/* Account Section */}
          <div className="p-5">
            <div className="mb-5">
              <h1 className="text-2xl font-bold text-black mb-2.5">Account</h1>
              
              {/* Role Indicator */}
              <div
                className="px-3 py-1.5 rounded-2xl self-start mb-2.5"
                style={{ backgroundColor: PRIMARY_BLUE }}
              >
                <span className="text-white text-xs font-semibold">
                  {getPrimaryRole() === 'tasker' ? 'Tasker' : 
                   getPrimaryRole() === 'poster' ? 'Poster' : 'Tasker & Poster'}
                </span>
              </div>

              {/* Verification Progress */}
              <div className="mb-4">
                <p className="text-xs text-gray-600 mb-2">
                  YOUR VERIFICATIONS ARE {getVerificationProgress()}% COMPLETE
                </p>
                <div className="h-1 bg-gray-200 rounded">
                  <div
                    className="h-full rounded"
                    style={{ 
                      width: `${getVerificationProgress()}%`,
                      backgroundColor: PRIMARY_YELLOW
                    }}
                  />
                </div>
              </div>
            </div>

            {/* View Public Profile Button */}
            <button
              onClick={handleViewPublicProfile}
              className="w-full bg-gray-50 py-3 px-4 rounded-lg mb-5"
            >
              <span className="text-sm font-medium" style={{ color: PRIMARY_YELLOW }}>
                View Your public profile
              </span>
            </button>

            {/* Your Stats Section */}
            <div className="bg-white rounded-xl p-4 mb-4 shadow-sm border border-gray-200">
              <h2 className="text-base font-semibold text-black mb-3">Your Stats</h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <p className="text-lg font-bold mb-1" style={{ color: PRIMARY_BLUE }}>
                    {rating.toFixed(1)}
                  </p>
                  <p className="text-xs text-gray-600">Rating</p>
                </div>
                <div className="text-center">
                  <p className="text-lg font-bold mb-1" style={{ color: PRIMARY_BLUE }}>
                    {totalReviews}
                  </p>
                  <p className="text-xs text-gray-600">Reviews</p>
                </div>
                {isPerformer() && (
                  <>
                    <div className="text-center">
                      <p className="text-lg font-bold mb-1" style={{ color: PRIMARY_BLUE }}>
                        {completedTasks}
                      </p>
                      <p className="text-xs text-gray-600">Completed</p>
                    </div>
                    <div className="text-center">
                      <p className="text-lg font-bold mb-1" style={{ color: PRIMARY_BLUE }}>
                        ₹{earnedAmount.toLocaleString()}
                      </p>
                      <p className="text-xs text-gray-600">Earned</p>
                    </div>
                  </>
                )}
                {isPoster() && (
                  <>
                    <div className="text-center">
                      <p className="text-lg font-bold mb-1" style={{ color: PRIMARY_BLUE }}>
                        {postedTasks}
                      </p>
                      <p className="text-xs text-gray-600">Posted</p>
                    </div>
                    <div className="text-center">
                      <p className="text-lg font-bold mb-1" style={{ color: PRIMARY_BLUE }}>
                        {totalTasks}
                      </p>
                      <p className="text-xs text-gray-600">Total Tasks</p>
                    </div>
                  </>
                )}
                {getPrimaryRole() === 'both' && (
                  <>
                    <div className="text-center">
                      <p className="text-lg font-bold mb-1" style={{ color: PRIMARY_BLUE }}>
                        {totalTasks}
                      </p>
                      <p className="text-xs text-gray-600">Total Tasks</p>
                    </div>
                    <div className="text-center">
                      <p className="text-lg font-bold mb-1" style={{ color: PRIMARY_BLUE }}>
                        {completedTasks}
                      </p>
                      <p className="text-xs text-gray-600">Completed</p>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Profile Photo Section */}
            <div className="mb-5">
              <h2 className="text-base font-semibold text-black mb-2.5">Profile Photo</h2>
              <div className="flex items-center gap-2.5">
                {photoURL ? (
                  <Image
                    src={photoURL}
                    alt="Profile"
                    width={80}
                    height={80}
                    className="w-20 h-20 rounded-full object-cover"
                  />
                ) : (
                  <div
                    className="w-20 h-20 rounded-full flex items-center justify-center text-white text-2xl font-bold"
                    style={{ backgroundColor: PRIMARY_BLUE }}
                  >
                    {firstName ? firstName.charAt(0).toUpperCase() : '👤'}
                  </div>
                )}
                <button
                  onClick={handleUploadPhoto}
                  className="px-4 py-2 rounded-lg text-sm font-medium"
                  style={{ backgroundColor: PRIMARY_YELLOW, color: '#000' }}
                >
                  Upload photo
                </button>
              </div>
            </div>

            {/* Profile Image Section */}
            <div className="mb-5">
              <h2 className="text-base font-semibold text-black mb-1">Profile image</h2>
              <p className="text-xs text-gray-600 mb-2.5">modify your public profile</p>
              <div className="w-[120px] h-[120px] bg-gray-50 rounded-lg flex items-center justify-center mb-2.5">
                <span className="text-5xl text-gray-300">&</span>
              </div>
              <button
                onClick={handleUploadProfileImage}
                className="bg-gray-50 px-4 py-2 rounded-lg self-start"
              >
                <span className="text-sm font-medium" style={{ color: PRIMARY_YELLOW }}>
                  upload profile image
                </span>
              </button>
            </div>

            {/* Form Fields */}
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-black mb-2">
                  First name*
                </label>
                <input
                  type="text"
                  placeholder="Name"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 rounded-lg text-base text-black"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-black mb-2">
                  Last name*
                </label>
                <input
                  type="text"
                  placeholder="Name"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 rounded-lg text-base text-black"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-black mb-2">
                  Tagline
                </label>
                <input
                  type="text"
                  placeholder="Mini bio"
                  value={tagline}
                  onChange={(e) => setTagline(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 rounded-lg text-base text-black"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-black mb-2">
                  Location
                </label>
                <input
                  type="text"
                  placeholder="Enter your Location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 rounded-lg text-base text-black"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-black mb-2">
                  Email
                </label>
                <input
                  type="email"
                  placeholder="Enter your mail"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 rounded-lg text-base text-black"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-black mb-2">
                  Phone
                </label>
                <input
                  type="tel"
                  placeholder="Phone number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 rounded-lg text-base text-black"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-black mb-2">
                  User Type
                </label>
                <div className="flex gap-3">
                  <button
                    onClick={() => setUserType('individual')}
                    className={`flex-1 py-3 px-4 rounded-lg border text-center font-medium ${
                      userType === 'individual'
                        ? 'border-blue-500 bg-blue-500 text-white'
                        : 'border-gray-300 bg-white text-gray-600'
                    }`}
                  >
                    Individual
                  </button>
                  <button
                    onClick={() => setUserType('business')}
                    className={`flex-1 py-3 px-4 rounded-lg border text-center font-medium ${
                      userType === 'business'
                        ? 'border-blue-500 bg-blue-500 text-white'
                        : 'border-gray-300 bg-white text-gray-600'
                    }`}
                  >
                    Business
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-black mb-2">
                  Roles
                </label>
                <div className="space-y-3">
                  <button
                    onClick={() => {
                      if (roles.includes('poster')) {
                        setRoles(roles.filter(r => r !== 'poster'));
                      } else {
                        setRoles([...roles, 'poster']);
                      }
                    }}
                    className={`w-full flex items-center p-3 rounded-lg border ${
                      roles.includes('poster')
                        ? 'border-blue-500 bg-blue-500 text-white'
                        : 'border-gray-300 bg-white text-gray-600'
                    }`}
                  >
                    <span className="ml-2 font-medium">Post Tasks</span>
                  </button>
                  <button
                    onClick={() => {
                      if (roles.includes('tasker')) {
                        setRoles(roles.filter(r => r !== 'tasker'));
                      } else {
                        setRoles([...roles, 'tasker']);
                      }
                    }}
                    className={`w-full flex items-center p-3 rounded-lg border ${
                      roles.includes('tasker')
                        ? 'border-blue-500 bg-blue-500 text-white'
                        : 'border-gray-300 bg-white text-gray-600'
                    }`}
                  >
                    <span className="ml-2 font-medium">Complete Tasks</span>
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-black mb-2">
                  Skills
                </label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {skills.map((skill, index) => (
                    <div
                      key={index}
                      className="flex items-center px-3 py-1.5 rounded-2xl"
                      style={{ backgroundColor: PRIMARY_BLUE }}
                    >
                      <span className="text-white text-xs mr-1">{skill}</span>
                      <button
                        onClick={() => handleRemoveSkill(skill)}
                        className="text-white text-base font-bold"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                  <button
                    onClick={handleAddSkill}
                    className="px-3 py-1.5 rounded-2xl border border-dashed"
                    style={{ borderColor: PRIMARY_BLUE }}
                  >
                    <span className="text-xs" style={{ color: PRIMARY_BLUE }}>
                      + Add Skill
                    </span>
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-black mb-2">
                  Description
                </label>
                <textarea
                  placeholder="Enter your description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                  className="w-full px-4 py-3 bg-gray-50 rounded-lg text-base text-black min-h-[100px]"
                />
              </div>

              {/* Business Description Section */}
              {userType === 'business' && (
                <div>
                  <label className="block text-sm font-semibold text-black mb-2">
                    Business Description
                  </label>
                  <textarea
                    placeholder="Describe your business..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={4}
                    className="w-full px-4 py-3 bg-gray-50 rounded-lg text-base text-black min-h-[100px]"
                  />
                </div>
              )}

              {/* Action Buttons */}
              <div className="space-y-4 pt-5">
                <button
                  onClick={handleSaveProfile}
                  disabled={saving}
                  className={`w-full py-4 px-5 rounded-lg text-center font-semibold text-base ${
                    saving ? 'opacity-60 cursor-not-allowed' : ''
                  }`}
                  style={{ backgroundColor: PRIMARY_YELLOW, color: '#000' }}
                >
                  {saving ? <LoadingSpinner size="sm" /> : 'Save profile'}
                </button>
                
                <button
                  onClick={handleDeleteAccount}
                  className="w-full py-4 px-5 bg-black text-white rounded-lg text-center font-semibold text-base"
                >
                  Delete my account
                </button>
              </div>
            </div>
          </div>
        </div>

        <Footer />
      </div>
    );
  }

  // Desktop layout
  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Header */}
      <div className="flex items-center justify-between px-10 pt-8 pb-5 border-b border-gray-200">
        <button
          onClick={() => router.back()}
          className="w-10 h-10 flex items-center justify-center"
        >
          <span className="text-xl text-black">←</span>
        </button>
        
        <div className="flex-1 flex justify-center">
          <Image
            src="/assets/images/logo.png"
            alt="Extrahand Logo"
            width={150}
            height={50}
            className="object-contain"
          />
        </div>
        
        <button
          onClick={() => router.push('/tasks/new')}
          className="w-15 h-10 rounded-lg flex items-center justify-center"
          style={{ backgroundColor: PRIMARY_YELLOW, width: '60px' }}
        >
          <span className="text-xl text-white">+</span>
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-[800px] mx-auto px-10 py-10">
          {/* Account Section */}
          <div>
            <div className="mb-5">
              <h1 className="text-3xl font-bold text-black mb-2.5">Account</h1>
              
              {/* Role Indicator */}
              <div
                className="px-4 py-2 rounded-full self-start mb-4"
                style={{ backgroundColor: PRIMARY_BLUE }}
              >
                <span className="text-white text-sm font-semibold">
                  {getPrimaryRole() === 'tasker' ? 'Tasker' : 
                   getPrimaryRole() === 'poster' ? 'Poster' : 'Tasker & Poster'}
                </span>
              </div>

              {/* Verification Progress */}
              <div className="mb-4">
                <p className="text-sm text-gray-600 mb-2">
                  YOUR VERIFICATIONS ARE {getVerificationProgress()}% COMPLETE
                </p>
                <div className="h-1.5 bg-gray-200 rounded">
                  <div
                    className="h-full rounded"
                    style={{ 
                      width: `${getVerificationProgress()}%`,
                      backgroundColor: PRIMARY_YELLOW
                    }}
                  />
                </div>
              </div>
            </div>

            {/* View Public Profile Button */}
            <button
              onClick={handleViewPublicProfile}
              className="w-full bg-gray-50 py-4 px-5 rounded-lg mb-8"
            >
              <span className="text-base font-medium" style={{ color: PRIMARY_YELLOW }}>
                View Your public profile
              </span>
            </button>

            {/* Your Stats Section */}
            <div className="bg-white rounded-xl p-5 mb-8 shadow-sm border border-gray-200">
              <h2 className="text-lg font-semibold text-black mb-4">Your Stats</h2>
              <div className="grid grid-cols-4 gap-4">
                <div className="text-center">
                  <p className="text-2xl font-bold mb-1.5" style={{ color: PRIMARY_BLUE }}>
                    {rating.toFixed(1)}
                  </p>
                  <p className="text-sm text-gray-600">Rating</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold mb-1.5" style={{ color: PRIMARY_BLUE }}>
                    {totalReviews}
                  </p>
                  <p className="text-sm text-gray-600">Reviews</p>
                </div>
                {isPerformer() && (
                  <>
                    <div className="text-center">
                      <p className="text-2xl font-bold mb-1.5" style={{ color: PRIMARY_BLUE }}>
                        {completedTasks}
                      </p>
                      <p className="text-sm text-gray-600">Completed</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold mb-1.5" style={{ color: PRIMARY_BLUE }}>
                        ₹{earnedAmount.toLocaleString()}
                      </p>
                      <p className="text-sm text-gray-600">Earned</p>
                    </div>
                  </>
                )}
                {isPoster() && (
                  <>
                    <div className="text-center">
                      <p className="text-2xl font-bold mb-1.5" style={{ color: PRIMARY_BLUE }}>
                        {postedTasks}
                      </p>
                      <p className="text-sm text-gray-600">Posted</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold mb-1.5" style={{ color: PRIMARY_BLUE }}>
                        {totalTasks}
                      </p>
                      <p className="text-sm text-gray-600">Total Tasks</p>
                    </div>
                  </>
                )}
                {getPrimaryRole() === 'both' && (
                  <>
                    <div className="text-center">
                      <p className="text-2xl font-bold mb-1.5" style={{ color: PRIMARY_BLUE }}>
                        {totalTasks}
                      </p>
                      <p className="text-sm text-gray-600">Total Tasks</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold mb-1.5" style={{ color: PRIMARY_BLUE }}>
                        {completedTasks}
                      </p>
                      <p className="text-sm text-gray-600">Completed</p>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Upload Avatar Section */}
            <div className="mb-8">
              <h2 className="text-lg font-semibold text-black mb-4">Upload Avatar</h2>
              <div className="flex items-center gap-4">
                <span className="text-3xl">👤</span>
                <button
                  onClick={handleUploadPhoto}
                  className="px-5 py-3 rounded-lg text-base font-medium"
                  style={{ backgroundColor: PRIMARY_YELLOW, color: '#000' }}
                >
                  Upload photo
                </button>
              </div>
            </div>

            {/* Profile Image Section */}
            <div className="mb-8">
              <h2 className="text-lg font-semibold text-black mb-1">Profile image</h2>
              <p className="text-sm text-gray-600 mb-4">modify your public profile</p>
              <div className="w-[150px] h-[150px] bg-gray-50 rounded-xl flex items-center justify-center mb-4">
                <span className="text-6xl text-gray-300">&</span>
              </div>
              <button
                onClick={handleUploadProfileImage}
                className="bg-gray-50 px-5 py-3 rounded-lg"
              >
                <span className="text-base font-medium" style={{ color: PRIMARY_YELLOW }}>
                  upload profile image
                </span>
              </button>
            </div>

            {/* Form Fields */}
            <div className="space-y-6">
              <div>
                <label className="block text-base font-semibold text-black mb-2.5">
                  First name*
                </label>
                <input
                  type="text"
                  placeholder="Name"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full px-5 py-4 bg-gray-50 rounded-lg text-base text-black"
                />
              </div>

              <div>
                <label className="block text-base font-semibold text-black mb-2.5">
                  Last name*
                </label>
                <input
                  type="text"
                  placeholder="Name"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="w-full px-5 py-4 bg-gray-50 rounded-lg text-base text-black"
                />
              </div>

              <div>
                <label className="block text-base font-semibold text-black mb-2.5">
                  Tagline
                </label>
                <input
                  type="text"
                  placeholder="Mini bio"
                  value={tagline}
                  onChange={(e) => setTagline(e.target.value)}
                  className="w-full px-5 py-4 bg-gray-50 rounded-lg text-base text-black"
                />
              </div>

              <div>
                <label className="block text-base font-semibold text-black mb-2.5">
                  Location
                </label>
                <input
                  type="text"
                  placeholder="Enter your Location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full px-5 py-4 bg-gray-50 rounded-lg text-base text-black"
                />
              </div>

              <div>
                <label className="block text-base font-semibold text-black mb-2.5">
                  Email
                </label>
                <input
                  type="email"
                  placeholder="Enter your mail"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-5 py-4 bg-gray-50 rounded-lg text-base text-black"
                />
              </div>

              <div>
                <label className="block text-base font-semibold text-black mb-2.5">
                  Phone
                </label>
                <input
                  type="tel"
                  placeholder="Phone number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-5 py-4 bg-gray-50 rounded-lg text-base text-black"
                />
              </div>

              <div>
                <label className="block text-base font-semibold text-black mb-2.5">
                  User Type
                </label>
                <div className="flex gap-4">
                  <button
                    onClick={() => setUserType('individual')}
                    className={`flex-1 py-4 px-4 rounded-lg border text-center font-medium ${
                      userType === 'individual'
                        ? 'border-blue-500 bg-blue-500 text-white'
                        : 'border-gray-300 bg-white text-gray-600'
                    }`}
                  >
                    Individual
                  </button>
                  <button
                    onClick={() => setUserType('business')}
                    className={`flex-1 py-4 px-4 rounded-lg border text-center font-medium ${
                      userType === 'business'
                        ? 'border-blue-500 bg-blue-500 text-white'
                        : 'border-gray-300 bg-white text-gray-600'
                    }`}
                  >
                    Business
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-base font-semibold text-black mb-2.5">
                  Roles
                </label>
                <div className="space-y-4">
                  <button
                    onClick={() => {
                      if (roles.includes('poster')) {
                        setRoles(roles.filter(r => r !== 'poster'));
                      } else {
                        setRoles([...roles, 'poster']);
                      }
                    }}
                    className={`w-full flex items-center p-4 rounded-lg border ${
                      roles.includes('poster')
                        ? 'border-blue-500 bg-blue-500 text-white'
                        : 'border-gray-300 bg-white text-gray-600'
                    }`}
                  >
                    <span className="ml-3 font-medium text-base">Post Tasks</span>
                  </button>
                  <button
                    onClick={() => {
                      if (roles.includes('tasker')) {
                        setRoles(roles.filter(r => r !== 'tasker'));
                      } else {
                        setRoles([...roles, 'tasker']);
                      }
                    }}
                    className={`w-full flex items-center p-4 rounded-lg border ${
                      roles.includes('tasker')
                        ? 'border-blue-500 bg-blue-500 text-white'
                        : 'border-gray-300 bg-white text-gray-600'
                    }`}
                  >
                    <span className="ml-3 font-medium text-base">Complete Tasks</span>
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-base font-semibold text-black mb-2.5">
                  Skills
                </label>
                <div className="flex flex-wrap gap-3 mt-3">
                  {skills.map((skill, index) => (
                    <div
                      key={index}
                      className="flex items-center px-4 py-2 rounded-full"
                      style={{ backgroundColor: PRIMARY_BLUE }}
                    >
                      <span className="text-white text-sm mr-1.5">{skill}</span>
                      <button
                        onClick={() => handleRemoveSkill(skill)}
                        className="text-white text-lg font-bold"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                  <button
                    onClick={handleAddSkill}
                    className="px-4 py-2 rounded-full border border-dashed"
                    style={{ borderColor: PRIMARY_BLUE }}
                  >
                    <span className="text-sm" style={{ color: PRIMARY_BLUE }}>
                      + Add Skill
                    </span>
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-base font-semibold text-black mb-2.5">
                  Description
                </label>
                <textarea
                  placeholder="Enter your description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                  className="w-full px-5 py-4 bg-gray-50 rounded-lg text-base text-black min-h-[120px]"
                />
              </div>

              {/* Business Description Section */}
              {userType === 'business' && (
                <div>
                  <label className="block text-base font-semibold text-black mb-2.5">
                    Business Description
                  </label>
                  <textarea
                    placeholder="Describe your business..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={4}
                    className="w-full px-5 py-4 bg-gray-50 rounded-lg text-base text-black min-h-[120px]"
                  />
                </div>
              )}

              {/* Action Buttons */}
              <div className="space-y-5 pt-8">
                <button
                  onClick={handleSaveProfile}
                  disabled={saving}
                  className={`w-full py-4 px-8 rounded-lg text-center font-semibold text-lg ${
                    saving ? 'opacity-60 cursor-not-allowed' : ''
                  }`}
                  style={{ backgroundColor: PRIMARY_YELLOW, color: '#000' }}
                >
                  {saving ? <LoadingSpinner size="sm" /> : 'Save profile'}
                </button>
                
                <button
                  onClick={handleDeleteAccount}
                  className="w-full py-4 px-8 bg-black text-white rounded-lg text-center font-semibold text-lg"
                >
                  Delete my account
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
