'use client';

/**
 * Browse Tasks Page (Task Listing)
 * Shows all available tasks with search and filters
 * Matches: web-apps/extrahand-web-app/src/TaskListingScreen.tsx
 * NO API CALLS - Just UI with mock data
 */

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { NavBar } from '@/components/layout/NavBar';
import { Footer } from '@/components/layout/Footer';

const PRIMARY_YELLOW = '#f9b233';
const PRIMARY_BLUE = '#2563eb';

// Mock task data
const mockTasks = [
  {
    id: 1,
    title: 'Replace a kitchen tap',
    location: 'Hyderabad',
    date: 'Tomorrow',
    time: 'Anytime',
    price: '₹249',
    poster: 'M',
    posterAvatar: '👨‍🦱',
  },
  {
    id: 2,
    title: 'Plumber (leakage fix, pipe installation, bathroom fitting)',
    location: 'Hyderabad',
    date: 'Before 14 July',
    time: 'Anytime',
    price: '₹149',
    poster: 'R',
    posterAvatar: '👨‍💼',
  },
  {
    id: 3,
    title: 'Home Deep Cleaning',
    location: 'Basheerbagh',
    date: 'Tomorrow',
    time: 'Anytime',
    price: '₹249',
    poster: 'S',
    posterAvatar: '👨',
  },
  {
    id: 4,
    title: 'TV Mounting Service',
    location: 'Hyderabad',
    date: 'This week',
    time: 'Afternoon',
    price: '₹399',
    poster: 'A',
    posterAvatar: '👨‍🔧',
  },
  {
    id: 5,
    title: 'Garden Maintenance',
    location: 'Secunderabad',
    date: 'Next week',
    time: 'Morning',
    price: '₹199',
    poster: 'K',
    posterAvatar: '👨‍🌾',
  },
];

export default function TasksPage() {
  const router = useRouter();
  const [isMobileView, setIsMobileView] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const checkScreenSize = () => {
      const width = window.innerWidth;
      setIsMobileView(width <= 768);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  const handleTaskClick = (taskId: number) => {
    router.push(`/tasks/${taskId}`);
  };

  const handleOpenClick = (taskId: number) => {
    router.push(`/tasks/${taskId}`);
  };

  const filteredTasks = mockTasks.filter(task =>
    task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    task.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Mobile layout
  if (isMobileView) {
    return (
      <div className="flex flex-col min-h-screen bg-white">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-5 pt-12 pb-4">
          <div className="flex items-center justify-between mb-4">
            {/* Logo */}
            <div className="flex items-center">
              <div className="relative w-8 h-8 rounded-full mr-2" style={{ backgroundColor: PRIMARY_YELLOW }}>
                <span className="text-base text-white">✋</span>
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-lg text-white text-xs flex items-center justify-center" style={{ backgroundColor: PRIMARY_BLUE }}>
                  ✓
                </span>
              </div>
              <span className="text-lg font-bold text-black">Extrahand</span>
            </div>
            {/* Post a Task Button */}
            <button
              onClick={() => router.push('/tasks/new')}
              className="px-5 py-2.5 rounded-full text-sm font-semibold"
              style={{ backgroundColor: PRIMARY_YELLOW, color: '#000' }}
            >
              Post a Task
            </button>
          </div>
          
          {/* Navigation Links */}
          <div className="flex items-center gap-5">
            <button className="text-sm text-gray-600">Browse Tasks</button>
            <button 
              onClick={() => router.push('/performer?tab=my-tasks')}
              className="text-sm text-gray-600"
            >
              My Tasks
            </button>
            <button className="text-sm text-gray-600">List my services</button>
            <button
              onClick={() => router.push('/profile')}
              className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center"
            >
              <span className="text-lg">👤</span>
            </button>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="px-5 py-4 border-b border-gray-200">
          {/* Search Bar */}
          <div className="flex items-center bg-gray-50 rounded-full px-4 py-3 mb-4">
            <span className="text-base mr-2.5">🔍</span>
            <input
              type="text"
              placeholder="Search for a task"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 outline-none text-base bg-transparent"
            />
          </div>
          
          {/* Filter Buttons */}
          <div className="flex flex-wrap gap-2">
            <button className="px-3 py-1.5 bg-gray-50 rounded-2xl text-xs text-gray-600">
              Category
            </button>
            <button className="px-3 py-1.5 bg-gray-50 rounded-2xl text-xs text-gray-600">
              50km Adelaide SA
            </button>
            <button className="px-3 py-1.5 bg-gray-50 rounded-2xl text-xs text-gray-600">
              Any price
            </button>
            <button className="px-3 py-1.5 bg-gray-50 rounded-2xl text-xs text-gray-600">
              Other filters (1)
            </button>
            <button className="px-3 py-1.5 bg-gray-50 rounded-2xl text-xs text-gray-600">
              Sort
            </button>
          </div>
        </div>

        {/* Task List */}
        <div className="flex-1 overflow-y-auto px-5 py-4">
          <h2 className="text-lg font-bold text-black mb-4">Available Tasks</h2>
          {filteredTasks.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20">
              <p className="text-gray-500 text-center mb-2">No tasks found</p>
              <p className="text-sm text-gray-400 text-center">Try adjusting your search</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredTasks.map((task) => (
                <div
                  key={task.id}
                  onClick={() => handleTaskClick(task.id)}
                  className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm cursor-pointer hover:shadow-md transition-shadow"
                >
                  {/* Task Header */}
                  <div className="flex items-start justify-between mb-2.5">
                    <h3 className="text-base font-semibold text-black flex-1 mr-2.5">
                      {task.title}
                    </h3>
                    <div className="flex flex-col items-end">
                      <span className="text-lg font-bold text-black mb-1.5">
                        {task.price}
                      </span>
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold"
                        style={{ backgroundColor: PRIMARY_BLUE }}
                      >
                        {task.poster}
                      </div>
                    </div>
                  </div>
                  
                  {/* Task Details */}
                  <div className="mb-2.5 space-y-1">
                    <div className="flex items-center">
                      <span className="text-sm mr-2">📍</span>
                      <span className="text-sm text-gray-600">{task.location}</span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-sm mr-2">📅</span>
                      <span className="text-sm text-gray-600">{task.date}</span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-sm mr-2">⏰</span>
                      <span className="text-sm text-gray-600">{task.time}</span>
                    </div>
                  </div>
                  
                  {/* Open Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleOpenClick(task.id);
                    }}
                    className="text-sm font-medium"
                    style={{ color: PRIMARY_BLUE }}
                  >
                    Open
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <Footer />
      </div>
    );
  }

  // Desktop layout
  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Header */}
      <div className="flex items-center justify-between px-12 md:px-16 pt-8 pb-5 border-b border-gray-200">
        {/* Left: Logo */}
        <div className="flex items-center">
          <div className="relative w-8 h-8 rounded-full mr-2" style={{ backgroundColor: PRIMARY_YELLOW }}>
            <span className="text-base text-white">✋</span>
            <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-lg text-white text-xs flex items-center justify-center" style={{ backgroundColor: PRIMARY_BLUE }}>
              ✓
            </span>
          </div>
          <span className="text-lg font-bold text-black">Extrahand</span>
        </div>
        
        {/* Center: Post a Task Button */}
        <div className="flex-1 flex justify-center">
          <button
            onClick={() => router.push('/tasks/new')}
            className="px-8 py-3 rounded-full text-base font-semibold"
            style={{ backgroundColor: PRIMARY_YELLOW, color: '#000' }}
          >
            Post a Task
          </button>
        </div>
        
        {/* Right: Navigation Links */}
        <div className="flex items-center gap-8">
          <button className="text-base text-gray-600">Browse Tasks</button>
          <button 
            onClick={() => router.push('/performer?tab=my-tasks')}
            className="text-base text-gray-600"
          >
            My Tasks
          </button>
          <button className="text-base text-gray-600">List my services</button>
          <button
            onClick={() => router.push('/profile')}
            className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center"
          >
            <span className="text-xl">👤</span>
          </button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="px-12 md:px-16 py-5 border-b border-gray-200">
        {/* Search Bar */}
        <div className="flex items-center bg-gray-50 rounded-full px-5 py-4 mb-5 max-w-[600px]">
          <span className="text-lg mr-4">🔍</span>
          <input
            type="text"
            placeholder="Search for a task"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 outline-none text-base bg-transparent"
          />
        </div>
        
        {/* Filter Buttons */}
        <div className="flex gap-4">
          <button className="px-4 py-2 bg-gray-50 rounded-full text-sm text-gray-600">
            Category
          </button>
          <button className="px-4 py-2 bg-gray-50 rounded-full text-sm text-gray-600">
            50km Adelaide SA
          </button>
          <button className="px-4 py-2 bg-gray-50 rounded-full text-sm text-gray-600">
            Any price
          </button>
          <button className="px-4 py-2 bg-gray-50 rounded-full text-sm text-gray-600">
            Other filters (1)
          </button>
          <button className="px-4 py-2 bg-gray-50 rounded-full text-sm text-gray-600">
            Sort
          </button>
        </div>
      </div>

      {/* Main Content - Two Column Layout */}
      <div className="flex flex-1">
        {/* Left Side - Task List */}
        <div className="flex-1 px-12 md:px-16 py-8 border-r border-gray-200 overflow-y-auto">
          <h2 className="text-xl font-bold text-black mb-5">Available Tasks</h2>
          {filteredTasks.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20">
              <p className="text-gray-500 text-center mb-2">No tasks found</p>
              <p className="text-sm text-gray-400 text-center">Try adjusting your search</p>
            </div>
          ) : (
            <div className="space-y-5">
              {filteredTasks.map((task) => (
                <div
                  key={task.id}
                  onClick={() => handleTaskClick(task.id)}
                  className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm cursor-pointer hover:shadow-md transition-shadow"
                >
                  {/* Task Header */}
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="text-lg font-semibold text-black flex-1 mr-4">
                      {task.title}
                    </h3>
                    <div className="flex flex-col items-end">
                      <span className="text-xl font-bold text-black mb-2">
                        {task.price}
                      </span>
                      <div
                        className="w-9 h-9 rounded-full flex items-center justify-center text-white text-base font-bold"
                        style={{ backgroundColor: PRIMARY_BLUE }}
                      >
                        {task.poster}
                      </div>
                    </div>
                  </div>
                  
                  {/* Task Details */}
                  <div className="mb-4 space-y-2">
                    <div className="flex items-center">
                      <span className="text-base mr-2.5">📍</span>
                      <span className="text-base text-gray-600">{task.location}</span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-base mr-2.5">📅</span>
                      <span className="text-base text-gray-600">{task.date}</span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-base mr-2.5">⏰</span>
                      <span className="text-base text-gray-600">{task.time}</span>
                    </div>
                  </div>
                  
                  {/* Open Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleOpenClick(task.id);
                    }}
                    className="text-base font-medium"
                    style={{ color: PRIMARY_BLUE }}
                  >
                    Open
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
        
        {/* Right Side - Map View */}
        <div className="flex-1 px-12 md:px-16 py-8">
          <h2 className="text-xl font-bold text-black mb-5">Task Locations</h2>
          <div className="flex-1 bg-gray-50 rounded-xl flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-600 mb-2.5">Map View</p>
              <p className="text-base text-gray-400 mb-1">Hyderabad, India</p>
              <p className="text-base text-gray-400">Task locations would be displayed here</p>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
