"use client";

import React from "react";

export default function PosterWhatIsExtrahandSection() {
   return (
      <section className="py-16 md:py-24 bg-white">
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-8 sm:mb-12">
               What is Extrahand?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
               <div className="bg-amber-400 rounded-2xl p-6 sm:p-8 text-gray-900 shadow-lg">
                  <div className="text-3xl sm:text-4xl font-bold mb-3">1</div>
                  <h3 className="text-xl font-bold mb-2">Post your task</h3>
                  <p className="text-gray-800 text-sm sm:text-base">
                     Describe what you need and set your budget. It only takes a few
                     minutes to post.
                  </p>
               </div>
               <div className="bg-white rounded-2xl p-6 sm:p-8 text-gray-900 border-2 border-gray-200 shadow-lg">
                  <div className="text-3xl sm:text-4xl font-bold mb-3">2</div>
                  <h3 className="text-xl font-bold mb-2">Review offers</h3>
                  <p className="text-gray-700 text-sm sm:text-base">
                     Skilled professionals will send you offers. Compare profiles,
                     ratings and prices to pick the best fit.
                  </p>
               </div>
               <div className="bg-gray-900 rounded-2xl p-6 sm:p-8 text-white shadow-lg">
                  <div className="text-3xl sm:text-4xl font-bold mb-3">3</div>
                  <h3 className="text-xl font-bold mb-2">Get it done</h3>
                  <p className="text-gray-300 text-sm sm:text-base">
                     Once you choose, your task gets done. Pay securely through
                     Extrahand when you are happy with the result.
                  </p>
               </div>
            </div>
         </div>
      </section>
   );
}
