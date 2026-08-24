'use client';

import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import type { BlogFaq } from '@/lib/api/endpoints/blogs';

interface BlogFaqAccordionProps {
  faqs: BlogFaq[];
}

export default function BlogFaqAccordion({ faqs }: BlogFaqAccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  if (!faqs || faqs.length === 0) return null;

  return (
    <div className="divide-y divide-gray-200 border border-gray-200 rounded-2xl overflow-hidden bg-white shadow-xs">
      {faqs.map((faq, idx) => (
        <div key={idx} className="bg-white">
          <button
            type="button"
            onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
            className="w-full px-6 py-4 sm:py-5 text-left flex items-center justify-between gap-4 font-semibold text-sm sm:text-base text-gray-900 hover:bg-gray-50/80 transition"
          >
            <span>{faq.question}</span>
            <ChevronDown
              className={`w-5 h-5 text-gray-400 transition-transform duration-200 flex-shrink-0 ${
                openIndex === idx ? 'rotate-180 text-amber-600' : ''
              }`}
            />
          </button>
          {openIndex === idx && (
            <div className="px-6 pb-5 text-xs sm:text-sm text-gray-600 leading-relaxed border-t border-gray-50 pt-3 bg-gray-50/30">
              {faq.answer}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
