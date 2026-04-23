import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Tasker Guidelines | ExtraHand",
  description:
    "Guidelines for Taskers on ExtraHand to keep every task safe, professional, and reliable.",
};

const sections = [
  {
    title: "Before accepting a task",
    paragraphs: [
      "Read the task carefully before you accept it. Make sure you understand the scope, location, timing, materials, and expected result. If anything is unclear, ask questions before committing.",
      "Accept only the work that you can complete safely, lawfully, and to a professional standard. If a job requires a skill, tool, license, or safety practice that you do not have, do not accept it.",
    ],
    bullets: [
      "Keep your profile, service details, and bank information accurate.",
      "Complete the required Aadhaar-based KYC before accepting or performing tasks where the platform requires it.",
      "Do not misrepresent your skill level, experience, or availability.",
    ],
  },
  {
    title: "Prepare and arrive professionally",
    paragraphs: [
      "Come prepared with the tools, materials, and protective equipment that you agreed to provide. If the customer is expected to provide something, confirm it in advance rather than discovering the problem on-site.",
      "Arrive on time whenever possible. If you are delayed, communicate early and clearly through the platform or the agreed task communication flow.",
    ],
    bullets: [
      "Carry suitable tools for the work you accepted.",
      "Dress and behave professionally during customer interactions.",
      "Avoid repeated delays, no-shows, or last-minute cancellations.",
    ],
  },
  {
    title: "Respect the customer's space, privacy, and safety",
    paragraphs: [
      "Many ExtraHand tasks happen in homes, offices, and other personal spaces. You must respect the customer's property, privacy, and instructions while carrying out the work.",
      "Do not behave in a threatening, abusive, discriminatory, or inappropriate way. Do not access spaces, items, or information that are unrelated to the task.",
    ],
    bullets: [
      "Use reasonable care to avoid damage to property.",
      "Do not bring unauthorized people to the task location.",
      "Refuse and report any task that appears illegal, unsafe, or materially different from what was described.",
    ],
  },
  {
    title: "Keep work and payment on the platform",
    paragraphs: [
      "If the task originated on ExtraHand, do not try to move it off-platform in a way that bypasses the platform's booking or payment flow. Doing so can create disputes, reduce transparency, and violate platform rules.",
      "Taskers should not ask Posters for cash payments or side arrangements when the task is meant to be handled through ExtraHand's supported online flow.",
    ],
    bullets: [
      "Do not use off-platform arrangements to avoid the platform fee.",
      "Do not pressure Posters to pay outside the supported process.",
      "Do not misuse contact information obtained through the platform.",
    ],
  },
  {
    title: "Complete the task clearly and honestly",
    paragraphs: [
      "Before marking a task complete, make sure the agreed work has actually been done. If there are limitations, delays, or follow-up requirements, explain them honestly instead of leaving the customer uncertain.",
      "Where applicable, provide completion updates, photos, or proof of work so the Poster can review the outcome clearly.",
    ],
    bullets: [
      "Confirm completion with the Poster when the work is finished.",
      "Do not submit false proof, misleading updates, or incomplete work as completed.",
      "Remain polite in follow-up communication until the task is resolved.",
    ],
  },
  {
    title: "Protect your standing on ExtraHand",
    paragraphs: [
      "Your conduct, punctuality, communication quality, cancellations, ratings, and reviews all affect your reputation on the platform. Consistent professionalism helps you win more work and remain in good standing.",
      "Repeated cancellations, poor conduct, false KYC details, unsafe behavior, review manipulation, fraud, or serious customer complaints may lead to reduced visibility, penalties, payout adjustments, suspension, or permanent removal from the platform.",
    ],
  },
];

export default function TaskerGuidelinesPage() {
  return (
    <main className="min-h-screen bg-white text-secondary-900">
      <div className="mx-auto max-w-4xl px-5 py-12 md:px-8 md:py-16">
        <header className="mb-10">
          <h1 className="text-3xl font-bold text-secondary-900 md:text-4xl">
            Tasker Guidelines
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-7 text-secondary-600">
            These guidelines explain the working standards expected from
            Taskers on ExtraHand. They are meant to help you deliver tasks
            safely, communicate clearly, and build lasting trust with Posters.
          </p>
        </header>

        <div className="space-y-8">
          {sections.map((section) => (
            <section
              key={section.title}
              className="border-t border-secondary-200 py-8"
            >
              <h2 className="text-2xl font-semibold text-secondary-900">
                {section.title}
              </h2>
              <div className="mt-4 space-y-4">
                {section.paragraphs.map((paragraph) => (
                  <p
                    key={paragraph}
                    className="leading-7 text-secondary-600"
                  >
                    {paragraph}
                  </p>
                ))}
              </div>

              {"bullets" in section && section.bullets ? (
                <ul className="mt-4 space-y-3 text-secondary-600">
                  {section.bullets.map((item) => (
                    <li key={item} className="flex gap-3 leading-7">
                      <span className="mt-3 size-1.5 shrink-0 rounded-full bg-primary-500" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              ) : null}
            </section>
          ))}

          <section className="border-t border-secondary-200 py-8">
            <h2 className="text-2xl font-semibold text-secondary-900">
              Read with the rest of the platform rules
            </h2>
            <p className="mt-4 leading-7 text-secondary-600">
              These guidelines should be read together with the{" "}
              <Link
                href="/tasker-agreement"
                className="font-semibold text-primary-700 hover:underline"
              >
                Tasker Agreement
              </Link>
              ,{" "}
              <Link
                href="/terms-and-conditions"
                className="font-semibold text-primary-700 hover:underline"
              >
                Terms and Conditions
              </Link>
              , and{" "}
              <Link
                href="/community-guidelines"
                className="font-semibold text-primary-700 hover:underline"
              >
                Community Guidelines
              </Link>
              .
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
