import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "FAQs | ExtraHand",
  description: "Frequently asked questions about ExtraHand services.",
};

const faqSections = [
  {
    title: "About ExtraHand",
    items: [
      {
        question: "What is ExtraHand?",
        answer:
          "ExtraHand is a local-services marketplace operated by Naipunya AI Labs Private Limited. It helps Posters connect with independent Helpers for everyday jobs, home services, business support, delivery help, and other local tasks.",
      },
      {
        question: "Does ExtraHand provide the task directly?",
        answer:
          "No. ExtraHand acts as a platform that helps users discover, book, communicate, and manage tasks. The actual work is carried out by independent Helpers.",
      },
      {
        question: "Who can use ExtraHand?",
        answer:
          "People who need help with a task can join as Posters, and skilled individuals looking for local work opportunities can join as Helpers, subject to platform requirements and verification where applicable.",
      },
    ],
  },
  {
    title: "For Posters",
    items: [
      {
        question: "How do I get help?",
        answer:
          "Click on \"Get Help,\" describe the work, add location and timing details, set your budget, and submit the task. Interested Helpers can then review the requirement and respond through the platform.",
      },
      {
        question: "How is pricing decided?",
        answer:
          "The final task amount depends on the type of work, urgency, complexity, and the agreement between the Poster and the Helper. ExtraHand helps organize the flow, but users should make sure the scope and price are clear before work begins.",
      },
      {
        question: "How do I choose the right Helper?",
        answer:
          "You can review the Helper's profile, ratings, reviews, relevant experience, and communication before proceeding. Choosing the right Helper is easier when your task description is specific and complete.",
      },
      {
        question: "What if the task details change after booking?",
        answer:
          "If the scope, timing, or materials change, both sides should discuss the changes clearly before work continues. This helps avoid confusion around expectations, timelines, and payment.",
      },
    ],
  },
  {
    title: "Payments and completion",
    items: [
      {
        question: "Is payment secure?",
        answer:
          "Payments on ExtraHand are processed through supported online payment methods. The platform is designed to keep the payment flow organized and reduce confusion around task completion and payouts.",
      },
      {
        question: "When does a Helper get paid?",
        answer:
          "Helper payouts are processed after the task is marked complete, subject to the platform workflow, applicable checks, and any dispute or refund process that may apply.",
      },
      {
        question: "What if I am not satisfied with the work?",
        answer:
          "If there is a problem with quality, completion, or expectations, contact support as soon as possible and share the relevant details. ExtraHand may review the issue through its dispute and support process.",
      },
      {
        question: "Can I cancel a task?",
        answer:
          "Yes, but cancellation outcomes depend on timing and the applicable policy. Refunds, charges, and compensation may vary based on how close the cancellation is to the scheduled task.",
      },
    ],
  },
  {
    title: "For Helpers",
    items: [
      {
        question: "How do I become a Helper?",
        answer:
          "You can sign up, complete your profile, and submit the required information requested by the platform. Certain categories or payment features may require identity verification before you can start accepting tasks or receiving payouts.",
      },
      {
        question: "Do all Helpers need verification?",
        answer:
          "Verification requirements can depend on the role and the feature being used. Where identity verification is required, Helpers must complete it successfully before using those features.",
      },
      {
        question: "How can Helpers increase their chances of getting work?",
        answer:
          "A complete profile, clear communication, professional behavior, timely responses, and strong reviews can all help Helpers build trust and improve their chances of being selected.",
      },
    ],
  },
  {
    title: "Support and safety",
    items: [
      {
        question: "How do I contact support?",
        answer:
          "For help with tasks, payments, disputes, or account-related questions, contact ExtraHand at support@extrahand.in.",
      },
      {
        question: "What should I do if I see suspicious behavior?",
        answer:
          "Report it immediately. Misleading information, abusive conduct, off-platform solicitation, fraud, and unsafe behavior should be brought to the platform's attention as soon as possible.",
      },
      {
        question: "Where can I read more about your policies?",
        answer:
          "You can review our Terms and Conditions, Privacy Policy, Community Guidelines, Refund Policy, and related public pages on the ExtraHand website.",
      },
    ],
  },
];

export default function FAQsPage() {
  return (
    <main className="min-h-screen bg-white text-secondary-900">
      <div className="mx-auto max-w-4xl px-5 py-12 md:px-8 md:py-16">
        <header className="mb-10">
          <h1 className="text-3xl font-bold text-secondary-900 md:text-4xl">
            Frequently Asked Questions
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-7 text-secondary-600">
            Here are the most common questions about using ExtraHand as a
            Poster or a Helper. These answers are meant to give a practical
            overview of how the platform works.
          </p>
        </header>

        <div className="space-y-8">
          {faqSections.map((section) => (
            <section
              key={section.title}
              className="border-t border-secondary-200 py-8"
            >
              <h2 className="text-2xl font-semibold text-secondary-900">
                {section.title}
              </h2>
              <div className="mt-6 space-y-6">
                {section.items.map((item) => (
                  <div key={item.question}>
                    <h3 className="text-lg font-semibold text-secondary-900">
                      {item.question}
                    </h3>
                    <p className="mt-2 leading-7 text-secondary-600">
                      {item.answer}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>
    </main>
  );
}
