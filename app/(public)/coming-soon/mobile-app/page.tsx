"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowRight, CheckCircle2, Sparkles, Smartphone } from "lucide-react";

export default function MobileAppComingSoonPage() {
  const [submitted, setSubmitted] = useState(false);
  const [contactInfo, setContactInfo] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (contactInfo.trim()) {
      // In a real app, send to API here to collect the lead
      setSubmitted(true);
    }
  };

  return (
    <div className="relative min-h-[85vh] flex flex-col items-center justify-center px-4 py-16 overflow-hidden bg-white">
      {/* Abstract Background Effects */}
      <div className="absolute top-0 inset-x-0 h-[500px] bg-gradient-to-b from-primary-50/80 to-transparent pointer-events-none" />
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-primary-200/40 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-20 -left-20 w-72 h-72 bg-secondary-200/30 rounded-full blur-3xl pointer-events-none" />
      
      <div className="relative z-10 w-full max-w-md mx-auto">
        {/* Brand Logo */}
        <div className="flex justify-center mb-6">
          <div className="relative flex items-center justify-center size-14 shrink-0 drop-shadow-md z-10">
            <div className="absolute w-[75%] h-[75%] bg-white rounded-full z-0"></div>
            <Image
              src="/assets/images/logo.webp"
              alt="ExtraHand logo"
              width={56}
              height={56}
              className="relative z-10 size-14"
              unoptimized
            />
          </div>
        </div>

        {/* Dynamic Card */}
        <div className="bg-white/70 backdrop-blur-xl rounded-[1.5rem] shadow-2xl shadow-secondary-900/10 border border-white p-6 sm:p-8 text-center relative overflow-hidden">
          
          {/* Internal Glow */}
          <div className="absolute -inset-0.5 bg-gradient-to-br from-primary-400 to-secondary-500 opacity-10 blur-xl z-0" />

          <div className="relative z-10">
            {!submitted ? (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary-100 text-primary-700 text-[10px] sm:text-xs font-bold uppercase tracking-wider mb-5">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Next Big Update</span>
                </div>
                
                <h1 className="text-2xl sm:text-3xl font-extrabold text-secondary-900 mb-2 tracking-tight">
                  Mobile App Coming Soon
                </h1>
                
                <p className="text-secondary-600 mb-6 text-sm sm:text-base leading-relaxed">
                  We're building the ultimate mobile experience. Drop your email or phone number to get early access and exclusive launch perks!
                </p>
                
                <form onSubmit={handleSubmit} className="space-y-3">
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-3.5 flex items-center pointer-events-none text-secondary-400">
                      <Smartphone className="w-4.5 h-4.5 group-focus-within:text-primary-500 transition-colors" />
                    </div>
                    <Input
                      type="text"
                      placeholder="Email or phone number"
                      className="w-full pl-10 pr-4 py-4 bg-white/80 border-secondary-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 rounded-xl text-sm shadow-sm transition-all"
                      value={contactInfo}
                      onChange={(e) => setContactInfo(e.target.value)}
                      required
                    />
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full bg-primary-500 hover:bg-primary-600 text-secondary-900 font-bold text-base py-4 h-auto rounded-xl shadow-md shadow-primary-500/20 transition-all active:scale-[0.98]"
                  >
                    Notify Me First
                  </Button>
                </form>
              </div>
            ) : (
              <div className="py-6 animate-in zoom-in-95 duration-500">
                <div className="w-16 h-16 mx-auto rounded-full bg-green-100/80 border-[3px] border-green-50 flex items-center justify-center mb-5 shadow-lg shadow-green-100/50">
                  <CheckCircle2 className="w-8 h-8 text-green-600" />
                </div>
                <h2 className="text-xl sm:text-2xl font-extrabold text-secondary-900 mb-2 tracking-tight">
                  You're on the list!
                </h2>
                <p className="text-secondary-600 mb-1.5 text-sm sm:text-base">
                  Awesome! We've saved your spot.
                </p>
                <p className="text-secondary-500 text-xs sm:text-sm">
                  We'll send you an alert the minute our app hits the stores.
                </p>
              </div>
            )}
            
            <div className="mt-6 pt-5 border-t border-secondary-100/50">
              <Link href="/">
                <Button variant="ghost" className="w-full text-secondary-600 hover:text-secondary-900 hover:bg-secondary-50 rounded-xl h-12 text-sm font-semibold group transition-all">
                  Continue Browsing Website
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
