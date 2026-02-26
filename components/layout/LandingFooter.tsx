/**
 * Landing Footer - Clean, organized footer
 *
 * Design principles:
 * - Essential links only
 * - Clear hierarchy
 * - App download CTAs
 * - Social proof and trust
 */

"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Facebook, Twitter, Instagram, Linkedin, Youtube } from "lucide-react";

const footerLinks = {
  discover: {
    title: "Discover",
    links: [
      { label: "How it Works", href: "#how-it-works" },
      { label: "Browse Categories", href: "#categories" },
      { label: "Trust & Safety", href: "#trust" },
      { label: "Pricing", href: "/coming-soon?type=info&label=Pricing" },
    ],
  },
  forTaskers: {
    title: "For Taskers",
    links: [
      { label: "Become a Tasker", href: "/earn-money" },
      { label: "How to Earn", href: "/coming-soon?type=info&label=How%20to%20Earn" },
      { label: "Tasker Guidelines", href: "/coming-soon?type=info&label=Tasker%20Guidelines" },
      { label: "Success Stories", href: "#testimonials" },
      { label: "Resources", href: "/coming-soon?type=info&label=Resources" },
    ],
  },
  company: {
    title: "Company",
    links: [
      { label: "About Us", href: "/coming-soon?type=info&label=About%20Us" },
      { label: "Careers", href: "/careers" },
      { label: "Press", href: "/coming-soon?type=info&label=Press" },
      { label: "Contact", href: "/contact" },
      { label: "Help Center", href: "/coming-soon?type=info&label=Help%20Center" },
      { label: "FAQs", href: "/coming-soon?type=info&label=FAQs" },
      { label: "Privacy Policy", href: "/privacy-policy" },
      { label: "Terms and Conditions", href: "/terms-and-conditions" },
      { label: "Refund Policy", href: "/refund-policy" },
      { label: "Tasker Agreement", href: "/provider-agreement" },
      { label: "Community Guidelines", href: "/coming-soon?type=info&label=Community%20Guidelines" },
      { label: "Report an Issue", href: "/coming-soon?type=info&label=Report%20an%20Issue" },
    ],
  },
  categories: {
    title: "Popular Categories",
    links: [
      { label: "Electricians", href: "/coming-soon" },
      { label: "Plumbers", href: "/coming-soon" },
      { label: "Home Cleaning", href: "/coming-soon" },
      { label: "Packers & Movers", href: "/coming-soon" },
      { label: "Carpenters", href: "/coming-soon" },
      { label: "AC Services", href: "/coming-soon" },
      { label: "Appliance Repair", href: "/coming-soon" },
    ],
  },
  cities: {
    title: "Popular Cities",
    links: [
      { label: "Delhi NCR", href: "/locations/delhi" },
      { label: "Mumbai", href: "/locations/mumbai" },
      { label: "Bangalore", href: "/locations/bangalore" },
      { label: "Hyderabad", href: "/locations/hyderabad" },
      { label: "Chennai", href: "/locations/chennai" },
      { label: "Kolkata", href: "/locations/kolkata" },
      { label: "Pune", href: "/locations/pune" },
      { label: "Ahmedabad", href: "/locations/ahmedabad" },
    ],
  },
};

const socialLinks = [
  { icon: Facebook, href: "https://www.facebook.com/profile.php?id=61587931868799", label: "Facebook" },
  { icon: Twitter, href: "https://x.com/ExtrahandI42141", label: "X (Twitter)" },
  { icon: Instagram, href: "https://www.instagram.com/extrahand.in/", label: "Instagram" },
  { icon: Youtube, href: "https://www.youtube.com/channel/UCHCIU5Qq0mEdGf8RgJIjCUw", label: "YouTube" },
];

export const LandingFooter: React.FC = () => {
  const pathname = usePathname();

  return (
    <footer className="bg-secondary-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-12">
        {/* Main footer content */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 lg:gap-10 mb-12">
          {/* Brand column */}
          <div className="col-span-2 md:col-span-4 lg:col-span-1 mb-4 lg:mb-0">
          <Link href="/" className="flex items-center gap-2 mb-4">
              <Image
                src="/assets/images/logo.png"
                alt="ExtraHand"
                width={48}
                height={48}
                className="size-8 md:size-12"
                priority={false}
              />
              <div className="flex flex-col">
                <span className="text-lg md:text-xl font-bold">ExtraHand</span>
                <span className="text-xs md:text-sm font-semibold text-secondary-400">
                  By NAIPUNYA AI LABS PRIVATE LIMITED
                </span>
              </div>
            </Link>
          <p className="text-secondary-400 text-xs md:text-sm leading-relaxed pt-1.5">
            Get any task done by verified local experts. Safe, secure, and
            simple.
          </p>

            {/* Social links */}
            <div className="flex items-center gap-3 mt-5">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="size-8 md:size-10 rounded-full bg-secondary-800 hover:bg-secondary-700 flex items-center justify-center transition-colors"
                >
                  <social.icon className="size-4 md:size-5 text-secondary-400" />
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {Object.values(footerLinks).map((column) => {
            const links =
              column.title === "Discover" && pathname !== "/"
                ? column.links.filter((link) => link.label !== "How it Works")
                : column.links;

            return (
              <div key={column.title}>
                <h3 className="text-sm md:text-base font-semibold text-white mb-3 md:mb-4">
                  {column.title}
                </h3>
                <ul className="md:space-y-3">
                  {links.map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        className="text-secondary-400 hover:text-white text-xs md:text-sm transition-colors"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>

        {/* App download section */}
        <div className="border-t border-secondary-800 py-6 md:py-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            <div>
              <h4 className="font-semibold text-white text-sm md:text-base mb-1">
                Get the app
              </h4>
              <p className="text-secondary-400 text-xs md:text-sm">
                Download ExtraHand on your mobile device
              </p>
            </div>
            <div className="flex gap-4">
              {/* App Store */}
              <a
                href="/coming-soon?type=info&label=Mobile%20App"
                className="flex items-center gap-3 bg-white rounded-xl px-3 py-2 md:px-4 md:py-2.5 hover:bg-secondary-100 transition-colors"
              >
                <svg
                  className="size-5 md:size-7"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <path
                    d="M18.71 19.5C17.88 20.74 17 21.95 15.66 21.97C14.32 22 13.89 21.18 12.37 21.18C10.84 21.18 10.37 21.95 9.1 22C7.79 22.05 6.8 20.68 5.96 19.47C4.25 17 2.94 12.45 4.7 9.39C5.57 7.87 7.13 6.91 8.82 6.88C10.1 6.86 11.32 7.75 12.11 7.75C12.89 7.75 14.37 6.68 15.92 6.84C16.57 6.87 18.39 7.1 19.56 8.82C19.47 8.88 17.39 10.1 17.41 12.63C17.44 15.65 20.06 16.66 20.09 16.67C20.06 16.74 19.67 18.11 18.71 19.5ZM13 3.5C13.73 2.67 14.94 2.04 15.94 2C16.07 3.17 15.6 4.35 14.9 5.19C14.21 6.04 13.07 6.7 11.95 6.61C11.8 5.46 12.36 4.26 13 3.5Z"
                    fill="#111"
                  />
                </svg>
                <div className="text-left">
                  <p className="text-[10px] text-secondary-500 leading-none">
                    Download on the
                  </p>
                  <p className="text-xs md:text-sm font-semibold text-secondary-900">
                    App Store
                  </p>
                </div>
              </a>

              {/* Google Play */}
              <a
                href="/coming-soon?type=info&label=Mobile%20App"
                className="flex items-center gap-3 bg-white rounded-xl px-3 py-2 md:px-4 md:py-2.5 hover:bg-secondary-100 transition-colors"
              >
                <svg
                  className="size-5 md:size-6"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <path
                    d="M3 20.5V3.5C3 2.91 3.34 2.39 3.84 2.15L13.69 12L3.84 21.85C3.34 21.6 3 21.09 3 20.5Z"
                    fill="#4285F4"
                  />
                  <path
                    d="M16.81 15.12L6.05 21.34L14.54 12.85L16.81 15.12Z"
                    fill="#34A853"
                  />
                  <path
                    d="M20.16 10.81C20.5 11.08 20.75 11.5 20.75 12C20.75 12.5 20.53 12.9 20.18 13.18L17.89 14.5L15.39 12L17.89 9.5L20.16 10.81Z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M6.05 2.66L16.81 8.88L14.54 11.15L6.05 2.66Z"
                    fill="#EA4335"
                  />
                </svg>
                <div className="text-left">
                  <p className="text-[10px] text-secondary-500 leading-none">
                    Get it on
                  </p>
                  <p className="text-xs md:text-sm font-semibold text-secondary-900">
                    Google Play
                  </p>
                </div>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom bar with legal + address strip */}
        <div className="border-t border-secondary-800 py-5 md:pt-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1 text-xs md:text-sm text-secondary-500 max-w-3xl">
              <p>© {new Date().getFullYear()} ExtraHand. All rights reserved.</p>
              <p>
                Registered Office: 1-98/G/38, Plot 37 &amp; 38, Serenity Square,
                Jain Rock Garden, The Westin Hyderabad Hitec City (Opposite),
                Madhapur
              </p>
              <p>Hyderabad, Telangana 500081</p>
            </div>
            <div className="flex items-center gap-6 text-xs md:text-sm">
              <Link
                href="/privacy-policy"
                className="text-secondary-400 hover:text-white transition-colors"
              >
                Privacy Policy
              </Link>
              <Link
                href="/terms-and-conditions"
                className="text-secondary-400 hover:text-white transition-colors"
              >
                Terms and Conditions
              </Link>
              <Link
                href="/cookie-policy" 
                className="text-secondary-400 hover:text-white transition-colors"
              >
                Cookie Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
