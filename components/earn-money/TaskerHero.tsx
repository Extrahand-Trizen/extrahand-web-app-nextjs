import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Clock, Star, Users } from "lucide-react";

export function TaskerHero() {
   return (
      <section className="relative py-12 md:py-20 bg-white overflow-hidden">
         {/* Subtle background tint */}
         <div className="absolute inset-0 pointer-events-none">
            <div className="absolute -top-24 right-0 w-80 h-80 bg-primary-100/40 rounded-full blur-3xl" />
            <div className="absolute -bottom-32 -left-10 w-96 h-96 bg-secondary-100/30 rounded-full blur-3xl" />
         </div>

         <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-secondary-900 leading-tight">
               Earn by helping people in your city
            </h1>

            <p className="mt-5 text-sm md:text-lg text-secondary-600 mb-5 font-medium">
               ExtraHand connects you with people who need help with everyday
               tasks. Choose the kind of work you want to do and decide when you
               are available.
            </p>

            {/* Stats strip */}
            <div className="mt-8 md:mt-12 w-[80%] mx-auto flex flex-col sm:flex-row gap-5 md:gap-8">
               <div className="flex items-start gap-3">
                  <div className="size-8 md:size-11 rounded-lg bg-secondary-100 flex items-center justify-center">
                     <Users className="size-4 md:size-5 text-secondary-700" />
                  </div>
                  <div className="text-left">
                     <p className="md:text-lg font-semibold text-secondary-900">
                        10K+
                     </p>
                     <p className="text-[10px] md:text-xs text-secondary-600">
                        Customers using ExtraHand
                     </p>
                  </div>
               </div>

               <div className="flex items-center gap-3">
                  <div className="size-8 md:size-11 rounded-lg bg-primary-100 flex items-center justify-center">
                     <Clock className="size-4 md:size-5 text-primary-700" />
                  </div>
                  <div className="text-left">
                     <p className="md:text-lg font-semibold text-secondary-900">
                        Flexible
                     </p>
                     <p className="text-[10px] md:text-xs text-secondary-600">
                        You choose when to work
                     </p>
                  </div>
               </div>

               <div className="flex items-center gap-3">
                  <div className="size-8 md:size-11 rounded-lg bg-yellow-100 flex items-center justify-center">
                     <Star className="size-4 md:size-5 text-yellow-600" />
                  </div>
                  <div className="text-left">
                     <p className="md:text-lg font-semibold text-secondary-900">
                        4.8 / 5
                     </p>
                     <p className="text-[10px] md:text-xs text-secondary-600">
                        Average tasker rating
                     </p>
                  </div>
               </div>
            </div>

            {/* CTAs */}
            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center items-center">
               <Button
                  size="lg"
                  asChild
                  className="px-8 py-5 text-base bg-primary-500 hover:bg-primary-600 text-secondary-900 font-semibold shadow-sm hover:shadow-md transition-shadow"
               >
                  <Link href="/login">
                     Become a Tasker
                     <ArrowRight className="ml-2 w-5 h-5" />
                  </Link>
               </Button>

               <Button
                  size="lg"
                  variant="outline"
                  asChild
                  className="px-8 py-5 text-base border-secondary-300 text-secondary-800 hover:bg-secondary-50"
               >
                  <Link href="#how-it-works">How it works</Link>
               </Button>
            </div>
         </div>
      </section>
   );
}
