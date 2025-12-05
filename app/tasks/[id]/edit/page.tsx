'use client';

/**
 * Edit Task Page
 * Single-page form for editing existing tasks
 * Matches: web-apps/extrahand-web-app/src/screens/EditTaskScreen.tsx
 * NO API CALLS - Just UI with mock data
 */

import React, { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

const categories = [
  'Home Services', 'Delivery', 'Tech Help', 'Cleaning', 
  'Handyman', 'Gardening', 'Moving', 'Other'
];

// Mock task data (would be fetched from API)
const mockTask = {
  _id: '1',
  title: 'Garden Maintenance',
  description: 'Weekly garden maintenance and watering for residential property',
  type: 'Gardening',
  category: 'Gardening',
  location: {
    address: 'Banjara Hills, Hyderabad',
    city: 'Hyderabad'
  },
  budget: {
    amount: 2000,
    currency: 'INR'
  },
  status: 'open',
};

export default function EditTaskPage() {
  const router = useRouter();
  const params = useParams();
  const taskId = params.id as string;
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Form state (initialized from mock task)
  const [title, setTitle] = useState(mockTask.title || '');
  const [description, setDescription] = useState(mockTask.description || '');
  const [category, setCategory] = useState(mockTask.type || mockTask.category || '');
  const [location, setLocation] = useState(mockTask.location?.address || '');
  const [budget, setBudget] = useState(mockTask.budget?.amount?.toString() || '');

  const handleSave = async () => {
    if (isSubmitting) return;

    try {
      setIsSubmitting(true);

      // Validate required fields
      if (!title || !description || !category || !location || !budget) {
        alert('Please fill in all required fields');
        return;
      }

      // Mock: Simulate API call
      setTimeout(() => {
        alert('Task updated successfully! (Mock)');
        setIsSubmitting(false);
        router.back();
      }, 1000);
    } catch (error) {
      console.error('Error updating task:', error);
      alert('Failed to update task. Please try again.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Header */}
      <div className="flex items-center px-4 py-4 border-b border-gray-200 bg-gray-50">
        <button 
          onClick={() => router.back()}
          className="p-2"
        >
          <span className="text-2xl text-blue-500">←</span>
        </button>
        <h1 className="text-xl font-bold ml-4">Edit Task</h1>
      </div>

      {/* Form Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {/* Task Title */}
        <div className="mb-6">
          <label className="block text-base font-semibold text-gray-900 mb-2">
            Task Title*
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter task title"
            className="w-full px-3 py-3 rounded-lg text-base bg-gray-50 border border-gray-300"
          />
        </div>

        {/* Category */}
        <div className="mb-6">
          <label className="block text-base font-semibold text-gray-900 mb-2">
            Category*
          </label>
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`
                  px-4 py-2 rounded-full text-sm font-medium
                  ${category === cat
                    ? 'bg-blue-500 text-white font-semibold'
                    : 'bg-gray-100 text-gray-600'}
                `}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Description */}
        <div className="mb-6">
          <label className="block text-base font-semibold text-gray-900 mb-2">
            Description*
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe your task in detail"
            rows={6}
            className="w-full px-3 py-3 rounded-lg text-base bg-gray-50 border border-gray-300 min-h-[120px]"
          />
        </div>

        {/* Location */}
        <div className="mb-6">
          <label className="block text-base font-semibold text-gray-900 mb-2">
            Location*
          </label>
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Enter task location"
            className="w-full px-3 py-3 rounded-lg text-base bg-gray-50 border border-gray-300"
          />
        </div>

        {/* Budget */}
        <div className="mb-6">
          <label className="block text-base font-semibold text-gray-900 mb-2">
            Budget (₹)*
          </label>
          <input
            type="number"
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
            placeholder="Enter budget amount"
            className="w-full px-3 py-3 rounded-lg text-base bg-gray-50 border border-gray-300"
          />
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200 bg-white">
        <button
          onClick={handleSave}
          disabled={isSubmitting}
          className={`
            w-full py-4 px-4 rounded-lg text-base font-semibold text-white
            ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}
          `}
          style={{ backgroundColor: '#2196F3' }}
        >
          {isSubmitting ? (
            <div className="flex items-center justify-center">
              <LoadingSpinner size="sm" />
            </div>
          ) : (
            'Save Changes'
          )}
        </button>
      </div>
    </div>
  );
}
