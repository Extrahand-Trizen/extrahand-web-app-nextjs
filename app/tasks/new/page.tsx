'use client';

/**
 * Post a Task Page (Task Posting Form)
 * Multi-step form for creating/editing tasks
 * Matches: web-apps/extrahand-web-app/src/TaskPostingForm.tsx
 * NO API CALLS - Just UI with mock data
 */

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

const PRIMARY_YELLOW = '#f9b233';
const PRIMARY_BLUE = '#2563eb';

const categories = [
  'Home Services', 'Delivery', 'Tech Help', 'Cleaning', 
  'Handyman', 'Gardening', 'Moving', 'Other'
];

export default function PostTaskPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isMobileView, setIsMobileView] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Form state
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDescription, setTaskDescription] = useState('');
  const [taskCategory, setTaskCategory] = useState(searchParams.get('category') || '');
  const [location, setLocation] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [dueTime, setDueTime] = useState('');
  const [budget, setBudget] = useState('');
  const [additionalNotes, setAdditionalNotes] = useState('');
  const [selectedImages, setSelectedImages] = useState<string[]>([]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const checkScreenSize = () => {
      const width = window.innerWidth;
      setIsMobileView(width <= 768);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  const handleNext = async () => {
    if (currentStep < 3) {
      // Validate current step
      if (currentStep === 1 && (!taskTitle || !taskDescription || !taskCategory)) {
        alert('Please fill in all required fields');
        return;
      }
      if (currentStep === 2 && !location) {
        alert('Please enter a location');
        return;
      }
      setCurrentStep(currentStep + 1);
    } else {
      // Final submission (mock)
      if (isSubmitting) return;
      
      if (!budget) {
        alert('Please enter a budget');
        return;
      }
      
      setIsSubmitting(true);
      // Mock: Simulate API call
      setTimeout(() => {
        alert('Task posted successfully! (Mock)');
        setIsSubmitting(false);
        router.push('/poster');
      }, 1000);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    } else {
      router.back();
    }
  };

  const handleImageUpload = () => {
    alert('Image upload functionality would be implemented here.');
  };

  const renderStep1 = () => (
    <div className={isMobileView ? 'mb-6' : 'mb-10'}>
      <h2 className={`${isMobileView ? 'text-lg font-semibold mb-4' : 'text-2xl font-bold mb-8'} text-black`}>
        What type of task is this?
      </h2>
      
      {/* Category Grid */}
      <div className={`${isMobileView ? 'grid grid-cols-2 gap-2.5 mb-6' : 'flex flex-wrap gap-5 mb-10'}`}>
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setTaskCategory(category)}
            className={`
              ${isMobileView 
                ? 'w-full py-4 px-5 rounded-lg text-base font-medium' 
                : 'w-[47%] py-6 px-9 rounded-xl text-lg font-medium border'}
              ${taskCategory === category
                ? isMobileView
                  ? `${PRIMARY_YELLOW} border-2 border-[${PRIMARY_BLUE}] text-black font-semibold`
                  : `${PRIMARY_YELLOW} border-2 border-[${PRIMARY_BLUE}] text-black font-semibold`
                : isMobileView
                  ? 'bg-gray-100 text-gray-600'
                  : 'bg-gray-50 text-gray-600 border-gray-200'}
            `}
            style={taskCategory === category ? {
              backgroundColor: PRIMARY_YELLOW,
              borderWidth: '2px',
              borderColor: PRIMARY_BLUE,
              color: '#000',
              fontWeight: '600'
            } : {}}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Task Title */}
      <div className={isMobileView ? 'mb-6' : 'mb-10'}>
        <label className={`${isMobileView ? 'text-sm' : 'text-lg'} font-semibold text-black mb-2 block`}>
          Task Title*
        </label>
        <input
          type="text"
          value={taskTitle}
          onChange={(e) => setTaskTitle(e.target.value)}
          placeholder="e.g., Replace a kitchen tap"
          className={`
            ${isMobileView 
              ? 'w-full py-3.5 px-3 rounded-lg text-base min-h-[45px]' 
              : 'w-full max-w-[600px] py-4 px-5 rounded-lg text-base min-h-[50px] border'}
            bg-gray-50 text-black
          `}
          style={!isMobileView ? { borderWidth: '1px', borderColor: '#e9ecef' } : {}}
        />
      </div>

      {/* Task Description */}
      <div className={isMobileView ? 'mb-6' : 'mb-10'}>
        <label className={`${isMobileView ? 'text-sm' : 'text-lg'} font-semibold text-black mb-2 block`}>
          Task Description*
        </label>
        <textarea
          value={taskDescription}
          onChange={(e) => setTaskDescription(e.target.value)}
          placeholder="Describe your task in detail..."
          rows={6}
          className={`
            ${isMobileView 
              ? 'w-full py-3.5 px-3 rounded-lg text-base min-h-[80px]' 
              : 'w-full max-w-[600px] py-4 px-5 rounded-lg text-base min-h-[100px] border'}
            bg-gray-50 text-black
          `}
          style={!isMobileView ? { borderWidth: '1px', borderColor: '#e9ecef' } : {}}
        />
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className={isMobileView ? 'mb-6' : 'mb-10'}>
      <h2 className={`${isMobileView ? 'text-lg font-semibold mb-4' : 'text-2xl font-bold mb-8'} text-black`}>
        Location & Timing
      </h2>

      {/* Location */}
      <div className={isMobileView ? 'mb-6' : 'mb-10'}>
        <label className={`${isMobileView ? 'text-sm' : 'text-lg'} font-semibold text-black mb-2 block`}>
          📍 Location*
        </label>
        <textarea
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="Enter your address or location"
          rows={3}
          className={`
            ${isMobileView 
              ? 'w-full py-3.5 px-3 rounded-lg text-base min-h-[80px]' 
              : 'w-full max-w-[600px] py-4 px-5 rounded-lg text-base min-h-[100px] border'}
            bg-gray-50 text-black
          `}
          style={!isMobileView ? { borderWidth: '1px', borderColor: '#e9ecef' } : {}}
        />
      </div>

      {/* Due Date */}
      <div className={isMobileView ? 'mb-6' : 'mb-10'}>
        <label className={`${isMobileView ? 'text-sm' : 'text-lg'} font-semibold text-black mb-2 block`}>
          📅 Due Date
        </label>
        <input
          type="text"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          placeholder="e.g., Before Wed, 23 Jul"
          className={`
            ${isMobileView 
              ? 'w-full py-3.5 px-3 rounded-lg text-base min-h-[45px]' 
              : 'w-full max-w-[600px] py-4 px-5 rounded-lg text-base min-h-[50px] border'}
            bg-gray-50 text-black
          `}
          style={!isMobileView ? { borderWidth: '1px', borderColor: '#e9ecef' } : {}}
        />
      </div>

      {/* Preferred Time */}
      <div className={isMobileView ? 'mb-6' : 'mb-10'}>
        <label className={`${isMobileView ? 'text-sm' : 'text-lg'} font-semibold text-black mb-2 block`}>
          ⏰ Preferred Time
        </label>
        <input
          type="text"
          value={dueTime}
          onChange={(e) => setDueTime(e.target.value)}
          placeholder="e.g., Anytime, Morning, Afternoon"
          className={`
            ${isMobileView 
              ? 'w-full py-3.5 px-3 rounded-lg text-base min-h-[45px]' 
              : 'w-full max-w-[600px] py-4 px-5 rounded-lg text-base min-h-[50px] border'}
            bg-gray-50 text-black
          `}
          style={!isMobileView ? { borderWidth: '1px', borderColor: '#e9ecef' } : {}}
        />
      </div>

      {/* Image Upload */}
      <div className={isMobileView ? 'mb-6' : 'mb-10'}>
        <label className={`${isMobileView ? 'text-sm' : 'text-lg'} font-semibold text-black mb-2 block`}>
          📸 Add Photos (Optional)
        </label>
        <button
          onClick={handleImageUpload}
          className={`
            ${isMobileView 
              ? 'w-full py-4 px-5 rounded-lg text-base border-2 border-dashed' 
              : 'w-full max-w-[600px] py-6 px-7 rounded-xl text-lg border-2 border-dashed'}
            bg-gray-50 border-gray-300 text-gray-600
          `}
        >
          📷 Upload Images
        </button>
        {selectedImages.length > 0 && (
          <p className={`${isMobileView ? 'text-sm mt-2' : 'text-base mt-3'}`} style={{ color: PRIMARY_BLUE }}>
            {selectedImages.length} image(s) selected
          </p>
        )}
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className={isMobileView ? 'mb-6' : 'mb-10'}>
      <h2 className={`${isMobileView ? 'text-lg font-semibold mb-4' : 'text-2xl font-bold mb-8'} text-black`}>
        Set Your Budget
      </h2>

      {/* Budget Card */}
      <div 
        className={`
          ${isMobileView ? 'p-5 rounded-xl mb-5' : 'p-12 rounded-2xl mb-10 border shadow-sm'}
          bg-gray-50
        `}
        style={!isMobileView ? { borderWidth: '1px', borderColor: '#e9ecef' } : {}}
      >
        <label className={`${isMobileView ? 'text-xs mb-2.5' : 'text-base mb-5'} font-semibold text-gray-600 block`}>
          TASK BUDGET
        </label>
        <div className="flex items-center">
          <span 
            className={`${isMobileView ? 'text-2xl mr-2' : 'text-4xl mr-4'} font-bold`}
            style={{ color: PRIMARY_BLUE }}
          >
            ₹
          </span>
          <input
            type="number"
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
            placeholder="110"
            className={`
              ${isMobileView ? 'text-2xl' : 'text-4xl'}
              font-bold flex-1 bg-transparent
            `}
            style={{ color: PRIMARY_BLUE }}
          />
        </div>
      </div>

      {/* Additional Notes */}
      <div className={isMobileView ? 'mb-6' : 'mb-10'}>
        <label className={`${isMobileView ? 'text-sm' : 'text-lg'} font-semibold text-black mb-2 block`}>
          Additional Notes
        </label>
        <textarea
          value={additionalNotes}
          onChange={(e) => setAdditionalNotes(e.target.value)}
          placeholder="Any additional requirements or special instructions..."
          rows={4}
          className={`
            ${isMobileView 
              ? 'w-full py-3.5 px-3 rounded-lg text-base min-h-[80px]' 
              : 'w-full max-w-[600px] py-4 px-5 rounded-lg text-base min-h-[100px] border'}
            bg-gray-50 text-black
          `}
          style={!isMobileView ? { borderWidth: '1px', borderColor: '#e9ecef' } : {}}
        />
      </div>
    </div>
  );

  // Mobile layout
  if (isMobileView) {
    return (
      <div className="flex flex-col min-h-screen bg-white">
        {/* Header */}
        <div className="px-5 pt-12 pb-5 border-b border-gray-200">
          <button 
            onClick={handleBack}
            className="w-10 h-10 flex items-center justify-center mb-2.5"
          >
            <span className="text-xl text-black">←</span>
          </button>
          
          <h1 className="text-2xl font-bold text-black text-center mb-4">
            Create Task
          </h1>
          
          {/* Progress Dots */}
          <div className="flex justify-center gap-2">
            {[1, 2, 3].map((step) => (
              <div
                key={step}
                className={`w-2 h-2 rounded-full ${
                  step === currentStep ? 'bg-blue-500' : 'bg-gray-300'
                }`}
                style={step === currentStep ? { backgroundColor: PRIMARY_BLUE } : {}}
              />
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-y-auto px-5 py-5">
          {currentStep === 1 && renderStep1()}
          {currentStep === 2 && renderStep2()}
          {currentStep === 3 && renderStep3()}
        </div>

        {/* Bottom Action Button */}
        <div className="p-5 border-t border-gray-200">
          <button
            onClick={handleNext}
            disabled={isSubmitting}
            className={`
              w-full py-4 px-8 rounded-lg text-base font-semibold text-black
              ${isSubmitting ? 'opacity-70' : ''}
            `}
            style={{ backgroundColor: PRIMARY_YELLOW }}
          >
            {isSubmitting ? 'Creating Task...' : (currentStep === 3 ? 'Post Task' : 'Next')}
          </button>
        </div>
      </div>
    );
  }

  // Desktop layout
  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Header */}
      <div className="px-16 pt-8 pb-10 border-b border-gray-200 bg-gray-50">
        <button 
          onClick={handleBack}
          className="w-10 h-10 flex items-center justify-center mb-4"
        >
          <span className="text-xl text-black">←</span>
        </button>
        
        <h1 className="text-3xl font-bold text-black text-center mb-6">
          Create Task
        </h1>
        
        {/* Progress Dots */}
        <div className="flex justify-center gap-3">
          {[1, 2, 3].map((step) => (
            <div
              key={step}
              className={`w-2.5 h-2.5 rounded-full ${
                step === currentStep ? 'bg-blue-500' : 'bg-gray-300'
              }`}
              style={step === currentStep ? { backgroundColor: PRIMARY_BLUE } : {}}
            />
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-[800px] mx-auto px-20 py-20">
          {currentStep === 1 && renderStep1()}
          {currentStep === 2 && renderStep2()}
          {currentStep === 3 && renderStep3()}
        </div>
      </div>

      {/* Bottom Action Button */}
      <div className="p-10 border-t border-gray-200">
        <button
          onClick={handleNext}
          disabled={isSubmitting}
          className={`
            max-w-[280px] mx-auto block py-6 px-16 rounded-xl text-xl font-semibold text-black shadow-sm
            ${isSubmitting ? 'opacity-70' : ''}
          `}
          style={{ backgroundColor: PRIMARY_YELLOW }}
        >
          {isSubmitting ? 'Creating Task...' : (currentStep === 3 ? 'Post Task' : 'Next')}
        </button>
      </div>
    </div>
  );
}
