import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Success Stories | ExtraHand",
  description:
    "Read success stories from task posters and taskers using ExtraHand.",
};

const stories = [
  {
    name: "Ananya R.",
    role: "Task poster",
    photo:
      "https://ui-avatars.com/api/?name=Ananya+R&background=FDE68A&color=92400E&size=128",
    taskType: "Electrical repair",
    location: "Bengaluru",
    summary:
      "I posted an urgent wiring issue in the morning and got matched with a verified electrician quickly. The repair was completed safely before evening.",
    outcome: "Booked in 40 minutes; issue resolved same day",
  },
  {
    name: "Rahul and Priya S.",
    role: "Task posters",
    photo:
      "https://ui-avatars.com/api/?name=Rahul+Priya&background=DBEAFE&color=1E3A8A&size=128",
    taskType: "Home shifting",
    location: "Pune",
    summary:
      "We coordinated packing and moving support for a two-bedroom home. The taskers arrived on time, handled fragile items well, and completed the move as planned.",
    outcome: "Completed relocation in one weekend",
  },
  {
    name: "Sandeep Kumar",
    role: "Tasker",
    photo:
      "https://ui-avatars.com/api/?name=Sandeep+Kumar&background=DCFCE7&color=166534&size=128",
    taskType: "General home services",
    location: "Hyderabad",
    summary:
      "I started with small nearby jobs, communicated clearly, and followed through on timelines. Good reviews helped me build repeat clients month after month.",
    outcome: "Grew repeat bookings steadily over 3 months",
  },
];

export default function SuccessStoriesPage() {
  return (
    <div className="min-h-screen bg-linear-to-b from-amber-50 via-white to-slate-50">
      <section className="relative overflow-hidden border-b border-amber-100/70">
        <div className="pointer-events-none absolute -left-16 top-10 h-52 w-52 rounded-full bg-amber-200/40 blur-3xl" />
        <div className="pointer-events-none absolute -right-12 bottom-6 h-48 w-48 rounded-full bg-sky-200/40 blur-3xl" />

        <div className="container mx-auto max-w-6xl px-4 py-12 md:py-16">
          <p className="inline-flex items-center rounded-full border border-amber-200 bg-white/90 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-amber-700">
            Real outcomes from real users
          </p>
          <h1 className="mt-4 max-w-3xl text-3xl font-bold leading-tight text-slate-900 md:text-5xl">
            Success Stories That Show How Fast Local Help Can Work
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600 md:text-lg">
            Real examples of how posters and taskers use ExtraHand to get work done faster, safer, and with more confidence.
          </p>
          <p className="mt-6 text-sm font-medium text-slate-500">
            Detailed testimonials with names, photos, task type, and outcomes.
          </p>
        </div>
      </section>

      <div className="container mx-auto max-w-6xl px-4 py-10 md:py-14">
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {stories.map((story) => (
            <article
              key={`${story.name}-${story.taskType}`}
              className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="mb-5 flex items-start gap-3">
                <img
                  src={story.photo}
                  alt={`${story.name} profile photo`}
                  className="h-12 w-12 rounded-full border border-slate-200 object-cover"
                  loading="lazy"
                  referrerPolicy="no-referrer"
                />
                <div>
                  <p className="text-sm font-semibold text-slate-900">{story.name}</p>
                  <p className="text-xs text-slate-500">{story.role}</p>
                </div>
              </div>

              <div className="mb-4 flex items-center justify-between gap-3">
                <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-800">
                  {story.taskType}
                </span>
                <span className="text-xs font-medium text-slate-500">{story.location}</span>
              </div>

              <p className="mt-3 text-sm leading-6 text-slate-600">{story.summary}</p>

              <div className="mt-5 rounded-xl bg-slate-50 px-3 py-2 text-sm font-medium text-slate-700">
                Outcome: {story.outcome}
              </div>
            </article>
          ))}
        </div>

        <section className="mt-10 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
          <h2 className="text-2xl font-semibold text-slate-900">Ready for your own success story?</h2>
          <p className="mt-3 max-w-2xl text-slate-600">
            Post a task in minutes or start offering services in your city. ExtraHand helps both sides move from search to completion with less friction.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Link
              href="/post-task"
              className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              Post a Task
            </Link>
            <Link
              href="/services"
              className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-800 transition hover:border-slate-400"
            >
              Explore Services
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
