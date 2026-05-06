import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About Us | ExtraHand",
  description:
    "Learn about ExtraHand, the local-services marketplace from Naipunya AI Labs Private Limited.",
};

const values = [
  "Clear task details before work begins",
  "Verified Helpers for safer local services",
  "Transparent pricing and online payments",
  "Support for task updates, issues, and disputes",
  "Ratings and reviews that help users make better decisions",
  "A platform built for both customers and local service providers",
];

const steps = [
  "A Poster shares the task details, location, timing, and budget.",
  "Available Helpers can review the requirement and apply or accept based on fit.",
  "Both sides can communicate about the work before the task starts.",
  "Payment and completion updates are handled through the platform.",
  "After completion, reviews help build accountability and trust.",
];

export default function AboutUsPage() {
  return (
    <main className="min-h-screen bg-white text-secondary-900">
      <div className="mx-auto max-w-4xl px-5 py-12 md:px-8 md:py-16">
        <header className="mb-10">
          <h1 className="text-3xl font-bold text-secondary-900 md:text-4xl">
            About ExtraHand
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-7 text-secondary-600 md:text-lg">
            ExtraHand is a local-services marketplace operated by Naipunya AI
            Labs Private Limited. We connect people who need help with
            independent Helpers who can complete everyday tasks reliably.
          </p>
          <p className="mt-4 max-w-3xl leading-7 text-secondary-600">
            The idea is simple: when someone needs extra help, they should be
            able to explain the work clearly, find a suitable person nearby,
            and manage the task without confusion. ExtraHand brings that
            process into one organized platform.
          </p>
        </header>

        <section className="border-t border-secondary-200 py-8">
          <h2 className="text-2xl font-semibold text-secondary-900">
            What We Do
          </h2>
          <p className="mt-4 leading-7 text-secondary-600">
            ExtraHand helps Posters share their requirements, set a budget, and
            find suitable Helpers nearby. Helpers can discover work, communicate
            with customers, complete tasks, and build trust through their
            profile and reviews.
          </p>
          <p className="mt-4 leading-7 text-secondary-600">
            The platform supports a wide range of everyday needs such as home
            services, repairs, delivery support, cleaning, moving, business
            assistance, event help, and other local tasks. ExtraHand does not
            perform the task directly; it provides the technology and support
            flow that helps Posters and Helpers connect more confidently.
          </p>
        </section>

        <section className="border-t border-secondary-200 py-8">
          <h2 className="text-2xl font-semibold text-secondary-900">
            Who We Serve
          </h2>
          <p className="mt-4 leading-7 text-secondary-600">
            ExtraHand is for Posters who want dependable help without relying
            only on word of mouth, repeated phone calls, or unclear pricing. A
            Poster can describe the task, compare options, communicate with
            Helpers, and keep track of the work in one place.
          </p>
          <p className="mt-4 leading-7 text-secondary-600">
            ExtraHand is also for Helpers who want access to nearby work
            opportunities. Skilled individuals can use the platform to show
            their experience, respond to relevant tasks, complete work
            professionally, and grow their reputation over time.
          </p>
        </section>

        <section className="border-t border-secondary-200 py-8">
          <h2 className="text-2xl font-semibold text-secondary-900">
            Our Mission
          </h2>
          <p className="mt-4 leading-7 text-secondary-600">
            Our mission is to make local services easier, safer, and more
            transparent. We want customers to get dependable help without
            confusion, and we want skilled people to access fair earning
            opportunities in their area.
          </p>
          <p className="mt-4 leading-7 text-secondary-600">
            We are building ExtraHand around clarity, accountability, and
            practical convenience. Every feature is meant to reduce friction:
            clear descriptions, verified profiles, online payments, task status
            updates, and support when something needs attention.
          </p>
        </section>

        <section className="border-t border-secondary-200 py-8">
          <h2 className="text-2xl font-semibold text-secondary-900">
            How ExtraHand Works
          </h2>
          <ol className="mt-4 space-y-3 text-secondary-600">
            {steps.map((step, index) => (
              <li key={step} className="flex gap-3 leading-7">
                <span className="mt-0.5 font-semibold text-primary-700">
                  {index + 1}.
                </span>
                <span>{step}</span>
              </li>
            ))}
          </ol>
        </section>

        <section className="border-t border-secondary-200 py-8">
          <h2 className="text-2xl font-semibold text-secondary-900">
            Why ExtraHand
          </h2>
          <ul className="mt-4 space-y-3 text-secondary-600">
            {values.map((value) => (
              <li key={value} className="flex gap-3 leading-7">
                <span className="mt-3 size-1.5 shrink-0 rounded-full bg-primary-500" />
                <span>{value}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="border-t border-secondary-200 py-8">
          <h2 className="text-2xl font-semibold text-secondary-900">
            Trust and Safety
          </h2>
          <p className="mt-4 leading-7 text-secondary-600">
            Trust is important because many tasks happen in homes, offices, and
            personal spaces. ExtraHand focuses on identity verification,
            transparent profiles, reviews, secure payment handling, and support
            processes so users can make informed choices.
          </p>
          <p className="mt-4 leading-7 text-secondary-600">
            We also encourage clear communication before the task begins:
            scope, time, location, expected outcome, and materials should be
            discussed openly. This helps avoid misunderstandings and gives both
            Posters and Helpers a better experience.
          </p>
        </section>

        <section className="border-t border-secondary-200 py-8">
          <h2 className="text-2xl font-semibold text-secondary-900">
            Built in India
          </h2>
          <p className="mt-4 leading-7 text-secondary-600">
            ExtraHand is built for everyday local needs in India, with a focus
            on practical service discovery, clear communication, secure
            payments, and better accountability between Posters and Helpers.
          </p>
          <p className="mt-4 leading-7 text-secondary-600">
            We understand that local work is personal. A small repair, a home
            cleaning task, a pickup, or business support can affect someone&apos;s
            day directly. Our aim is to make these everyday services simpler to
            arrange and easier to trust.
          </p>
        </section>

        <section className="border-t border-secondary-200 py-8">
          <h2 className="text-2xl font-semibold text-secondary-900">
            Our Long-Term Goal
          </h2>
          <p className="mt-4 leading-7 text-secondary-600">
            We want ExtraHand to become a dependable local-services network
            where people can find help quickly and skilled workers can build
            stable earning opportunities. As the platform grows, we will
            continue improving verification, payments, support, task matching,
            and user protection.
          </p>
        </section>

        <footer className="border-t border-secondary-200 pt-8">
          <p className="text-secondary-600">
            Have questions?{" "}
            <Link
              href="/contact"
              className="font-semibold text-primary-700 hover:underline"
            >
              Contact ExtraHand
            </Link>
          </p>
        </footer>
      </div>
    </main>
  );
}
