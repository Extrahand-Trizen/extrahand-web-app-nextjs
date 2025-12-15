// Category and Subcategory TypeScript Types

export interface Subcategory {
   _id?: string;
   name: string;
   slug: string;
   categorySlug?: string;
}

export interface Category {
   _id?: string;
   name: string;
   slug: string;
   heroImage?: string;
   heroTitle: string;
   heroDescription: string;
   subcategories?: Subcategory[];
}

export interface EarningRange {
   "1-2": string;
   "3-5": string;
   "5+": string;
}

export interface EarningsCard {
   weekly: EarningRange;
   monthly: EarningRange;
   yearly: EarningRange;
}

export interface WhyJoinFeature {
   title: string;
   description: string;
}

export interface StaticTask {
   title: string;
   price: string;
   description: string;
   date?: string;
   timeAgo?: string;
   status?: string;
   profileImage?: string;
}

export interface Task {
   title: string;
   price: string;
   description: string;
   profileImage?: string;
}

export interface IncomeOpportunityRow {
   jobType: string;
   "1-2": string;
   "3-5": string;
   "5+": string;
}

export interface IncomeOpportunitiesData {
   weekly: IncomeOpportunityRow[];
   monthly: IncomeOpportunityRow[];
   yearly: IncomeOpportunityRow[];
}

export interface HowToEarnStep {
   image: string;
   subtitle: string;
   description: string;
}

export interface TopTasker {
   meetText: string;
   profileImage: string;
   name: string;
   yearsOnExtrahand: string;
   location: string;
   rating: string;
   overallRatingText: string;
   reviewsCount: string;
   completionRate: string;
   completionRateText: string;
   tasksCount: string;
}

export interface InsuranceCoverFeature {
   icon: "human" | "star";
   subtitle: string;
   subdescription: string;
}

export interface Question {
   subtitle: string;
   description: string;
}

export interface WaysToEarnContent {
   heading?: string;
   text: string;
}

export interface ExploreOtherWaysTask {
   subtitle: string;
   subheading: string;
   image: string;
}

export interface FooterData {
   discoverHeading: string;
   discoverLinks: string[];
   companyHeading: string;
   companyLinks: string[];
   existingMembersHeading: string;
   existingMembersLinks: string[];
   popularCategoriesHeading: string;
   popularCategoriesLinks: string[];
   popularLocationsHeading: string;
   popularLocations: string[];
   copyrightText: string;
   appleStoreImage?: string;
   googlePlayImage?: string;
}

export interface CategoryDetail extends Category {
   // Earnings
   earningsCard: EarningsCard;
   defaultEarnings: string;
   earningsPeriod: string;
   earnings1to2: string;
   earnings3to5: string;
   earnings5plus: string;
   taskCount: string;
   location: string;
   disclaimer: string;

   // Why Join Section
   whyJoinTitle: string;
   whyJoinFeatures: WhyJoinFeature[];
   whyJoinButtonText: string;

   // Static Tasks Section
   staticTasksSectionTitle?: string;
   staticTasksSectionDescription: string;
   browseAllTasksButtonText: string;
   lastUpdatedText: string;
   staticTasks: StaticTask[];

   // SEO
   metaTitle?: string;
   metaDescription?: string;
   isPublished: boolean;

   // Earning Potential Section
   earningPotentialTitle: string;
   earningPotentialDescription: string;
   earningPotentialButtonText: string;
   earningPotentialData: EarningsCard;
   earningPotentialDisclaimer: string;

   // Income Opportunities Section
   incomeOpportunitiesTitle: string;
   incomeOpportunitiesDescription: string;
   incomeOpportunitiesData: IncomeOpportunitiesData;
   incomeOpportunitiesDisclaimer: string;

   // How to Earn Section
   howToEarnTitle: string;
   howToEarnSteps: HowToEarnStep[];
   howToEarnButtonText: string;

   // Tasks
   tasks: Task[];

   // Get Inspired Section
   getInspiredTitle: string;
   getInspiredButtonText: string;
   topTaskers: TopTasker[];

   // Insurance Cover Section
   insuranceCoverTitle: string;
   insuranceCoverDescription: string;
   insuranceCoverButtonText: string;
   insuranceCoverFeatures: InsuranceCoverFeature[];

   // Questions Section
   questionsTitle: string;
   questions: Question[];

   // Ways to Earn Section
   waysToEarnTitle: string;
   waysToEarnContent: WaysToEarnContent[];

   // Explore Other Ways Section
   exploreOtherWaysTitle: string;
   exploreOtherWaysImage?: string;
   exploreOtherWaysTasks: ExploreOtherWaysTask[];
   exploreOtherWaysButtonText: string;
   exploreOtherWaysDisclaimer: string;

   // Top Locations Section
   topLocationsIcon: string;
   topLocationsTitle: string;
   topLocationsHeadings: string[];

   // Browse Similar Tasks Section
   browseSimilarTasksIcons: string[];
   browseSimilarTasksTitle: string;
   browseSimilarTasksHeadings: string[];

   // Footer
   footer: FooterData;
}

export type SubcategoryDetail = CategoryDetail;
