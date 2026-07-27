import type { MetadataRoute } from "next";

export const dynamic = "force-static";

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://extrahand.in";

export default function robots(): MetadataRoute.Robots {
   return {
      rules: [
         {
            userAgent: "*",
            allow: "/",
            disallow: [
               "/login",
               "/signup",
               "/otp-verification",
               "/onboarding",
               "/dashboard",
               "/notifications",
               "/payments",
               "/profile/verify",
               "/chat",
               "/applications",
               "/api/",
            ],
         },
      ],
      sitemap: `${baseUrl}/sitemap.xml`,
   };
}
