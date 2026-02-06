"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { CategoryDetail } from "@/types/category";
import { EarningsCard } from "@/components/categories/EarningsCard";
import { WhyJoinSection } from "@/components/categories/WhyJoinSection";
import { TasksSection } from "@/components/categories/TasksSection";
import { HeroSection } from "@/components/categories/HeroSection";
import { EarningPotentialSection } from "@/components/categories/EarningPotentialSection";
import { IncomeOpportunitiesSection } from "@/components/categories/IncomeOpportunitiesSection";
import { HowToEarnSection } from "@/components/categories/HowToEarnSection";
import { TopTaskersSection } from "@/components/categories/TopTaskersSection";
import { InsuranceCoverSection } from "@/components/categories/InsuranceCoverSection";
import { QuestionsSection } from "@/components/categories/QuestionsSection";
import { WaysToEarnSection } from "@/components/categories/WaysToEarnSection";
import { ExploreOtherWaysSection } from "@/components/categories/ExploreOtherWaysSection";
import { TopLocationsSection } from "@/components/categories/TopLocationsSection";
import { BrowseSimilarTasksSection } from "@/components/categories/BrowseSimilarTasksSection";
import { Button } from "@/components/ui/button";
import {
   Dialog,
   DialogContent,
   DialogDescription,
   DialogFooter,
   DialogHeader,
   DialogTitle,
} from "@/components/ui/dialog";

interface CategoryDetailClientProps {
   category: CategoryDetail;
   breadcrumbCategory?: string;
   breadcrumbCategoryLink?: string;
}

const CategoryDetailClient: React.FC<CategoryDetailClientProps> = ({
   category,
   breadcrumbCategory,
   breadcrumbCategoryLink,
}) => {
   const router = useRouter();
   const [selectedTasks, setSelectedTasks] = useState("1-2 tasks per week");
   const [selectedPeriod, setSelectedPeriod] = useState<
      "weekly" | "monthly" | "yearly"
   >("weekly");
   const [selectedIncomePeriod, setSelectedIncomePeriod] = useState<
      "weekly" | "monthly" | "yearly"
   >("weekly");
   const [openAccordion, setOpenAccordion] = useState<number | null>(null);
   const [errorModal, setErrorModal] = useState({ show: false, message: "" });

   const toggleAccordion = (index: number) => {
      setOpenAccordion(openAccordion === index ? null : index);
   };

   const textToSlug = (text: string) => {
      return text
         .toLowerCase()
         .replace(/\s+/g, "-")
         .replace(/[^\w-]/g, "");
   };

   const handleHeadingClick = async (
      headingText: string,
      categorySlug?: string | null,
      subcategorySlug?: string | null
   ) => {
      console.log({
         headingText,
         categorySlug,
         subcategorySlug,
         currentCategorySlug: category?.slug,
      });

      const getBaseCategorySlug = (s?: string | null) =>
         s ? s.split("/").filter(Boolean)[0] : undefined;

      try {
         let categorySlugToCheck = categorySlug;
         let subcategorySlugToCheck = subcategorySlug;

         if (
            headingText.includes(" - ") ||
            headingText.includes(" / ") ||
            headingText.includes(" – ")
         ) {
            const parts = headingText
               .split(/[-\/–]/)
               .map((p) => p.trim())
               .filter((p) => p);
            if (parts.length >= 2) {
               categorySlugToCheck = textToSlug(parts[0]);
               subcategorySlugToCheck = textToSlug(parts[1]);
            }
         } else if (!categorySlugToCheck && !subcategorySlugToCheck) {
            // Try treating the heading as a category slug first
            categorySlugToCheck = textToSlug(headingText);

            let params = new URLSearchParams({
               categorySlug: categorySlugToCheck,
            });
            let response = await fetch(
               `/api/check-page-exists?${params.toString()}`
            );
            let data = await response.json();
            console.log(
               "check-page-exists (as category):",
               params.toString(),
               data
            );

            if (data.exists && data.url) {
               router.push(data.url);
               return;
            }

            // If not found as a category, try treating the heading as a subcategory under current page's base category
            const baseCategory = getBaseCategorySlug(category?.slug);
            if (baseCategory) {
               subcategorySlugToCheck = categorySlugToCheck; // heading slug becomes subcategory
               categorySlugToCheck = baseCategory; // ensure we only pass top-level category
            }
         }

         const params = new URLSearchParams({
            categorySlug:
               categorySlugToCheck || getBaseCategorySlug(category?.slug) || "",
         });
         if (subcategorySlugToCheck)
            params.append("subcategorySlug", subcategorySlugToCheck);

         const response = await fetch(
            `/api/check-page-exists?${params.toString()}`
         );
         const data = await response.json();
         console.log(
            "check-page-exists (category+maybe subcategory):",
            params.toString(),
            data
         );

         if (data.exists && data.url) {
            router.push(data.url);
            return;
         }

         // Final attempt: subcategory-only lookup across all categories using the heading's slug
         try {
            const subOnlyParams = new URLSearchParams({
               subcategorySlug: textToSlug(headingText),
            });
            const subOnlyResp = await fetch(
               `/api/check-page-exists?${subOnlyParams.toString()}`
            );
            const subOnlyData = await subOnlyResp.json();
            console.log(
               "check-page-exists (subcategory-only):",
               subOnlyParams.toString(),
               subOnlyData
            );

            if (subOnlyData.exists && subOnlyData.url) {
               router.push(subOnlyData.url);
               return;
            }
         } catch (err) {
            console.error("Error trying subcategory-only lookup:", err);
         }

         setErrorModal({
            show: true,
            message: `Page not available for "${headingText}". Please go back.`,
         });
      } catch (error) {
         console.error("Error checking page existence:", error);
         setErrorModal({
            show: true,
            message: `Error checking page for "${headingText}". Please go back.`,
         });
      }
   };

   const closeErrorModal = () => {
      setErrorModal({ show: false, message: "" });
   };

   // Handle location clicks - navigate to /locations/[city]
   const handleLocationClick = (locationName: string) => {
      const locationSlug = textToSlug(locationName);
      router.push(`/locations/${locationSlug}`);
   };

   // Handle category/subcategory clicks - uses existing handleHeadingClick
   const handleCategoryClick = (headingText: string) => {
      handleHeadingClick(headingText);
   };

   const earnings: Record<string, string> = {
      "1-2 tasks per week":
         category.earnings1to2 || category.earningsCard?.weekly?.["1-2"] || "",
      "3-5 tasks per week":
         category.earnings3to5 || category.earningsCard?.weekly?.["3-5"] || "",
      "5+ tasks per week":
         category.earnings5plus || category.earningsCard?.weekly?.["5+"] || "",
   };

   return (
      <>
         {/* Error Modal using shadcn Dialog */}
         <Dialog open={errorModal.show} onOpenChange={closeErrorModal}>
            <DialogContent>
               <DialogHeader>
                  <DialogTitle>Page Not Available</DialogTitle>
                  <DialogDescription>{errorModal.message}</DialogDescription>
               </DialogHeader>
               <DialogFooter>
                  <Button onClick={closeErrorModal} variant="secondary">
                     Go Back
                  </Button>
               </DialogFooter>
            </DialogContent>
         </Dialog>

         {/* Hero Section */}
         <HeroSection
            categoryName={category.name}
            heroImage={category.heroImage}
            heroTitle={category.heroTitle}
            heroDescription={category.heroDescription}
            breadcrumbCategory={breadcrumbCategory}
            breadcrumbCategoryLink={breadcrumbCategoryLink}
            rightCard={
               <EarningsCard
                  selectedTasks={selectedTasks}
                  setSelectedTasks={setSelectedTasks}
                  earnings={earnings}
                  location={category.location || "India"}
                  earningsPeriod={category.earningsPeriod || "per month"}
                  disclaimer={category.disclaimer}
               />
            }
         />

         {/* Why Join Extrahand Section */}
         {category.whyJoinTitle &&
            category.whyJoinFeatures &&
            category.whyJoinFeatures.length > 0 && (
               <WhyJoinSection
                  title={category.whyJoinTitle}
                  features={category.whyJoinFeatures}
                  buttonText={category.whyJoinButtonText || "Join Extrahand"}
               />
            )}

         {/* Static Tasks Section */}
         {category.staticTasks &&
            Array.isArray(category.staticTasks) &&
            category.staticTasks.length > 0 && (
               <TasksSection
                  title={
                     category.staticTasksSectionTitle ||
                     `${category.name} tasks in ${category.location || "India"}`
                  }
                  description={
                     category.staticTasksSectionDescription ||
                     "Check out what tasks people want done near you right now..."
                  }
                  tasks={category.staticTasks}
                  buttonText={
                     category.browseAllTasksButtonText || "Browse all tasks"
                  }
                  lastUpdatedText={category.lastUpdatedText}
               />
            )}

         {/* Tasks Section (Dynamic from DB) */}
         {category.tasks &&
            Array.isArray(category.tasks) &&
            category.tasks.length > 0 && (
               <TasksSection
                  title={`${category.name} tasks in ${
                     category.location || "India"
                  }`}
                  description="Check out what tasks people want done near you right now..."
                  tasks={category.tasks}
                  buttonText="Browse all tasks"
               />
            )}

         {/* Earning Potential Section */}
         {category.earningPotentialTitle && category.earningPotentialData && (
            <EarningPotentialSection
               title={category.earningPotentialTitle}
               description={category.earningPotentialDescription}
               data={category.earningPotentialData}
               disclaimer={category.earningPotentialDisclaimer}
               buttonText={category.earningPotentialButtonText}
               selectedPeriod={selectedPeriod}
               onPeriodChange={setSelectedPeriod}
            />
         )}

         {/* Income Opportunities Section */}
         {category.incomeOpportunitiesTitle &&
            category.incomeOpportunitiesData && (
               <IncomeOpportunitiesSection
                  title={category.incomeOpportunitiesTitle}
                  description={category.incomeOpportunitiesDescription}
                  categoryName={category.name}
                  data={category.incomeOpportunitiesData}
                  disclaimer={category.incomeOpportunitiesDisclaimer}
                  selectedPeriod={selectedIncomePeriod}
                  onPeriodChange={setSelectedIncomePeriod}
               />
            )}

         {/* How to Earn Money Section */}
         {category.howToEarnTitle &&
            category.howToEarnSteps &&
            category.howToEarnSteps.length > 0 && (
               <HowToEarnSection
                  title={category.howToEarnTitle}
                  steps={category.howToEarnSteps}
                  buttonText={category.howToEarnButtonText}
               />
            )}

         {/* Get Inspired: Top Taskers Section */}
         {category.getInspiredTitle &&
            category.topTaskers &&
            category.topTaskers.length > 0 && (
               <TopTaskersSection
                  title={category.getInspiredTitle}
                  taskers={category.topTaskers}
                  buttonText={category.getInspiredButtonText}
               />
            )}

         {/* We've Got You Covered Section */}
         {category.insuranceCoverTitle &&
            category.insuranceCoverFeatures &&
            category.insuranceCoverFeatures.length > 0 && (
               <InsuranceCoverSection
                  title={category.insuranceCoverTitle}
                  description={category.insuranceCoverDescription}
                  features={category.insuranceCoverFeatures}
                  buttonText={category.insuranceCoverButtonText}
               />
            )}

         {/* Questions Section (FAQ) */}
         {category.questionsTitle &&
            category.questions &&
            category.questions.length > 0 && (
               <QuestionsSection
                  title={category.questionsTitle}
                  questions={category.questions}
                  openAccordion={openAccordion}
                  onToggle={toggleAccordion}
               />
            )}

         {/* Ways to Earn Money Section */}
         {category.waysToEarnTitle &&
            category.waysToEarnContent &&
            category.waysToEarnContent.length > 0 && (
               <WaysToEarnSection
                  title={category.waysToEarnTitle}
                  content={category.waysToEarnContent}
               />
            )}

         {/* Explore Other Ways Section */}
         {category.exploreOtherWaysTitle &&
            category.exploreOtherWaysTasks &&
            category.exploreOtherWaysTasks.length > 0 && (
               <ExploreOtherWaysSection
                  title={category.exploreOtherWaysTitle}
                  tasks={category.exploreOtherWaysTasks}
                  buttonText={category.exploreOtherWaysButtonText}
                  disclaimer={category.exploreOtherWaysDisclaimer}
                  onHeadingClick={handleHeadingClick}
               />
            )}

         {/* Top Locations Section - Links to /locations/[city] */}
         {category.topLocationsTitle &&
            category.topLocationsHeadings &&
            category.topLocationsHeadings.length > 0 && (
               <TopLocationsSection
                  title={category.topLocationsTitle}
                  headings={category.topLocationsHeadings}
                  onHeadingClick={handleLocationClick}
               />
            )}

         {/* Browse Similar Tasks Section - Links to other categories */}
         {category.browseSimilarTasksTitle &&
            category.browseSimilarTasksHeadings &&
            category.browseSimilarTasksHeadings.length > 0 && (
               <BrowseSimilarTasksSection
                  title={category.browseSimilarTasksTitle}
                  headings={category.browseSimilarTasksHeadings}
                  onHeadingClick={handleCategoryClick}
               />
            )}
      </>
   );
};

export default CategoryDetailClient;
