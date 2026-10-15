import { NextResponse } from "next/server";
import { getAllCitySlugs, getCityBySlug } from "@/lib/data/cities";
import { getCityPageDefaultContent } from "@/lib/data/city-page-content";

export async function GET() {
   const data = getAllCitySlugs().flatMap((citySlug) => {
      const city = getCityBySlug(citySlug);
      if (!city) return [];

      return [
         {
            citySlug,
            cityName: city.name,
            pageUrl: `/locations/${citySlug}`,
            content: getCityPageDefaultContent(city),
         },
      ];
   });

   return NextResponse.json(
      { data },
      { headers: { "Access-Control-Allow-Origin": "*" } }
   );
}
