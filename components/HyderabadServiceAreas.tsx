"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { getCityBySlug } from "@/lib/data/cities";

interface HyderabadServiceAreasProps {
   serviceName: string;
   categorySlug: string;
   currentAreaSlug?: string | null;
   currentPageSlug?: string;
   className?: string;
}

const hyderabadAreas = getCityBySlug("hyderabad")?.neighborhoods ?? [];

function toAreaSlug(area: string) {
   return area.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

function getServicesHeading(serviceName: string) {
   const nameWithoutServices = serviceName.replace(/\s+services?$/i, "").trim();
   return `${nameWithoutServices} Services`;
}

export default function HyderabadServiceAreas({
   serviceName,
   categorySlug,
   currentAreaSlug = null,
   currentPageSlug,
   className = "",
}: HyderabadServiceAreasProps) {
   const pathname = usePathname();
   const pathSegments = (pathname ?? "").split("/").filter(Boolean);
   const pageSlug = pathSegments.at(-1) ?? "";
   const areaSlugToExclude =
      currentAreaSlug ??
      hyderabadAreas
         .map(toAreaSlug)
         .find(
            (areaSlug) =>
               pathSegments.includes(areaSlug) ||
               pageSlug.endsWith(`-in-${areaSlug}`) ||
               currentPageSlug?.endsWith(`-in-${areaSlug}`)
         ) ??
      null;
   const areas = hyderabadAreas.filter(
      (area) => toAreaSlug(area) !== areaSlugToExclude
   );

   return (
      <section className={`space-y-6 ${className}`}>
         <div className="border-l-4 border-primary-500 pl-4">
            <h2 className="text-2xl font-bold tracking-tight text-secondary-900 sm:text-3xl">
               {getServicesHeading(serviceName)} near me
            </h2>
         </div>
         <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {areas.map((area) => (
               <li key={area}>
                  <Link
                     href={`/${categorySlug}-in-${toAreaSlug(area)}`}
                     className="block rounded-xl border border-secondary-200 bg-secondary-50 px-4 py-3 text-sm font-semibold text-secondary-800 transition hover:border-primary-300 hover:bg-white"
                  >
                     {area}
                  </Link>
               </li>
            ))}
         </ul>
      </section>
   );
}
