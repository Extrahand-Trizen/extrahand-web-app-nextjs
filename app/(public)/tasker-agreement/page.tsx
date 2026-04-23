import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Tasker Agreement | ExtraHand",
  description:
    "Terms and conditions applicable to Taskers on the ExtraHand marketplace.",
};

const sections = [
  {
    title: "1. Scope of this agreement",
    paragraphs: [
      "This Tasker Agreement applies to your use of ExtraHand as a Tasker. It should be read together with the Terms and Conditions, Privacy Policy, Refund Policy, and Community Guidelines that govern the platform more broadly.",
      "By using ExtraHand as a Tasker, you agree to follow this Agreement and all related platform rules that apply to service providers using the marketplace.",
    ],
  },
  {
    title: "2. Independent service provider status",
    paragraphs: [
      "ExtraHand is a technology platform that connects Posters with independent Taskers. Nothing in this Agreement creates an employer-employee relationship, partnership, agency, or joint venture between you and Naipunya AI Labs Private Limited.",
      "You act as an independent service provider and remain responsible for your own work, conduct, taxes, tools, permits, legal compliance, and service quality.",
    ],
  },
  {
    title: "3. Eligibility and KYC",
    paragraphs: [
      "To operate as a Tasker on ExtraHand, you must be at least 18 years old, legally capable of contracting, and able to provide accurate and current information about yourself and your services.",
      "Under the platform rules, Taskers are required to complete mandatory Aadhaar-based KYC before they are permitted to accept or perform tasks on the platform. Your account may also be restricted from receiving payouts until the required verification is completed successfully.",
    ],
    bullets: [
      "You must not submit false or misleading identity information.",
      "You must keep your bank and payout details current.",
      "Failure to complete required verification may lead to suspension or deactivation.",
    ],
  },
  {
    title: "4. Your responsibilities as a Tasker",
    paragraphs: [
      "You are responsible for performing accepted tasks with due skill, care, professionalism, and reasonable safety practices. You must respect the customer's property, privacy, and instructions while carrying out the work.",
      "You must also comply with applicable laws, licensing requirements, tax obligations, and any professional standards relevant to the type of service you provide.",
    ],
    bullets: [
      "Accept only tasks you are qualified and able to complete.",
      "Do not engage in fraud, abuse, harassment, discrimination, or illegal conduct.",
      "Do not manipulate reviews, completion proofs, or task status.",
      "Do not misuse customer information or attempt unauthorized access to property or accounts.",
    ],
  },
  {
    title: "5. Platform use, payments, and fee deductions",
    paragraphs: [
      "Tasks that originate on ExtraHand must be handled in accordance with the platform workflow. The Customer pays the task amount through supported online payment flow, and ExtraHand processes the payout to the Tasker according to the applicable platform rules.",
      "Under the current platform terms, ExtraHand deducts a platform fee of 5% of the task amount before remitting the Tasker payout, and GST applies on that platform fee component. Payouts may be released only after task completion, the applicable dispute window, and any required checks.",
      "Where refunds, cancellations, dispute adjustments, penalties, or compliance holds apply, the relevant amount may be adjusted against your current or future payouts in accordance with platform policy.",
    ],
    bullets: [
      "Do not request cash or off-platform payment for platform-originated tasks.",
      "Do not try to bypass the platform fee through side arrangements.",
      "Payout timing may vary based on banking, verification, refund, or dispute review processes.",
    ],
  },
  {
    title: "6. Cancellations, reviews, and account standing",
    paragraphs: [
      "You are expected to honor confirmed commitments. Repeated cancellations, no-shows, late arrivals, poor communication, unsafe conduct, or low-quality performance may affect your visibility and access to future tasks.",
      "Customers may rate and review your work, and those ratings may be used to evaluate quality and platform standing. You agree not to manipulate reviews or pressure customers for favorable ratings.",
    ],
  },
  {
    title: "7. Suspension and termination",
    paragraphs: [
      "ExtraHand may suspend, restrict, or terminate your Tasker account where there is suspected fraud, false KYC information, abusive conduct, safety concerns, repeated cancellations, serious customer complaints, legal risk, or violation of this Agreement or other platform rules.",
      "You may stop using the platform at any time, but you remain responsible for obligations that arose before account closure, including active disputes, refunds, penalties, or payment adjustments that apply under the platform terms.",
    ],
  },
  {
    title: "8. Liability and related policies",
    paragraphs: [
      "Your use of ExtraHand as a Tasker is also subject to the broader limitation of liability, dispute resolution, and legal provisions contained in the Terms and Conditions. Where there is a conflict, the platform terms and applicable law will govern the relevant issue.",
      "This Agreement may be updated from time to time, and the latest version will be published on this page.",
    ],
  },
];

export default function TaskerAgreementPage() {
  return (
    <main className="min-h-screen bg-white text-secondary-900">
      <div className="mx-auto max-w-4xl px-5 py-12 md:px-8 md:py-16">
        <header className="mb-10">
          <h1 className="text-3xl font-bold text-secondary-900 md:text-4xl">
            Tasker Agreement
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-7 text-secondary-600">
            This page explains the core rules that apply when you use ExtraHand
            as a Tasker. It is intended to clarify your independent role,
            verification requirements, platform responsibilities, payment flow,
            and account expectations.
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
              Related documents and contact
            </h2>
            <p className="mt-4 leading-7 text-secondary-600">
              Please also review the{" "}
              <Link
                href="/terms-and-conditions"
                className="font-semibold text-primary-700 hover:underline"
              >
                Terms and Conditions
              </Link>
              ,{" "}
              <Link
                href="/privacy-policy"
                className="font-semibold text-primary-700 hover:underline"
              >
                Privacy Policy
              </Link>
              ,{" "}
              <Link
                href="/refund-policy"
                className="font-semibold text-primary-700 hover:underline"
              >
                Refund Policy
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
            <p className="mt-4 leading-7 text-secondary-600">
              For questions about your Tasker account, contact{" "}
              <a
                href="mailto:support@extrahand.in"
                className="font-semibold text-primary-700 hover:underline"
              >
                support@extrahand.in
              </a>
              .
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
