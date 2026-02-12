"use client";

import React from "react";
import { useRouter } from "next/navigation";
import PosterHeroSection from "./PosterHeroSection";
import PosterBestRatedAndReviewsSection from "./PosterBestRatedAndReviewsSection";
import PosterWhatIsExtrahandSection from "./PosterWhatIsExtrahandSection";
import PosterWhyHireSection from "./PosterWhyHireSection";
import PosterTopQuestionsSection from "./PosterTopQuestionsSection";
import PosterThreeColumnSection from "./PosterThreeColumnSection";
import PosterWhatServicesIncludeSection from "./PosterWhatServicesIncludeSection";
import PosterRecentTasksSection from "./PosterRecentTasksSection";
import PosterFooter from "./PosterFooter";
import {
   DEFAULT_TOP_TASKERS,
   DEFAULT_REVIEWS,
   DEFAULT_WHY_BOOK_FEATURES,
   DEFAULT_QUESTIONS,
   DEFAULT_CATEGORY_SERVICES,
   DEFAULT_RELATED_SERVICES,
   DEFAULT_TOP_LOCATIONS,
   DEFAULT_RELATED_LOCATIONS,
   DEFAULT_WHAT_THEY_DO_SECTIONS,
   DEFAULT_STATIC_TASKS,
   DEFAULT_FOOTER,
} from "@/lib/posterCategoryDefaults";
import type { PosterCategoryDetail, PosterTopTasker, PosterReview, PosterWhyBookFeature, Question, PosterStaticTask } from "@/types/category";

interface PosterCategoryPageClientProps {
   category: PosterCategoryDetail;
}

function textToSlug(text: string): string {
   return text
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^\w-]/g, "");
}

export default function PosterCategoryPageClient({ category }: PosterCategoryPageClientProps) {
   const router = useRouter();

   const categoryName = category?.name || "Service";
   const serviceLabel = (categoryName || "").replace(/\s+Services?$/i, "") || "service";

   const topTaskers: PosterTopTasker[] =
      category?.topTaskers && category.topTaskers.filter((t) => t?.name).length > 0 ? category.topTaskers : DEFAULT_TOP_TASKERS;
   const reviews: PosterReview[] =
      category?.reviews && category.reviews.length > 0
         ? category.reviews
         : DEFAULT_REVIEWS;
   // Always show cost & rating sidebar (with category data or defaults)
   const showCostBlock = true;
   const whyBookTitle = category?.whyBookTitle || `Why hire a ${serviceLabel.toLowerCase()} near you through Extrahand?`;
   const whyBookDescription =
      category?.whyBookDescription ||
      "Get connected with skilled professionals in your area. Post your task, compare quotes, and choose the best fit. Extrahand makes it easy to get things done with verified experts and secure payments.";
   const whyBookFeatures: PosterWhyBookFeature[] =
      category?.whyBookFeatures && category.whyBookFeatures.length > 0 ? category.whyBookFeatures : DEFAULT_WHY_BOOK_FEATURES;
   const questions: Question[] = category?.questions && category.questions.length > 0 ? category.questions : DEFAULT_QUESTIONS;
   const categoryServicesList = category?.categoryServicesList?.length ? category.categoryServicesList : DEFAULT_CATEGORY_SERVICES;
   const relatedServicesNearMe = category?.relatedServicesNearMe?.length ? category.relatedServicesNearMe : DEFAULT_RELATED_SERVICES;
   const topLocationsList = category?.topLocationsList?.length ? category.topLocationsList : DEFAULT_TOP_LOCATIONS;
   const relatedLocations = category?.relatedLocations?.length ? category.relatedLocations : DEFAULT_RELATED_LOCATIONS;
   const whatTheyDoTitle = category?.whatTheyDoTitle || `What does ${serviceLabel.toLowerCase()} services include?`;
   const whatTheyDoSections =
      category?.whatTheyDoSections?.length ? category.whatTheyDoSections : DEFAULT_WHAT_THEY_DO_SECTIONS;
   const staticTasks: PosterStaticTask[] = category?.staticTasks?.length ? category.staticTasks : DEFAULT_STATIC_TASKS;
   const staticTasksSectionDescription = category?.staticTasksSectionDescription || "Check out what tasks people want done near you right now.";

   const handleHeadingClick = (headingText: string) => {
      const slug = textToSlug(headingText);
      router.push(`/services/${slug}`);
   };

   return (
      <div className="flex flex-col">
         <PosterHeroSection category={category} serviceLabel={serviceLabel} whyBookFeatures={whyBookFeatures} />

         <PosterBestRatedAndReviewsSection
            serviceLabel={serviceLabel}
            topTaskers={topTaskers}
            reviews={reviews}
            category={category}
            showCostBlock={showCostBlock}
         />

         <PosterWhatIsExtrahandSection />

         <PosterWhyHireSection
            whyBookTitle={whyBookTitle}
            whyBookDescription={whyBookDescription}
            whyBookFeatures={whyBookFeatures}
         />

         <PosterTopQuestionsSection
            serviceLabel={serviceLabel}
            questionsTitle={category?.questionsTitle}
            questions={questions}
         />

         <PosterThreeColumnSection
            serviceLabel={serviceLabel}
            categoryServicesList={categoryServicesList}
            relatedServicesNearMe={relatedServicesNearMe}
            topLocationsList={topLocationsList}
            relatedLocations={relatedLocations}
            onHeadingClick={handleHeadingClick}
         />

         <PosterWhatServicesIncludeSection
            serviceLabel={serviceLabel}
            whatTheyDoTitle={whatTheyDoTitle}
            whatTheyDoSections={whatTheyDoSections}
         />

         <PosterRecentTasksSection
            serviceLabel={serviceLabel}
            sectionTitle={`Recent ${serviceLabel} tasks`}
            sectionDescription={staticTasksSectionDescription}
            tasks={staticTasks}
         />

         {/* <PosterFooter footerData={category?.footer ?? DEFAULT_FOOTER} /> */}
      </div>
   );
}
