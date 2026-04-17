export type BlogPost = {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  tags: string[];
  publishedAt: string;
  updatedAt: string;
  readTime: string;
  author: string;
  content: string[];
};

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: "trusted-local-services-marketplace",
    title: "Building A Trusted Local Services Marketplace With ExtraHand",
    excerpt:
      "How ExtraHand combines verification, city-first discovery, and transparent outcomes to help users book local services faster.",
    category: "Trust & Safety",
    tags: ["verification", "trust", "marketplace", "local-services"],
    publishedAt: "2026-03-27",
    updatedAt: "2026-03-27",
    readTime: "6 min read",
    author: "ExtraHand Product Team",
    content: [
      "ExtraHand is designed to solve a common problem: finding reliable local help quickly without sacrificing trust or quality.",
      "From home cleaning and plumbing to delivery and pet care, the platform helps people connect with verified experts in a few clicks.",
      "For users, ExtraHand reduces search friction and improves confidence with better service discovery, meaningful category pages, and transparent selection signals.",
      "For taskers, it creates high-intent opportunities and recurring demand across city-based markets.",
      "The roadmap continues to focus on better category navigation, richer location discovery, and stronger SEO foundations so customers can find the right service page faster and book with confidence.",
    ],
  },
  {
    slug: "city-first-service-discovery-playbook",
    title: "City-First Service Discovery: What Improves Conversion",
    excerpt:
      "A practical look at city-level landing structure, intent matching, and information hierarchy for local service pages.",
    category: "Growth",
    tags: ["seo", "city-pages", "conversion"],
    publishedAt: "2026-03-18",
    updatedAt: "2026-03-18",
    readTime: "5 min read",
    author: "Growth Team",
    content: [
      "City-level discovery works best when each page clearly answers who the service is for, what is included, and how quickly customers can start.",
      "Strong headings, trust cues, and specific service coverage reduce drop-off and help users reach booking intent faster.",
      "The best-performing city pages also include FAQs and local context that reduce ambiguity before contact.",
    ],
  },
  {
    slug: "verification-signals-that-drive-booking-confidence",
    title: "Verification Signals That Drive Booking Confidence",
    excerpt:
      "Why profile completeness, response consistency, and outcome visibility matter more than generic badges.",
    category: "Trust & Safety",
    tags: ["profiles", "reviews", "trust-signals"],
    publishedAt: "2026-03-12",
    updatedAt: "2026-03-12",
    readTime: "4 min read",
    author: "Trust Team",
    content: [
      "Customers evaluate reliability quickly. Clear profile information and proof of completed work create confidence at the point of decision.",
      "Response behavior and completion communication are equally important because they shape real-world service experience.",
      "When trust signals are specific and understandable, users make faster and better booking choices.",
    ],
  },
  {
    slug: "faster-task-completion-with-clear-scopes",
    title: "Faster Task Completion Starts With Clear Task Scope",
    excerpt:
      "How better task briefs improve match quality and reduce cancellations in local service workflows.",
    category: "Operations",
    tags: ["task-brief", "completion", "quality"],
    publishedAt: "2026-03-05",
    updatedAt: "2026-03-05",
    readTime: "4 min read",
    author: "Operations Team",
    content: [
      "Task quality begins with scope clarity. Useful briefs include timelines, expectations, constraints, and required tools.",
      "Clear scope improves matching and reduces revisions after acceptance.",
      "Operationally, this leads to higher completion rates and better user satisfaction.",
    ],
  },
  {
    slug: "tasker-growth-from-first-job-to-repeat-clients",
    title: "Tasker Growth: From First Job To Repeat Clients",
    excerpt:
      "A field-tested model for taskers to increase repeat demand through communication and reliability.",
    category: "Tasker Growth",
    tags: ["tasker", "repeat-clients", "ratings"],
    publishedAt: "2026-02-27",
    updatedAt: "2026-02-27",
    readTime: "5 min read",
    author: "Tasker Success Team",
    content: [
      "Repeat demand is built through reliable arrivals, transparent updates, and clean task closure.",
      "Taskers who actively confirm scope and timelines often receive stronger ratings and referrals.",
      "Over time, consistency compounds into steady weekly demand.",
    ],
  },
  {
    slug: "support-workflows-that-improve-resolution-speed",
    title: "Support Workflows That Improve Resolution Speed",
    excerpt:
      "How routing, context capture, and ownership reduce support turnaround for service incidents.",
    category: "Operations",
    tags: ["support", "routing", "resolution"],
    publishedAt: "2026-02-19",
    updatedAt: "2026-02-19",
    readTime: "4 min read",
    author: "Support Team",
    content: [
      "Support effectiveness depends on complete context at the first touchpoint.",
      "Better routing logic and clear ownership reduce time to resolution and eliminate repeated handoffs.",
      "Users experience less friction when updates are proactive and specific.",
    ],
  },
  {
    slug: "better-service-pages-with-intent-focused-content",
    title: "Intent-Focused Content For Better Service Pages",
    excerpt:
      "What to include on service pages so users can compare options quickly and confidently.",
    category: "Content",
    tags: ["content", "service-pages", "ux"],
    publishedAt: "2026-02-10",
    updatedAt: "2026-02-10",
    readTime: "3 min read",
    author: "Content Team",
    content: [
      "High-intent pages reduce confusion with clear inclusions, exclusions, and timelines.",
      "Category-specific FAQs and practical examples help users self-qualify before booking.",
      "The result is stronger lead quality and lower drop-off.",
    ],
  },
  {
    slug: "making-local-payments-safer-and-clearer",
    title: "Making Local Service Payments Safer And Clearer",
    excerpt:
      "Design patterns that increase payment confidence while keeping the booking process smooth.",
    category: "Trust & Safety",
    tags: ["payments", "safety", "checkout"],
    publishedAt: "2026-02-01",
    updatedAt: "2026-02-01",
    readTime: "4 min read",
    author: "Payments Team",
    content: [
      "Payment trust improves when pricing is transparent and state transitions are understandable.",
      "Clear confirmation and status messaging reduce support dependency.",
      "Customers complete transactions more confidently when every step is predictable.",
    ],
  },
  {
    slug: "from-discovery-to-delivery-reducing-user-friction",
    title: "From Discovery To Delivery: Reducing User Friction",
    excerpt:
      "A journey-level approach to reducing drop-offs from first visit to completed service.",
    category: "Product",
    tags: ["user-journey", "retention", "product"],
    publishedAt: "2026-01-24",
    updatedAt: "2026-01-24",
    readTime: "5 min read",
    author: "Product Team",
    content: [
      "Journey friction appears at handoff points: discovery, evaluation, booking, and completion.",
      "Reducing uncertainty at each stage improves both conversion and post-service satisfaction.",
      "Teams that instrument these stages can prioritize fixes with measurable impact.",
    ],
  },
];

export const BLOG_CATEGORIES = Array.from(
  new Set(BLOG_POSTS.map((post) => post.category)),
);

export const BLOG_TAGS = Array.from(
  new Set(BLOG_POSTS.flatMap((post) => post.tags)),
);

export function getBlogPostBySlug(slug: string) {
  return BLOG_POSTS.find((post) => post.slug === slug);
}
