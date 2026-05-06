import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Community Guidelines | ExtraHand",
  description:
    "Guidelines for safe and respectful behavior on the ExtraHand platform.",
};

const guidelineSections = [
  {
    title: "Respect every person on the platform",
    paragraphs: [
      "ExtraHand is built on trust, respect, and practical cooperation. Posters and Helpers should treat each other with courtesy in all messages, calls, and in-person interactions.",
      "Harassment, abuse, intimidation, threats, hate speech, discrimination, or humiliating behavior are not acceptable. This applies to behavior based on race, caste, religion, nationality, gender, age, disability, sexual orientation, or any other protected characteristic.",
    ],
  },
  {
    title: "Be honest in profiles and task details",
    paragraphs: [
      "Users must provide truthful and accurate information about who they are, what they need, and what they can do. Posters should describe the task clearly, including timing, location, materials, and special requirements. Helpers should not misrepresent their skills, experience, identity, or availability.",
      "Honesty helps avoid disputes and protects the quality of the marketplace for everyone.",
    ],
  },
  {
    title: "Communicate clearly and professionally",
    paragraphs: [
      "Keep communication relevant to the task. Be clear about expectations, budget, deliverables, access requirements, timelines, and any changes to the work.",
      "Do not use ExtraHand to send spam, solicit unrelated services, pressure users into personal relationships, or communicate in a way that makes others feel unsafe.",
    ],
  },
  {
    title: "Protect safety during real-world tasks",
    paragraphs: [
      "Many tasks happen in homes, offices, shops, and personal spaces. Posters should provide a safe and appropriate environment for work. Helpers should behave professionally and avoid any conduct that could put people, property, or themselves at risk.",
      "If a task appears unsafe, illegal, or materially different from what was described, users should pause and report the issue instead of continuing.",
    ],
  },
  {
    title: "Respect privacy and personal data",
    paragraphs: [
      "Only use personal information for the purpose of completing the task and communicating about the service. Do not share another user's phone number, address, documents, photos, or personal details without consent.",
      "Users should avoid requesting unnecessary personal information and should respect the platform's privacy and verification processes.",
    ],
  },
  {
    title: "Do not misuse the platform",
    paragraphs: [
      "Fraud, fake bookings, misleading payment claims, chargeback abuse, review manipulation, impersonation, and attempts to exploit the platform are prohibited.",
      "Users must not upload harmful content, introduce malware, scrape platform data, attempt unauthorized access, or use ExtraHand in connection with unlawful activity.",
    ],
  },
  {
    title: "Keep payments and task handling transparent",
    paragraphs: [
      "Users should use the platform workflow wherever required and communicate openly about the agreed task amount, completion status, and any concerns about quality or scope.",
      "Attempts to create confusion around payment, task completion, or refund eligibility can damage trust and may lead to enforcement action.",
    ],
  },
  {
    title: "Use reviews responsibly",
    paragraphs: [
      "Reviews should reflect real experiences and should be fair, relevant, and truthful. Do not threaten someone with a bad review to force an outcome, and do not post false or defamatory statements.",
      "Ratings and reviews are an important trust signal for the community, so they must not be manipulated.",
    ],
  },
];

export default function CommunityGuidelinesPage() {
  return (
    <main className="min-h-screen bg-white text-secondary-900">
      <div className="mx-auto max-w-4xl px-5 py-12 md:px-8 md:py-16">
        <header className="mb-10">
          <h1 className="text-3xl font-bold text-secondary-900 md:text-4xl">
            Community Guidelines
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-7 text-secondary-600">
            These guidelines explain the behavior expected from everyone using
            ExtraHand. They are intended to help Posters and Helpers interact
            safely, professionally, and fairly.
          </p>
        </header>

        <div className="space-y-8">
          {guidelineSections.map((section) => (
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
            </section>
          ))}

          <section className="border-t border-secondary-200 py-8">
            <h2 className="text-2xl font-semibold text-secondary-900">
              Reporting and enforcement
            </h2>
            <p className="mt-4 leading-7 text-secondary-600">
              If you see behavior that violates these guidelines, report it to
              support@extrahand.in as soon as possible with the relevant
              details. Depending on the seriousness of the issue, ExtraHand may
              issue a warning, restrict features, suspend the account, remove
              content, or permanently disable access to the platform.
            </p>
            <p className="mt-4 leading-7 text-secondary-600">
              In serious cases involving fraud, threats, illegal conduct, or
              harm to people or property, ExtraHand may also share information
              with law enforcement or relevant authorities where required.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
