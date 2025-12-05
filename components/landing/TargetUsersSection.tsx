'use client';

/**
 * Target Users Section component
 * Shows scrolling task types and how the platform works
 */

import React, { useRef } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/design/utils';

const taskTypes = [
  { title: 'Marketing', description: 'Help with website', image: '/assets/mobilescreens/work.png' },
  { title: 'Painting', description: 'Wall mount art and paintings', image: '/assets/mobilescreens/painting.png' },
  { title: 'Movers', description: 'Packing, wrapping, moving', image: '/assets/mobilescreens/moving.png' },
  { title: 'Cleaning', description: 'Clean, mop and tidy', image: '/assets/mobilescreens/cleaning.png' },
  { title: 'Furniture', description: 'Flatpack assembly and disassembly', image: '/assets/mobilescreens/furniture.png' },
  { title: 'Deliveries', description: 'Urgent deliveries and couriers', image: '/assets/mobilescreens/delivery.png' },
  { title: 'Gardening', description: 'Mulching, weeding and tidying up', image: '/assets/mobilescreens/garden.png' },
  { title: 'Handyperson', description: 'Help with home maintenance', image: '/assets/mobilescreens/handy.png' },
  { title: 'Business', description: 'Help with accounting and tax', image: '/assets/mobilescreens/business.png' },
];

const ScrollingGrid: React.FC<{ height: number; isMobile: boolean }> = ({ height, isMobile }) => {
  const fullList = [...taskTypes, ...taskTypes]; // duplicate for seamless looping

  return (
    <div className="relative overflow-hidden w-full" style={{ height }}>
      <div
        className="scrolling-inner"
        style={{
          position: 'absolute',
          width: '100%',
          animation: 'scroll-up 18s linear infinite',
        }}
      >
        <div className={cn(
          'grid auto-rows-min items-start',
          isMobile ? 'grid-cols-1 gap-3' : 'grid-cols-2 gap-10'
        )}>
          {fullList.map((task, idx) => (
            <div
              key={idx}
              className={cn(
                'flex items-start gap-4 bg-white rounded-xl p-4 shadow-md min-h-[90px] border border-blue-50 mb-1.5 transition-shadow',
                isMobile && 'min-h-[70px] gap-2.5 p-2.5 rounded-lg'
              )}
            >
              <img
                src={task.image}
                alt={task.title}
                className={cn(
                  'object-cover bg-neutral-gray-100 rounded-lg flex-shrink-0 border border-blue-50',
                  isMobile ? 'w-12 h-12 rounded-lg' : 'w-25 h-25 rounded-lg'
                )}
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
              <div className="flex flex-col overflow-hidden flex-1">
                <div className={cn(
                  'font-bold text-blue-900 leading-tight mb-0.5 font-sans break-words',
                  isMobile ? 'text-xs' : 'text-base'
                )}>
                  {task.title}
                </div>
                <div className={cn(
                  'text-secondary-700 leading-snug font-sans break-words',
                  isMobile ? 'text-[11px]' : 'text-sm'
                )}>
                  {task.description}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <style jsx>{`
        @keyframes scroll-up {
          0% { transform: translateY(0); }
          100% { transform: translateY(-50%); }
        }
        .scrolling-inner::-webkit-scrollbar { display: none; }
      `}</style>
    </div>
  );
};

export const TargetUsersSection: React.FC = () => {
  const gridHeight = 420;

  return (
    <section className="bg-orange-50 px-6 md:px-20 lg:px-24 min-h-[600px] py-10">
      <div className="max-w-[1400px] mx-auto flex flex-col md:flex-row items-center justify-center gap-0 min-h-[600px]">
        {/* Left Column */}
        <div className="flex-1 min-w-0 md:min-w-[420px] md:max-w-[520px] flex flex-col justify-center h-auto md:h-[420px] mt-0">
          <h2 className="text-3xl md:text-4xl font-extrabold text-blue-900 mb-8 leading-tight font-sans">
            Post Any Task.<br />Perform What You Love.
          </h2>
          <ol className="list-none pl-0 mb-10">
            {[
              'Post any kind of task big or small, in any domain.',
              'Set your requirements and budget.',
              'Performers pick tasks that match their skills and capabilities.',
            ].map((step, idx) => (
              <li key={idx} className="flex items-start gap-4 mb-4">
                <span className="w-10 h-10 flex items-center justify-center rounded-full bg-blue-100 text-blue-700 font-bold text-xl font-sans flex-shrink-0">
                  {idx + 1}
                </span>
                <span className="text-lg md:text-xl text-blue-900 font-medium font-sans leading-relaxed break-words">
                  {step}
                </span>
              </li>
            ))}
          </ol>
          <Link href="/tasks/new">
            <Button
              variant="primary"
              className="bg-blue-700 text-white font-bold text-xl py-3.5 w-full md:w-[210px] rounded-lg shadow-lg shadow-blue-700/20 hover:bg-blue-800 transition-all"
            >
              Post your task
            </Button>
          </Link>
        </div>
        
        {/* Right Column: Animated Grid */}
        <div className="flex-1.2 flex justify-center items-start w-full h-[420px] hidden md:flex">
          <ScrollingGrid height={gridHeight} isMobile={false} />
        </div>
        
        {/* Mobile Grid - Hidden on desktop */}
        <div className="block md:hidden w-full h-[300px] overflow-hidden mt-0">
          <ScrollingGrid height={300} isMobile={true} />
        </div>
      </div>
    </section>
  );
};

