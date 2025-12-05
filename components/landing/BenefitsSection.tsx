'use client';

/**
 * Benefits Section component
 * Shows why users should choose ExtraHand
 */

import React from 'react';
import { Card } from '@/components/ui/Card';
import { cn } from '@/lib/design/utils';

const benefits = [
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/>
        <polyline points="12,6 12,12 16,14"/>
      </svg>
    ),
    title: 'Save Time & Costs',
    description: 'No more expensive trips or wasted time. Get things done without leaving your location.',
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
      </svg>
    ),
    title: 'Trustworthy & Verified',
    description: 'All task performers are background-checked and verified with real reviews from users.',
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
      </svg>
    ),
    title: 'Tech & Non-Tech Tasks',
    description: 'From router setup to grocery pickup, our network handles any type of task you need.',
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
        <circle cx="12" cy="10" r="3"/>
      </svg>
    ),
    title: 'GPS-Based Matching',
    description: 'Smart location-based matching ensures you get the fastest and most reliable service.',
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
        <circle cx="9" cy="7" r="4"/>
      </svg>
    ),
    title: 'Dual-Role Platform',
    description: 'Post tasks when you need help, or earn money by completing tasks in your area.',
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
        <polyline points="22 4 12 14.01 9 11"/>
      </svg>
    ),
    title: 'High Success Rate',
    description: 'Thousands of tasks completed with a 98%+ satisfaction rate.',
  },
];

export const BenefitsSection: React.FC = () => {
  return (
    <section id="benefits" className="py-16 md:py-20 bg-white">
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-[40px] font-bold text-secondary-900 mb-4 font-sans">
            Why Choose <span className="text-primary-500">Extrahand</span>?
          </h2>
          <p className="text-xl text-secondary-500/80 max-w-[700px] mx-auto font-sans">
            We've built the most reliable platform for remote task delegation, designed with trust, efficiency, and user experience at its core.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-[1100px] mx-auto">
          {benefits.map((feature, idx) => (
            <Card
              key={idx}
              padding="lg"
              shadow="md"
              className="border border-neutral-gray-200 transition-all duration-200 cursor-pointer hover:shadow-lg hover:-translate-y-1 hover:scale-[1.03] hover:shadow-primary-500/25"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-900">
                  {feature.icon}
                </div>
                <h3 className="text-2xl font-extrabold text-secondary-900 font-sans">{feature.title}</h3>
              </div>
              <p className="text-base text-secondary-700 font-sans leading-relaxed">{feature.description}</p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

