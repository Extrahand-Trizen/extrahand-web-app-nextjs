import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Success Stories | ExtraHand",
  description:
    "Read success stories from task posters and taskers using ExtraHand.",
};

const stories = [
  {
    title: "Same-day home repair completed",
    summary:
      "A poster found a verified tasker within hours and completed urgent electrical work the same day.",
  },
  {
    title: "Weekend moving made easy",
    summary:
      "A family hired experienced movers through ExtraHand and finished relocation on schedule.",
  },
  {
    title: "Tasker built a steady income",
    summary:
      "A skilled tasker consistently picked local jobs and grew repeat clients through positive ratings.",
  },
];

export default function SuccessStoriesPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8 md:py-12 max-w-4xl">
        <h1 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">
          Success Stories
        </h1>

        <p className="text-gray-700 mb-8">
          Real examples of how posters and taskers use ExtraHand to get work done faster and more reliably.
        </p>

        <div className="grid gap-6">
          {stories.map((story) => (
            <article key={story.title} className="bg-white rounded-lg shadow-sm p-6 md:p-8">
              <h2 className="text-xl md:text-2xl font-semibold text-gray-900 mb-2">
                {story.title}
              </h2>
              <p className="text-gray-700">{story.summary}</p>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
