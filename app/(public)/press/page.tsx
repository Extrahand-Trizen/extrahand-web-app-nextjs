import type { Metadata } from "next";

const pressReleases = [
  {
    title: "ExtraHand Launches Android App",
    date: "April 17, 2026",
    summary:
      "ExtraHand officially launched its Android app, making it easier for users to get help, browse services, and connect with helpers on mobile devices.",
    href: "/press/releases/2026-04-17-android-app-launch.txt",
  },
  {
    title: "ExtraHand Officially Launches Marketplace Platform",
    date: "April 1, 2026",
    summary:
      "ExtraHand officially launched its platform for local services, enabling users to get help, discover verified helpers, and manage bookings more easily.",
    href: "/press/releases/2026-04-01-marketplace-platform-launch.txt",
  },
];

const brandAssets = [
  {
    name: "Primary Logo (WEBP)",
    href: "/logo.webp",
    fileName: "extrahand-logo-primary.webp",
  },
  {
    name: "Logo Variant (WEBP)",
    href: "/assets/images/logo.webp",
    fileName: "extrahand-logo-variant.webp",
  },
  {
    name: "ExtraHand Wordmark (WEBP)",
    href: "/assets/images/extrahand-logo.webp",
    fileName: "extrahand-wordmark.webp",
  },
];

export const metadata: Metadata = {
  title: "Press | ExtraHand",
  description:
    "Latest news, press releases, and media coverage about ExtraHand.",
};

export default function PressPage() {
  return (
    <div className="min-h-screen bg-linear-to-b from-slate-100 via-white to-amber-50">
      <div className="container mx-auto max-w-6xl px-4 py-8 md:py-12">
        <header className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:p-10">
          <p className="inline-flex rounded-full border border-slate-200 bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-slate-700">
            Media Center
          </p>
          <h1 className="mt-4 text-3xl font-bold text-slate-900 md:text-5xl">Press</h1>
          <p className="mt-4 max-w-3xl text-slate-600">
            Official press releases, media coverage references, and downloadable brand assets for editorial use.
          </p>
          <p className="mt-4 text-sm text-slate-700">
            Press contact: <a href="mailto:press@extrahand.in" className="font-semibold text-slate-900 hover:underline">press@extrahand.in</a>
          </p>
        </header>

        <section className="mt-8">
          <div className="mb-4 flex items-center justify-between gap-3">
            <h2 className="text-2xl font-semibold text-slate-900">Press Releases</h2>
            <span className="text-sm text-slate-500">Official announcements</span>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {pressReleases.map((release) => (
              <article key={release.title} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-amber-700">{release.date}</p>
                <h3 className="mt-2 text-lg font-semibold leading-snug text-slate-900">{release.title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">{release.summary}</p>
                <a href={release.href} className="mt-4 inline-flex text-sm font-semibold text-slate-900 hover:underline" download>
                  Download release
                </a>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-10 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-2xl font-semibold text-slate-900">Brand Kit & Downloads</h2>
            <a
              href="/press/media-kit/ExtraHand-Media-Kit.txt"
              className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800"
              download
            >
              Download media kit
            </a>
          </div>
          <p className="mt-3 text-slate-600">
            Download approved logos and brand references for press coverage. For custom asset requests, contact the press team.
          </p>

          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            {brandAssets.map((asset) => (
              <a
                key={asset.name}
                href={asset.href}
                download={asset.fileName}
                className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-800 transition hover:border-slate-300 hover:bg-white"
              >
                {asset.name}
              </a>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
