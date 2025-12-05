'use client';

/**
 * Trust & Safety Section component
 * Shows security features and trust elements
 */

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

const trustFeatures = [
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/>
      </svg>
    ),
    title: 'Verified Performers',
    description: 'All task performers undergo background checks and identity verification.',
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
      </svg>
    ),
    title: 'Review System',
    description: 'Transparent ratings and reviews from real users help you choose the right person.',
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect width="18" height="11" x="3" y="11" rx="2" ry="2"/>
        <circle cx="12" cy="16" r="1"/>
        <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
      </svg>
    ),
    title: 'Secure Payments',
    description: 'Your money is protected with escrow payments released only after task completion.',
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
      </svg>
    ),
    title: 'Real-time Communication',
    description: 'Stay connected with live chat, live location sharing, and instant updates.',
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/>
        <circle cx="12" cy="13" r="3"/>
      </svg>
    ),
    title: 'Proof of Work',
    description: 'Every completed task comes with visual proof of photos or videos, shared directly in the app. This helps you verify the quality and completion of work even when you\'re away, ensuring full transparency, accountability, and peace of mind.',
  },
];

export const TrustSafetySection: React.FC = () => {
  return (
    <section className="py-10 md:py-16 lg:py-20 bg-gradient-to-br from-blue-50 to-orange-50">
      <div className="max-w-[1200px] mx-auto px-4 md:px-6">
        {/* Header */}
        <div className="text-center mb-8 md:mb-12">
          <h2 className="text-3xl md:text-4xl lg:text-[44px] font-extrabold text-secondary-900 mb-3 md:mb-4 font-sans leading-tight">
            Your Security is Our <span className="text-primary-500">Priority</span>
          </h2>
          <p className="text-base md:text-lg lg:text-xl text-secondary-500/80 max-w-[700px] mx-auto font-sans leading-relaxed">
            We've built multiple layers of protection to ensure every task is completed safely and securely.
          </p>
        </div>
        
        {/* Trust features grid */}
        <div className="mb-10 md:mb-15">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-8 max-w-[900px] mx-auto">
            {trustFeatures.slice(0, 4).map((feature, idx) => (
              <Card
                key={idx}
                padding="lg"
                shadow="md"
                className="flex flex-row items-start gap-4 md:gap-6 bg-blue-50 border border-neutral-gray-100 min-h-[100px] transition-all duration-200 cursor-pointer hover:shadow-lg hover:-translate-y-1 hover:scale-[1.03] hover:shadow-primary-500/25"
              >
                <div className="w-12 h-12 md:w-16 md:h-16 rounded-2xl bg-primary-500/10 text-primary-500 flex items-center justify-center flex-shrink-0">
                  {feature.icon}
                </div>
                <div className="text-left flex-1">
                  <h3 className="text-lg md:text-xl lg:text-2xl font-extrabold text-secondary-900 mb-2 font-sans leading-tight">
                    {feature.title}
                  </h3>
                  <p className="text-sm md:text-base text-secondary-700 font-sans leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </Card>
            ))}
          </div>
          
          {/* 5th card full width below grid */}
          <div className="flex justify-center mt-6 md:mt-10">
            <Card
              padding="lg"
              shadow="md"
              className="flex flex-row items-start gap-4 md:gap-6 bg-blue-50 border border-neutral-gray-100 min-h-[180px] w-full max-w-[600px] mx-auto"
            >
              <div className="w-12 h-12 md:w-16 md:h-16 rounded-2xl bg-primary-500/10 text-primary-500 flex items-center justify-center flex-shrink-0">
                {trustFeatures[4].icon}
              </div>
              <div className="text-left flex-1">
                <h3 className="text-lg md:text-xl lg:text-2xl font-extrabold text-secondary-900 mb-2 font-sans leading-tight">
                  {trustFeatures[4].title}
                </h3>
                <p className="text-sm md:text-base text-secondary-700 font-sans leading-relaxed">
                  {trustFeatures[4].description}
                </p>
              </div>
            </Card>
          </div>
        </div>
        
        {/* CTA */}
        <div className="text-center px-4 md:px-6">
          <h3 className="text-xl md:text-2xl lg:text-3xl font-bold text-secondary-900 mb-4 font-sans leading-tight">
            Ready to Experience Secure Task Delegation?
          </h3>
          <p className="text-secondary-500/80 mb-6 max-w-[500px] mx-auto text-base md:text-lg font-sans leading-relaxed">
            Join thousands who trust Extrahand for their tasks. Your security and satisfaction are guaranteed.
          </p>
          <div className="flex flex-col items-center gap-3 md:gap-5 max-w-[500px] mx-auto">
            <Link href="/tasks/new">
              <Button
                variant="primary"
                size="lg"
                className="bg-primary-500 text-secondary-900 font-semibold text-base md:text-lg px-7 md:px-9 py-3.5 md:py-4 rounded-lg shadow-md shadow-primary-500/15 hover:bg-primary-600 transition-all w-full max-w-[300px]"
              >
                Start Your First Task
              </Button>
            </Link>
            <Button
              variant="outline"
              size="lg"
              className="border-2 border-primary-500 text-primary-500 font-semibold text-base md:text-lg px-7 md:px-9 py-3.5 md:py-4 rounded-lg bg-white hover:bg-primary-500 hover:text-secondary-900 transition-all w-full max-w-[300px]"
            >
              Learn More
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

