'use client';

/**
 * How It Works Section component
 * Shows the 3-step process
 */

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/design/utils';

const steps = [
  {
    title: 'Post a Task',
    highlight: 'Describe your task, location, and budget.',
    description: 'Set your requirements and timeline from anywhere. The more details, the better your match!',
    cta: 'Start your first task',
    image: '/assets/mobilescreens/post-task.jpg',
  },
  {
    title: 'Get Matched',
    highlight: 'Connect with trusted locals.',
    description: 'Our smart algorithm finds verified, skilled helpers nearby. Review profiles, ratings, and chat instantly.',
    cta: 'See how matching works',
    image: '/assets/mobilescreens/set-budget.jpg',
  },
  {
    title: 'Task Complete',
    highlight: 'Track and confirm completion.',
    description: 'Monitor progress in real-time and receive photo/video proof when your task is finished. Release payment securely.',
    cta: 'Learn about secure completion',
    image: '/assets/mobilescreens/approve-task.jpg',
  },
];

export const HowItWorksSection: React.FC = () => {
  return (
    <section id="how-it-works" className="py-20 bg-white relative overflow-x-hidden">
      <div className="max-w-[1200px] mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-[44px] font-bold text-secondary-900 mb-4 font-sans">How It Works</h2>
          <p className="text-xl text-secondary-500/80 max-w-[600px] mx-auto font-sans">
            Getting your tasks done remotely has never been easier. Follow these simple steps and watch the magic happen.
          </p>
        </div>
        
        {/* Steps */}
        <div className="flex flex-col md:flex-row flex-wrap justify-between gap-8">
          {steps.map((step, index) => (
            <div
              key={index}
              className="flex-1 min-w-[260px] max-w-[370px] flex flex-col items-center text-center p-2 bg-none mx-auto"
            >
              <div className="mb-6">
                <span className="inline-block bg-secondary-900 text-white font-bold rounded-full px-5 py-1.5 text-xl shadow-lg shadow-info-500/15">
                  {index + 1}
                </span>
              </div>
              <div className="mb-6 w-full flex justify-center">
                <img
                  src={step.image}
                  alt={step.title}
                  className="w-full max-w-[400px] h-auto rounded-2xl shadow-md"
                  onError={(e) => {
                    // Fallback placeholder
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
              </div>
              <h3 className="text-xl md:text-2xl font-extrabold text-secondary-900 mb-2.5 font-sans leading-tight">
                {step.title}
              </h3>
              <div className="text-lg font-bold text-primary-500 mb-2 font-sans">
                {step.highlight}
              </div>
              <p className="text-sm md:text-base text-secondary-700 mb-4 max-w-[320px] mx-auto font-sans">
                {step.description}
              </p>
            </div>
          ))}
        </div>
        
        {/* Centered Post your task Button */}
        <div className="flex justify-center mt-12">
          <Link href="/tasks/new">
            <Button
              variant="outline"
              className="text-lg px-5 py-2.5 text-secondary-900 bg-white border-2 border-accent-yellow rounded-lg font-semibold font-sans shadow-md shadow-primary-500/15 hover:bg-accent-yellow hover:text-secondary-900 transition-all hover:scale-105"
            >
              Post your task now
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

