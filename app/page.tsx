'use client';

/**
 * Landing Page
 * Main landing page with all sections
 */

import React from 'react';
import { Header } from '@/components/layout/Header';
import { HeroSection } from '@/components/landing/HeroSection';
import { HowItWorksSection } from '@/components/landing/HowItWorksSection';
import { BenefitsSection } from '@/components/landing/BenefitsSection';
import { TargetUsersSection } from '@/components/landing/TargetUsersSection';
import { TrustSafetySection } from '@/components/landing/TrustSafetySection';
import { Footer } from '@/components/layout/Footer';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      <Header />
      <main className="overflow-x-hidden">
        <HeroSection />
        <HowItWorksSection />
        <BenefitsSection />
        <TargetUsersSection />
        <TrustSafetySection />
      </main>
      <Footer />
    </div>
  );
}
