'use client';

/**
 * My Tasks Screen
 * Shows tasks created by the current user
 * Matches: web-apps/extrahand-web-app/src/screens/MyTasksScreen.tsx
 * NO API CALLS - Just UI with mock data
 */

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

// Mock tasks data (tasks created by current user)
const mockMyTasks = [
  {
    _id: '1',
    title: 'Garden Maintenance',
    description: 'Weekly garden maintenance and watering for residential property',
    budget: { amount: 2000, currency: 'INR' },
    location: { city: 'Hyderabad', address: 'Banjara Hills, Hyderabad' },
    category: 'Gardening',
    status: 'open',
    createdAt: new Date().toISOString(),
  },
  {
    _id: '2',
    title: 'Furniture Assembly',
    description: 'Assemble IKEA furniture - 2 chairs and 1 table. Need professional help.',
    budget: { amount: 1500, currency: 'INR' },
    location: { city: 'Hyderabad', address: 'Jubilee Hills, Hyderabad' },
    category: 'Furniture Assembly',
    status: 'assigned',
    createdAt: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    _id: '3',
    title: 'Home Deep Cleaning',
    description: 'Complete deep cleaning for 3BHK apartment including kitchen and bathrooms',
    budget: { amount: 2500, currency: 'INR' },
    location: { city: 'Hyderabad', address: 'Hitech City, Hyderabad' },
    category: 'Cleaning',
    status: 'in_progress',
    createdAt: new Date(Date.now() - 172800000).toISOString(),
  },
];

const getStatusColor = (status: string) => {
  switch (status) {
    case 'open': return '#4CAF50';
    case 'assigned': return '#2196F3';
    case 'in_progress': return '#FF9800';
    case 'completed': return '#4CAF50';
    case 'cancelled': return '#F44336';
    default: return '#9E9E9E';
  }
};

export default function MyTasksScreen() {
  const router = useRouter();
  const [loading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [deletingTaskId, setDeletingTaskId] = useState<string | null>(null);
  const [taskApplications] = useState<{[taskId: string]: number}>({
    '1': 3,
    '2': 1,
    '3': 0,
  });

  const handleDelete = async (task: typeof mockMyTasks[0]) => {
    if (!confirm(`Are you sure you want to delete "${task.title}"?`)) {
      return;
    }
    setDeletingTaskId(task._id);
    // Mock: Simulate API call
    setTimeout(() => {
      alert('Task deleted successfully! (Mock)');
      setDeletingTaskId(null);
    }, 1000);
  };

  const handleTaskClick = (taskId: string) => {
    router.push(`/tasks/${taskId}`);
  };

  const handleEditTask = (task: typeof mockMyTasks[0]) => {
    router.push(`/tasks/${task._id}/edit`);
  };

  const handleViewApplications = (task: typeof mockMyTasks[0]) => {
    router.push(`/tasks/${task._id}/applications`);
  };

  const formatBudget = (budget: { amount: number; currency: string }) => {
    return `₹${budget.amount}`;
  };

  if (loading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-gray-50">
        <LoadingSpinner size="lg" />
        <p className="mt-4 text-base text-gray-600">Loading your tasks...</p>
      </div>
    );
  }

  if (mockMyTasks.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-gray-50 py-20 px-10">
        <p className="text-xl font-bold text-gray-900 mb-2">No tasks posted yet</p>
        <p className="text-base text-gray-600 text-center mb-4">
          You haven't posted any tasks yet. Create your first task to get started!
        </p>
        <button
          onClick={() => router.push('/tasks/new')}
          className="px-6 py-3 bg-blue-500 text-white rounded-lg font-semibold text-base"
        >
          Post Your First Task
        </button>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-gray-50">
      {/* Header */}
      <div className="bg-white px-4 py-4 border-b border-gray-200">
        <h2 className="text-2xl font-bold text-gray-900 mb-1">My Tasks</h2>
        <p className="text-sm text-gray-600">{mockMyTasks.length} tasks posted</p>
      </div>

      {/* Task List */}
      <div className="p-4 space-y-4">
        {mockMyTasks.map((task) => (
          <div
            key={task._id}
            className="bg-white rounded-xl p-4 shadow-sm border border-gray-200"
          >
            {/* Task Header */}
            <div
              onClick={() => handleTaskClick(task._id)}
              className="cursor-pointer mb-4"
            >
              <div className="flex items-start justify-between mb-3">
                <h3 className="text-lg font-bold text-gray-900 flex-1 mr-3">
                  {task.title}
                </h3>
                <div
                  className="px-2 py-1 rounded-xl min-w-[60px] text-center"
                  style={{ backgroundColor: getStatusColor(task.status) }}
                >
                  <span className="text-white text-xs font-bold">
                    {task.status.toUpperCase()}
                  </span>
                </div>
              </div>

              <p className="text-sm text-gray-600 mb-4 line-clamp-2 leading-5">
                {task.description}
              </p>

              {/* Task Details */}
              <div className="space-y-2 mb-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 font-medium">Budget:</span>
                  <span className="text-sm text-gray-900 font-semibold">
                    {formatBudget(task.budget)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 font-medium">Location:</span>
                  <span className="text-sm text-gray-900 font-semibold">
                    {task.location.city || 'N/A'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 font-medium">Category:</span>
                  <span className="text-sm text-gray-900 font-semibold">
                    {task.category}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 font-medium">Posted:</span>
                  <span className="text-sm text-gray-900 font-semibold">
                    {new Date(task.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 font-medium">Applications:</span>
                  <span className="text-sm font-semibold" style={{ color: '#9C27B0' }}>
                    {taskApplications[task._id] || 0} received
                  </span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4 border-t border-gray-200">
              <button
                onClick={() => handleEditTask(task)}
                className="flex-1 py-2.5 px-4 bg-blue-500 text-white rounded-lg text-sm font-semibold"
              >
                Edit
              </button>
              
              {task.status === 'open' ? (
                <button
                  onClick={() => handleViewApplications(task)}
                  className="flex-1 py-2.5 px-4 rounded-lg text-sm font-semibold text-white"
                  style={{ backgroundColor: '#9C27B0' }}
                >
                  Applications ({taskApplications[task._id] || 0})
                </button>
              ) : (
                <button
                  onClick={() => router.push(`/tasks/${task._id}/track`)}
                  className="flex-1 py-2.5 px-4 rounded-lg text-sm font-semibold text-white"
                  style={{ backgroundColor: '#4CAF50' }}
                >
                  Track Progress
                </button>
              )}
              
              <button
                onClick={() => handleDelete(task)}
                disabled={deletingTaskId === task._id}
                className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-semibold text-white ${
                  deletingTaskId === task._id ? 'opacity-50 cursor-not-allowed' : ''
                }`}
                style={{ backgroundColor: '#F44336' }}
              >
                {deletingTaskId === task._id ? (
                  <LoadingSpinner size="sm" />
                ) : (
                  'Delete'
                )}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
