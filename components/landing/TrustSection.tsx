/**
 * Trust & Safety Section - Build confidence
 * 
 * Design principles:
 * - Visual trust badges
 * - Clear safety features
 * - No fluff, concrete benefits
 */

"use client";


import { 
  Shield, 
  BadgeCheck, 
  Lock, 
  MessageCircle, 
  Camera, 
  CreditCard,
  Star,
  Clock
} from "lucide-react";
import { cn } from "@/lib/utils";

const trustFeatures = [
  {
    icon: BadgeCheck,
    title: "Verified Taskers",
    description: "Every tasker is background-checked and ID verified before joining our platform.",
    color: "text-blue-600",
    bgColor: "bg-blue-50",
  },
  {
    icon: Lock,
    title: "Secure Payments",
    description: "Your payment is held securely and only released when you confirm the task is complete.",
    color: "text-green-600",
    bgColor: "bg-green-50",
  },
  {
    icon: Star,
    title: "Genuine Reviews",
    description: "All reviews come from verified completed tasks. No fake ratings, ever.",
    color: "text-yellow-600",
    bgColor: "bg-yellow-50",
  },
  {
    icon: MessageCircle,
    title: "In-App Messaging",
    description: "Communicate safely within the app. Your personal contact info stays private.",
    color: "text-purple-600",
    bgColor: "bg-purple-50",
  },
  {
    icon: Camera,
    title: "Proof of Work",
    description: "Taskers provide photos and updates so you can verify work quality remotely.",
    color: "text-orange-600",
    bgColor: "bg-orange-50",
  },
  {
    icon: Shield,
    title: "Task Protection",
    description: "If something goes wrong, our support team helps resolve issues quickly.",
    color: "text-red-600",
    bgColor: "bg-red-50",
  },
];

interface TrustCardProps {
  feature: typeof trustFeatures[0];
}

const TrustCard: React.FC<TrustCardProps> = ({ feature }) => (
  <div className="flex items-start gap-4 p-5 rounded-xl bg-white border border-secondary-100 hover:border-secondary-200 hover:shadow-md transition-all">
    <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center shrink-0", feature.bgColor)}>
      <feature.icon className={cn("w-6 h-6", feature.color)} />
    </div>
    <div>
      <h3 className="font-bold text-secondary-900 text-lg mb-1">{feature.title}</h3>
      <p className="text-secondary-600 text-sm leading-relaxed">{feature.description}</p>
    </div>
  </div>
);

export const TrustSection: React.FC = () => {
  return (
    <section id="trust" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-green-50 text-green-700 px-4 py-1.5 rounded-full text-sm font-medium mb-4">
            <Shield className="w-4 h-4" />
            Your safety is our priority
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-secondary-900 mb-4">
            Trust & Safety Built In
          </h2>
          <p className="text-lg text-secondary-600 max-w-2xl mx-auto">
            We've built multiple layers of protection so you can get things done with complete peace of mind.
          </p>
        </div>

        {/* Features grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {trustFeatures.map((feature, idx) => (
            <TrustCard key={idx} feature={feature} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrustSection;
