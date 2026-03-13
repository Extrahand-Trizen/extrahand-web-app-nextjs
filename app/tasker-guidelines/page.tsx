import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tasker Guidelines | ExtraHand",
  description:
    "Guidelines for Taskers on ExtraHand to keep every task safe, professional, and reliable.",
};

export default function TaskerGuidelinesPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8 md:py-12 max-w-3xl">
        <h1 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">
          Tasker Guidelines
        </h1>

        <p className="text-gray-700 mb-6">
          Follow these guidelines to deliver safe, high-quality service and build trust with task posters.
        </p>

        <div className="bg-white rounded-lg shadow-sm p-6 md:p-8 mb-6">
          <h2 className="text-2xl font-semibold mb-3 text-gray-900">Before You Accept</h2>
          <ul className="list-disc pl-5 space-y-2 text-gray-700">
            <li>Read the task details fully before making an offer.</li>
            <li>Ask clarifying questions when scope or requirements are unclear.</li>
            <li>Only accept tasks you can complete on time and to quality standards.</li>
          </ul>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 md:p-8 mb-6">
          <h2 className="text-2xl font-semibold mb-3 text-gray-900">During the Task</h2>
          <ul className="list-disc pl-5 space-y-2 text-gray-700">
            <li>Arrive on time and communicate promptly about delays.</li>
            <li>Be respectful, professional, and transparent about progress.</li>
            <li>Keep work areas clean and follow all safety practices.</li>
          </ul>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 md:p-8">
          <h2 className="text-2xl font-semibold mb-3 text-gray-900">After Completion</h2>
          <ul className="list-disc pl-5 space-y-2 text-gray-700">
            <li>Confirm completion details with the poster before closing the task.</li>
            <li>Provide any required proof or photos where applicable.</li>
            <li>Maintain polite follow-up communication until the task is marked complete.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
