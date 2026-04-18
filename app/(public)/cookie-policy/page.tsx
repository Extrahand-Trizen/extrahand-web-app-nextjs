import type { Metadata } from "next";
import { CookiePreferencesManager } from "@/components/cookies/CookiePreferencesManager";

export const metadata: Metadata = {
  title: "Cookie | ExtraHand",
  description:
    "Information about how ExtraHand uses cookies and similar technologies.",
};

export default function CookiePolicyPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto w-full max-w-6xl px-4 py-8 md:px-6 md:py-12 lg:px-8">
        <h1 className="text-center text-3xl font-bold text-gray-900 md:text-5xl">
          Cookies
        </h1>

        <div className="mt-8 space-y-6 md:space-y-8">
          <p className="text-gray-700">
            This section provides details about the cookies used on this website.
          </p>

          <p className="text-gray-700">
            Follow one of the links below for further information:
          </p>

          <ul className="list-disc space-y-2 pl-6 text-gray-700">
            <li><a href="#what-is-cookie" className="text-blue-700 hover:underline">What is a cookie?</a></li>
            <li><a href="#why-cookies" className="text-blue-700 hover:underline">Why do website developers use cookies?</a></li>
            <li><a href="#manage-preferences" className="text-blue-700 hover:underline">Manage cookie preferences</a></li>
            <li><a href="#clearing-cookies" className="text-blue-700 hover:underline">Clearing website cookies</a></li>
          </ul>

          <h2 id="what-is-cookie" className="scroll-mt-20 pt-6 text-2xl font-bold text-gray-900 md:scroll-mt-24">
            What is a cookie?
          </h2>
          <p className="mt-4 text-gray-700">
            Cookies are text files containing small amounts of information which are
            downloaded to your computer or mobile device when you visit a web site.
            The cookie sends this information back to the originating web site when you visit it again.
          </p>

          <h2 id="why-cookies" className="scroll-mt-20 pt-6 text-2xl font-bold text-gray-900 md:scroll-mt-24">
            Why do websites use cookies?
          </h2>
          <p className="mt-4 text-gray-700">
            Cookies make interaction between users and websites faster and easier, and help improve websites.
            Without cookies, a website could not remember your preferences for a future visit.
          </p>

          <h2 className="scroll-mt-20 pt-6 text-2xl font-bold text-gray-900 md:scroll-mt-24">Manage cookie preferences</h2>
          <p className="mt-4 text-gray-700">Use the controls below to select which optional cookie categories you accept.</p>

          <div id="manage-preferences" className="not-prose scroll-mt-20 md:scroll-mt-24">
            <CookiePreferencesManager />
          </div>
        </div>
      </div>
    </div>
  );
}

