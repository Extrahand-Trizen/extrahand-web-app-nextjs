import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Press | ExtraHand",
  description:
    "Latest news, press releases, and media coverage about ExtraHand.",
};

export default function PressPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8 md:py-12 max-w-3xl">
        <h1 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">
          Press
        </h1>

        <p className="text-gray-700 mb-6">
          Stay updated with the latest news and announcements from ExtraHand.
          Here you&apos;ll find press releases, media coverage, and important
          updates about our platform.
        </p>

        <div className="bg-white rounded-lg shadow-sm p-6 md:p-8 mb-8">
          <h2 className="text-2xl font-semibold mb-3 text-gray-900">
            For Journalists & Media
          </h2>
          <p className="text-gray-700 mb-4">
            If you&apos;re a journalist or media outlet interested in covering
            ExtraHand, we&apos;d love to help! Please reach out to our press
            team.
          </p>
          <p className="text-gray-700">
            Email:{' '}
            <a
              href="mailto:press@extrahand.in"
              className="text-blue-600 hover:underline"
            >
              press@extrahand.in
            </a>
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 md:p-8 mb-8">
          <h2 className="text-2xl font-semibold mb-3 text-gray-900">
            Latest News
          </h2>
          <p className="text-gray-700">
            Check back soon for the latest press releases and news updates from
            ExtraHand. We&apos;re constantly growing and innovating!
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 md:p-8">
          <h2 className="text-2xl font-semibold mb-3 text-gray-900">
            Brand Assets
          </h2>
          <p className="text-gray-700 mb-4">
            Need our logo or other brand materials? Contact our press team to
            request brand assets and media kits.
          </p>
        </div>
      </div>
    </div>
  );
}
