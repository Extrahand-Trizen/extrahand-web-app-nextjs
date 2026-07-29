import { getAllCitySlugs } from "@/lib/data/cities";

/** Required for `output: 'export'` with dynamic segments. */
export function generateStaticParams() {
   const slugs = getAllCitySlugs();
   return slugs.map((slug) => ({
      city: slug,
   }));
}

export default function Layout({ children }: { children: React.ReactNode }) {
   return children;
}
