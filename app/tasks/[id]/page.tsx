'use client';

/**
 * Task Details Page
 * Shows detailed information about a specific task
 * Matches: web-apps/extrahand-web-app/src/TaskDetailsScreen.tsx
 * NO API CALLS - Just UI with mock data
 */

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { NavBar } from '@/components/layout/NavBar';
import { Footer } from '@/components/layout/Footer';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

const PRIMARY_YELLOW = '#f9b233';
const PRIMARY_BLUE = '#2563eb';

// Mock task data
const mockTaskData = {
  id: 'task1',
  _id: 'task1',
  title: 'Home Deep Cleaning',
  poster: 'John Doe',
  postedTime: '2 hours ago',
  location: 'Hitech City, Hyderabad',
  dueDate: 'Before Wed, 23 Jul',
  dueTime: 'Anytime',
  budget: '₹1500',
  description: 'Complete deep cleaning for 3BHK apartment including kitchen and bathrooms. Need professional service with eco-friendly products. All rooms need to be thoroughly cleaned, including windows and balcony.',
  status: 'OPEN',
  category: 'Cleaning',
  images: [],
  urgency: 'normal',
  requirements: ['Eco-friendly products', 'Professional equipment'],
  tags: ['Deep Cleaning', 'Residential'],
  createdAt: new Date(Date.now() - 7200000).toISOString(),
  scheduledDate: null,
  scheduledTime: null,
  // Task tracking status (for assigned tasks)
  trackingStatus: null, // null, 'assigned', 'started', 'in_progress', 'review', 'completed'
  assigneeName: null,
};

const getStatusColor = (status: string) => {
  switch (status?.toUpperCase()) {
    case 'OPEN': return '#4CAF50';
    case 'ASSIGNED': return '#2196F3';
    case 'IN_PROGRESS': return '#FF9800';
    case 'COMPLETED': return '#4CAF50';
    case 'CANCELLED': return '#F44336';
    default: return '#4CAF50';
  }
};

const formatTimeAgo = (timestamp: number) => {
  const now = Date.now();
  const diff = now - timestamp;
  const minutes = Math.floor(diff / (1000 * 60));
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));

  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
  if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  return `${days} day${days > 1 ? 's' : ''} ago`;
};

export default function TaskDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const taskId = params.id as string;
  
  const [isMobileView, setIsMobileView] = useState(false);
  const [activeTab, setActiveTab] = useState<'offers' | 'questions'>('offers');
  const [questionText, setQuestionText] = useState('');
  const [loading] = useState(false);
  const [taskData] = useState(mockTaskData);

  useEffect(() => {
    const checkScreenSize = () => {
      const width = window.innerWidth;
      setIsMobileView(width <= 768);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  const handleMakeOffer = () => {
    router.push(`/tasks/${taskId}/apply`);
  };

  const handleFollow = () => {
    alert('Follow functionality would be implemented here. (Mock)');
  };

  const handleSendQuestion = () => {
    if (questionText.trim()) {
      alert('Your question has been sent to the task poster. (Mock)');
      setQuestionText('');
    }
  };

  const handleViewMap = () => {
    alert('Map view functionality would be implemented here. (Mock)');
  };

  const handleTrackProgress = () => {
    router.push(`/tasks/${taskId}/track`);
  };

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen bg-white">
        <NavBar showBackButton onBackPress={() => router.back()} />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <LoadingSpinner size="lg" />
            <p className="mt-4 text-base text-gray-600">Loading task details...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // Mobile layout
  if (isMobileView) {
    return (
      <div className="flex flex-col min-h-screen bg-white">
        {/* Header */}
        <div className="flex items-center justify-between px-5 pt-12 pb-4 border-b border-gray-200">
          <button onClick={() => router.back()} className="w-10 h-10 flex items-center justify-center">
            <span className="text-xl text-black">←</span>
          </button>
          <h1 className="text-lg font-bold text-black">Task Details</h1>
          <button className="w-10 h-10 flex items-center justify-center">
            <span className="text-xl text-gray-600">📤</span>
          </button>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-5">
            {/* Status Badge */}
            <div className="flex justify-center mb-5">
              <div
                className="px-4 py-2 rounded-full"
                style={{ backgroundColor: getStatusColor(taskData.status) }}
              >
                <span className="text-white text-sm font-semibold">{taskData.status}</span>
              </div>
            </div>

            {/* Task Title */}
            <h2 className="text-2xl font-bold text-black mb-5">{taskData.title}</h2>

            {/* Price and Make Offer Section */}
            <div className="flex items-center justify-between mb-5">
              <div className="bg-gray-50 px-4 py-2.5 rounded-lg">
                <p className="text-xs text-gray-600 uppercase mb-1">Task Budget</p>
                <p className="text-2xl font-bold" style={{ color: PRIMARY_BLUE }}>
                  {taskData.budget}
                </p>
              </div>
              <button
                onClick={handleMakeOffer}
                className="px-5 py-2.5 rounded-full text-base font-semibold text-black"
                style={{ backgroundColor: PRIMARY_YELLOW }}
              >
                Make an offer
              </button>
            </div>

            {/* Task Information Card */}
            <div className="bg-gray-50 p-5 rounded-2xl mb-5">
              {/* Poster Information */}
              <div className="mb-4">
                <div className="flex items-center">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center mr-4"
                    style={{ backgroundColor: PRIMARY_BLUE }}
                  >
                    <span className="text-white text-lg font-bold">
                      {taskData.poster.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-gray-600 uppercase mb-0.5">Posted by</p>
                    <p className="text-base text-black font-medium">{taskData.poster}</p>
                    <p className="text-sm text-gray-600">{taskData.postedTime}</p>
                  </div>
                </div>
              </div>

              {/* Location */}
              <div className="mb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center flex-1">
                    <span className="text-lg mr-4">📍</span>
                    <div className="flex-1">
                      <p className="text-xs text-gray-600 uppercase mb-0.5">Location</p>
                      <p className="text-base text-black font-medium">{taskData.location}</p>
                    </div>
                  </div>
                  <button
                    onClick={handleViewMap}
                    className="text-sm font-medium"
                    style={{ color: PRIMARY_BLUE }}
                  >
                    View map
                  </button>
                </div>
              </div>

              {/* Due Date */}
              <div>
                <div className="flex items-center">
                  <span className="text-lg mr-4">📅</span>
                  <div className="flex-1">
                    <p className="text-xs text-gray-600 uppercase mb-0.5">Due date</p>
                    <p className="text-base text-black font-medium">{taskData.dueDate}</p>
                    <p className="text-sm text-gray-600">{taskData.dueTime}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Task Description */}
            <div className="bg-gray-50 p-5 rounded-2xl mb-5">
              <h3 className="text-lg font-bold text-black mb-2.5">What you need to do</h3>
              <p className="text-base text-gray-700 leading-6">{taskData.description}</p>
            </div>

            {/* Task Images */}
            {taskData.images && taskData.images.length > 0 && (
              <div className="mb-5">
                <h3 className="text-lg font-bold text-black mb-2.5">Photos</h3>
                <div className="flex overflow-x-auto gap-2.5 scrollbar-hide">
                  {taskData.images.map((image, index) => (
                    <div key={index} className="flex-shrink-0 w-24 h-24 bg-gray-200 rounded-lg flex items-center justify-center">
                      <span className="text-sm text-gray-600">Photo {index + 1}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Task Tracking Status (if assigned) */}
            {taskData.trackingStatus && (
              <div className="bg-blue-50 p-4 rounded-xl mb-5 border border-blue-200">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-semibold text-blue-900">Task Status</p>
                  <button
                    onClick={handleTrackProgress}
                    className="text-sm font-semibold text-blue-600 underline"
                  >
                    Track Progress
                  </button>
                </div>
                <p className="text-xs text-blue-700 capitalize">
                  Current Status: <span className="font-semibold">{taskData.trackingStatus.replace('_', ' ')}</span>
                </p>
                {taskData.assigneeName && (
                  <p className="text-xs text-blue-700 mt-1">
                    Assigned to: <span className="font-semibold">{taskData.assigneeName}</span>
                  </p>
                )}
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex justify-around mb-5">
              <button
                onClick={handleFollow}
                className="flex items-center px-5 py-2.5 border border-blue-500 rounded-full bg-white"
              >
                <span className="text-lg mr-2">❤️</span>
                <span className="text-base font-medium" style={{ color: PRIMARY_BLUE }}>
                  Follow Task
                </span>
              </button>
              <button className="flex items-center px-5 py-2.5 border border-gray-600 rounded-full bg-white">
                <span className="text-lg mr-2">🚩</span>
                <span className="text-base text-gray-600">Report</span>
              </button>
            </div>

            {/* Bottom Spacing */}
            <div className="h-24" />
          </div>
        </div>

        {/* Bottom Tabs */}
        <div className="flex border-t border-gray-200">
          <button
            onClick={() => setActiveTab('offers')}
            className={`flex-1 py-4 text-center ${
              activeTab === 'offers'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 text-gray-600'
            }`}
          >
            <span className="text-base font-medium">Offers (0)</span>
          </button>
          <button
            onClick={() => setActiveTab('questions')}
            className={`flex-1 py-4 text-center ${
              activeTab === 'questions'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 text-gray-600'
            }`}
          >
            <span className="text-base font-medium">Questions (0)</span>
          </button>
        </div>

        {/* Question Input */}
        {activeTab === 'questions' && (
          <div className="p-5 border-t border-gray-200">
            <div className="flex items-center mb-4">
              <span className="text-base mr-2">👁️</span>
              <p className="text-xs text-gray-600 flex-1">
                These messages are public and can be seen by anyone. Do not share your personal info.
              </p>
            </div>
            <div className="flex items-end gap-3">
              <div
                className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: PRIMARY_BLUE }}
              >
                <span className="text-white text-base font-bold">U</span>
              </div>
              <textarea
                value={questionText}
                onChange={(e) => setQuestionText(e.target.value)}
                placeholder="Ask a question"
                rows={2}
                className="flex-1 bg-gray-50 rounded-2xl px-4 py-3 text-base text-black min-h-[45px] resize-none"
              />
              <button
                onClick={handleSendQuestion}
                className="text-base font-medium flex-shrink-0"
                style={{ color: PRIMARY_BLUE }}
              >
                Send
              </button>
            </div>
          </div>
        )}

        <Footer />
      </div>
    );
  }

  // Desktop layout
  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Header */}
      <div className="flex items-center justify-between px-16 pt-8 pb-8 border-b border-gray-200">
        <button onClick={() => router.back()} className="w-10 h-10 flex items-center justify-center">
          <span className="text-xl text-black">←</span>
        </button>
        <h1 className="text-2xl font-bold text-black flex-1 text-center">Task Details</h1>
        <button className="w-10 h-10 flex items-center justify-center">
          <span className="text-xl text-gray-600">📤</span>
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-[800px] mx-auto px-16 py-16">
          {/* Status Badge */}
          <div className="flex justify-center mb-8">
            <div
              className="px-4 py-2 rounded-full"
              style={{ backgroundColor: getStatusColor(taskData.status) }}
            >
              <span className="text-white text-sm font-semibold">{taskData.status}</span>
            </div>
          </div>

          {/* Task Title */}
          <h2 className="text-3xl font-bold text-black mb-8">{taskData.title}</h2>

          {/* Two Column Layout */}
          <div className="flex gap-8 mb-8">
            {/* Left Column */}
            <div className="flex-2">
              {/* Task Information Card */}
              <div className="bg-gray-50 p-5 rounded-2xl mb-5">
                {/* Poster Information */}
                <div className="mb-4">
                  <div className="flex items-center">
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center mr-4"
                      style={{ backgroundColor: PRIMARY_BLUE }}
                    >
                      <span className="text-white text-xl font-bold">
                        {taskData.poster.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-600 uppercase mb-0.5">Posted by</p>
                      <p className="text-lg text-black font-medium">{taskData.poster}</p>
                      <p className="text-base text-gray-600">{taskData.postedTime}</p>
                    </div>
                  </div>
                </div>

                {/* Location */}
                <div className="mb-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center flex-1">
                      <span className="text-xl mr-4">📍</span>
                      <div className="flex-1">
                        <p className="text-sm text-gray-600 uppercase mb-0.5">Location</p>
                        <p className="text-lg text-black font-medium">{taskData.location}</p>
                      </div>
                    </div>
                    <button
                      onClick={handleViewMap}
                      className="text-base font-medium"
                      style={{ color: PRIMARY_BLUE }}
                    >
                      View map
                    </button>
                  </div>
                </div>

                {/* Due Date */}
                <div>
                  <div className="flex items-center">
                    <span className="text-xl mr-4">📅</span>
                    <div className="flex-1">
                      <p className="text-sm text-gray-600 uppercase mb-0.5">Due date</p>
                      <p className="text-lg text-black font-medium">{taskData.dueDate}</p>
                      <p className="text-base text-gray-600">{taskData.dueTime}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Task Description */}
              <div className="bg-gray-50 p-5 rounded-2xl mb-5">
                <h3 className="text-lg font-bold text-black mb-2.5">What you need to do</h3>
                <p className="text-base text-gray-700 leading-6">{taskData.description}</p>
              </div>

              {/* Task Images */}
              {taskData.images && taskData.images.length > 0 && (
                <div className="mb-5">
                  <h3 className="text-lg font-bold text-black mb-2.5">Photos</h3>
                  <div className="flex gap-4">
                    {taskData.images.map((image, index) => (
                      <div key={index} className="flex-1 aspect-square bg-gray-200 rounded-xl flex items-center justify-center">
                        <span className="text-base text-gray-600">Photo {index + 1}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Task Tracking Status (if assigned) */}
              {taskData.trackingStatus && (
                <div className="bg-blue-50 p-4 rounded-xl mb-5 border border-blue-200">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-semibold text-blue-900">Task Status</p>
                    <button
                      onClick={handleTrackProgress}
                      className="text-sm font-semibold text-blue-600 underline"
                    >
                      Track Progress
                    </button>
                  </div>
                  <p className="text-xs text-blue-700 capitalize">
                    Current Status: <span className="font-semibold">{taskData.trackingStatus.replace('_', ' ')}</span>
                  </p>
                  {taskData.assigneeName && (
                    <p className="text-xs text-blue-700 mt-1">
                      Assigned to: <span className="font-semibold">{taskData.assigneeName}</span>
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Right Column */}
            <div className="flex-1">
              {/* Price Card */}
              <div className="bg-gray-50 p-5 rounded-2xl mb-5">
                <p className="text-xs text-gray-600 uppercase mb-2.5">Task Budget</p>
                <p className="text-3xl font-bold mb-5" style={{ color: PRIMARY_BLUE }}>
                  {taskData.budget}
                </p>
                <button
                  onClick={handleMakeOffer}
                  className="w-full px-5 py-2.5 rounded-full text-base font-semibold text-black"
                  style={{ backgroundColor: PRIMARY_YELLOW }}
                >
                  Make an offer
                </button>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col gap-3">
                <button
                  onClick={handleFollow}
                  className="flex items-center justify-center px-5 py-2.5 border border-blue-500 rounded-full bg-white"
                >
                  <span className="text-lg mr-2">❤️</span>
                  <span className="text-base font-medium" style={{ color: PRIMARY_BLUE }}>
                    Follow Task
                  </span>
                </button>
                <button className="flex items-center justify-center px-5 py-2.5 border border-gray-600 rounded-full bg-white">
                  <span className="text-lg mr-2">🚩</span>
                  <span className="text-base text-gray-600">Report</span>
                </button>
              </div>
            </div>
          </div>

          {/* Bottom Spacing */}
          <div className="h-24" />
        </div>
      </div>

      {/* Bottom Tabs */}
      <div className="flex border-t border-gray-200">
        <button
          onClick={() => setActiveTab('offers')}
          className={`flex-1 py-5 text-center ${
            activeTab === 'offers'
              ? 'bg-blue-500 text-white'
              : 'bg-gray-100 text-gray-600'
          }`}
        >
          <span className="text-lg font-medium">Offers (0)</span>
        </button>
        <button
          onClick={() => setActiveTab('questions')}
          className={`flex-1 py-5 text-center ${
            activeTab === 'questions'
              ? 'bg-blue-500 text-white'
              : 'bg-gray-100 text-gray-600'
          }`}
        >
          <span className="text-lg font-medium">Questions (0)</span>
        </button>
      </div>

      {/* Question Input */}
      {activeTab === 'questions' && (
        <div className="p-8 border-t border-gray-200">
          <div className="flex items-center mb-5">
            <span className="text-lg mr-2.5">👁️</span>
            <p className="text-sm text-gray-600 flex-1">
              These messages are public and can be seen by anyone. Do not share your personal info.
            </p>
          </div>
          <div className="flex items-end gap-4">
            <div
              className="w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: PRIMARY_BLUE }}
            >
              <span className="text-white text-lg font-bold">U</span>
            </div>
            <textarea
              value={questionText}
              onChange={(e) => setQuestionText(e.target.value)}
              placeholder="Ask a question"
              rows={2}
              className="flex-1 bg-gray-50 rounded-3xl px-5 py-4 text-lg text-black min-h-[55px] resize-none"
            />
            <button
              onClick={handleSendQuestion}
              className="text-lg font-medium flex-shrink-0"
              style={{ color: PRIMARY_BLUE }}
            >
              Send
            </button>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
