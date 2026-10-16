"use client";

import Image from "next/image";
import {
  ArrowRight,
  CalendarClock,
  ShieldCheck,
  ShoppingCart,
  Sparkles,
  Wrench,
} from "lucide-react";
import type { Category } from "@/types/category";
import {
  APP_STORE_URL,
  PLAY_STORE_URL,
  openAppOrStore,
} from "@/lib/openAppBridge";

interface BookNowClientProps {
  categories: Category[];
  catalogError?: boolean;
}

const categoryImageFallbacks: Array<[RegExp, string]> = [
  [/clean|housekeeping|sofa|mattress|bathroom/i, "/assets/mobilescreens/cleaning.webp"],
  [/ac|air.condition|heating|cooling|appliance|repair|computer|it/i, "/assets/mobilescreens/tech.webp"],
  [/electric|wiring/i, "/assets/mobilescreens/electrical.webp"],
  [/plumb|water|tanker/i, "/assets/mobilescreens/plumbing.webp"],
  [/pest|garden|pet/i, "/assets/mobilescreens/home.webp"],
  [/moving|removal|pack/i, "/assets/mobilescreens/moving.webp"],
  [/paint/i, "/assets/mobilescreens/painting.webp"],
  [/furniture|carpenter|mount/i, "/assets/mobilescreens/furniture.webp"],
];

const bookNowCategoryImages: Record<string, string> = {
  "Hourly Based Services": "/assets/Book-now/hourly-based.png",
  "Home Cleaning": "/assets/Book-now/fullhouse-booknow.jpg",
  "AC Services": "/assets/Book-now/acrepair-booknow.jpg",
  "Appliance Repair": "/assets/Book-now/wachingmachinecheckup-booknow.jpg",
  "Personal Assistance": "/assets/Book-now/personal-assistance_card.jpg",
  "Pest Control": "/assets/Book-now/Pest-Control_card.webp",
  Electrician: "/assets/Book-now/electrician-switch-socket.png",
  Plumbing: "/assets/Book-now/plumbing-tap-mixer.jpg",
};

function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function getCategoryImage(category: Category): string {
  const bookNowImage = bookNowCategoryImages[category.name.trim()];
  if (bookNowImage) return bookNowImage;

  const source = (category.heroImage || "").trim();
  if (source) return source;

  const match = categoryImageFallbacks.find(([pattern]) =>
    pattern.test(`${category.name} ${category.slug}`)
  );
  return match?.[1] || "/assets/mobilescreens/handy.webp";
}

function ServiceCategoryImage({ category }: { category: Category }) {
  const fallback = getCategoryImage({ ...category, heroImage: "" });
  const image = getCategoryImage(category);
  const key = `${category.slug}:${image}`;

  return (
    <div className="relative aspect-[3/2] w-full overflow-hidden bg-gradient-to-br from-primary-100 via-amber-50 to-orange-100">
      {/* Fill the frame behind the fully visible image to avoid empty side bars. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={image}
        alt=""
        aria-hidden="true"
        className="absolute inset-0 h-full w-full scale-110 object-cover opacity-30 blur-xl"
      />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        key={key}
        src={image}
        alt=""
        aria-hidden="true"
        className="absolute inset-0 h-full w-full object-contain transition-transform duration-300 group-hover:scale-[1.02]"
        onError={(event) => {
          const target = event.currentTarget;
          if (target.src.endsWith(fallback)) {
            target.style.display = "none";
            return;
          }
          target.src = fallback;
        }}
      />
    </div>
  );
}

export default function BookNowClient({
  categories,
  catalogError = false,
}: BookNowClientProps) {
  return (
    <main className="min-h-screen bg-white">
      <section className="relative isolate overflow-hidden bg-gradient-to-br from-[#fff8e5] via-[#fffdf7] to-[#fff0df]">
        <div className="pointer-events-none absolute -right-20 -top-24 h-80 w-80 rounded-full bg-primary-200/40 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-36 -left-24 h-80 w-80 rounded-full bg-orange-200/30 blur-3xl" />
        <div className="relative mx-auto grid max-w-7xl items-center gap-10 px-4 py-14 sm:px-6 sm:py-20 lg:grid-cols-[1.1fr_0.9fr] lg:px-8 lg:py-24">
          <div>
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-primary-200 bg-white/80 px-3.5 py-2 text-xs font-bold uppercase tracking-[0.14em] text-primary-800 shadow-sm">
              <Sparkles className="h-4 w-4" />
              A little help goes a long way
            </div>
            <h1 className="max-w-3xl text-4xl font-extrabold leading-[1.08] tracking-tight text-secondary-900 sm:text-5xl lg:text-[3.65rem]">
              Book Trusted Home Services with{" "}
              <span className="text-primary-600">ExtraHand</span>
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-secondary-600 sm:text-lg">
              From everyday fixes to a fresh, clean home, find the right
              professional for your task. Browse services, then finish your
              booking securely in the ExtraHand app.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <a
                href={PLAY_STORE_URL}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Get ExtraHand on Google Play"
                className="inline-flex min-h-14 items-center gap-3 rounded-xl bg-black px-4 py-2.5 text-white shadow-md transition hover:-translate-y-0.5 hover:bg-secondary-900"
              >
                <svg
                  aria-hidden="true"
                  width="28"
                  height="28"
                  viewBox="0 0 36 36"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <polygon points="3,2 33,18 3,34" fill="#34A853" />
                  <polygon points="3,2 19,18 3,34" fill="#FBBC05" />
                  <polygon points="19,18 33,18 3,34" fill="#EA4335" />
                </svg>
                <span className="flex flex-col text-left leading-tight">
                  <span className="text-[10px]">GET IT ON</span>
                  <span className="text-base font-semibold">Google Play</span>
                </span>
              </a>
              <a
                href={APP_STORE_URL}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Download ExtraHand on the App Store"
                className="inline-flex min-h-14 items-center gap-3 rounded-xl bg-black px-4 py-2.5 text-white shadow-md transition hover:-translate-y-0.5 hover:bg-secondary-900"
              >
                <svg
                  aria-hidden="true"
                  width="28"
                  height="28"
                  viewBox="0 0 28 28"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M21.7 14.7c-.1-2.1 1.7-3.1 1.8-3.2-1-1.5-2.6-1.7-3.1-1.7-1.3-.1-2.5.8-3.1.8-.6 0-1.6-.8-2.7-.8-1.4.1-2.7.8-3.4 2-1.5 2.6-.4 6.4 1.1 8.5.7 1 1.5 2.1 2.6 2.1 1 0 1.3-.7 2.6-.7s1.6.7 2.7.7c1.1 0 1.8-1 2.5-2 .8-1.1 1.1-2.2 1.1-2.3 0-.1-2.1-.8-2.1-3.2zm-2-6c.6-.7 1-1.7.9-2.7-.9.1-2 .6-2.6 1.3-.6.6-1.1 1.6-.9 2.5 1 .1 2-.5 2.6-1.1z"
                    fill="white"
                  />
                </svg>
                <span className="flex flex-col text-left leading-tight">
                  <span className="text-[10px]">Download on the</span>
                  <span className="text-base font-semibold">App Store</span>
                </span>
              </a>
            </div>
            <div className="mt-6 flex flex-wrap items-center gap-2">
              <span className="mr-1 text-xs font-bold uppercase tracking-[0.14em] text-secondary-600">
                Live in
              </span>
              {["Hyderabad", "Siddipet", "Mahabubnagar"].map((city) => (
                <span
                  key={city}
                  className="rounded-full border border-secondary-200 bg-white/80 px-3.5 py-2 text-sm font-semibold text-secondary-800"
                >
                  {city}
                </span>
              ))}
            </div>
          </div>
          <div className="relative mx-auto w-full max-w-xl">
            <div className="absolute -inset-4 rounded-[2rem] bg-gradient-to-br from-primary-200/70 to-orange-100/70 blur-xl" />
            <div className="relative overflow-hidden rounded-[1.75rem] border border-white bg-white p-3 shadow-2xl shadow-secondary-900/10">
              <div className="relative aspect-[4/3] overflow-hidden rounded-[1.25rem] bg-gradient-to-br from-primary-100 to-orange-100">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/assets/Book-now/hero.png"
                  alt="Book trusted home services with ExtraHand"
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-x-4 bottom-4 rounded-2xl border border-white/70 bg-white/95 p-4 shadow-lg backdrop-blur sm:inset-x-5 sm:bottom-5">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wider text-primary-700">
                        Your home, taken care of
                      </p>
                      <p className="mt-1 text-lg font-bold text-secondary-900">
                        Help is just a tap away
                      </p>
                    </div>
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary-100 text-primary-700">
                      <ShieldCheck className="h-6 w-6" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl space-y-16 px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        {catalogError ? (
          <section
            id="services"
            role="alert"
            className="rounded-3xl border border-semantic-error-500/30 bg-red-50 px-6 py-12 text-center"
          >
            <h2 className="text-2xl font-bold text-secondary-900">
              We couldn&apos;t load services
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-secondary-600">
              Please try again in a moment. Your available services and prices
              are shown in the ExtraHand app.
            </p>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-primary-600 px-5 py-3 font-bold text-white transition hover:bg-primary-700"
            >
              Try again <ArrowRight className="h-4 w-4" />
            </button>
          </section>
        ) : categories.length === 0 ? (
          <section
            id="services"
            className="rounded-3xl border border-secondary-200 bg-secondary-50 px-6 py-12 text-center"
          >
            <h2 className="text-2xl font-bold text-secondary-900">
              No services are available yet
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-secondary-600">
              There are no published service categories to browse right now.
              Please check again soon or browse in the ExtraHand app.
            </p>
            <button
              type="button"
              onClick={() => openAppOrStore()}
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-primary-600 px-5 py-3 font-bold text-white transition hover:bg-primary-700"
            >
              Open ExtraHand <ArrowRight className="h-4 w-4" />
            </button>
          </section>
        ) : (
          <>
            <section id="services" aria-labelledby="popular-services-heading">
              <div className="mb-6">
                <p className="mb-2 text-sm font-bold uppercase tracking-[0.14em] text-primary-700">
                  Customer favourites
                </p>
                <h2
                  id="popular-services-heading"
                  className="text-2xl font-extrabold tracking-tight text-secondary-900 sm:text-3xl"
                >
                  Popular Services
                </h2>
                <p className="mt-2 text-secondary-600">
                  Choose a service to continue your booking in the app.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-5 lg:grid-cols-4">
                {categories.map((category) => {
                  return (
                    <article
                      key={category.slug}
                      id={`category-${slugify(category.slug)}`}
                      className="group overflow-hidden rounded-2xl border border-secondary-200 bg-white shadow-sm transition hover:-translate-y-1 hover:border-primary-300 hover:shadow-lg"
                    >
                      <div className="overflow-hidden">
                        <ServiceCategoryImage category={category} />
                      </div>
                      <div className="p-3.5 sm:p-4">
                        <h3 className="min-h-10 text-sm font-bold text-secondary-900 sm:text-base">
                          {category.name}
                        </h3>
                      </div>
                    </article>
                  );
                })}
              </div>
            </section>

            <section
              aria-labelledby="how-it-works-heading"
              className="relative overflow-hidden rounded-3xl border border-primary-100 bg-gradient-to-br from-[#fffaf0] via-white to-[#fff5e4] px-5 py-10 shadow-sm sm:px-8 sm:py-14"
            >
              <div className="pointer-events-none absolute -right-16 -top-20 h-64 w-64 rounded-full bg-primary-200/30 blur-3xl" />
              <div className="relative mx-auto max-w-6xl">
                <div className="text-center">
                  <p className="mb-2 text-xs font-extrabold uppercase tracking-[0.18em] text-primary-700 sm:text-sm">
                    A simple 3-step process
                  </p>
                  <h2
                    id="how-it-works-heading"
                    className="text-2xl font-extrabold tracking-tight text-secondary-900 sm:text-3xl"
                  >
                    How It Works
                  </h2>
                  <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-secondary-600 sm:text-base">
                    From choosing a service to confirming your booking, ExtraHand
                    keeps it straightforward.
                  </p>
                </div>
                <div className="relative mt-9 grid gap-4 sm:mt-12 sm:grid-cols-3 sm:gap-5">
                  <div
                    aria-hidden="true"
                    className="absolute left-[17%] right-[17%] top-8 hidden h-px bg-gradient-to-r from-primary-200 via-primary-400 to-primary-200 sm:block"
                  />
                  {[
                    {
                      number: "01",
                      title: "Choose your service",
                      description:
                        "Pick the home service that matches what you need.",
                      icon: Wrench,
                      image: "/assets/Book-now/step1.jpeg",
                    },
                    {
                      number: "02",
                      title: "Add to cart",
                      description:
                        "Add your chosen service to the cart and review your selections.",
                      icon: ShoppingCart,
                      image: "/assets/Book-now/step2.jpeg",
                    },
                    {
                      number: "03",
                      title: "Select a slot & pay",
                      description:
                        "Choose a convenient time slot, confirm your details, and pay securely.",
                      icon: CalendarClock,
                      image: "/assets/Book-now/step3.jpeg",
                    },
                  ].map((step) => (
                    <div
                      key={step.number}
                      className="relative overflow-hidden rounded-2xl border border-secondary-200/80 bg-white/90 p-3 shadow-sm transition hover:-translate-y-1 hover:border-primary-300 hover:shadow-md sm:p-4"
                    >
                      <div className="relative aspect-[3/4] overflow-hidden rounded-xl bg-[#fff9e9]">
                        <Image
                          src={step.image}
                          alt={`${step.title} - ExtraHand booking step ${step.number}`}
                          fill
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          className="object-contain"
                        />
                        <span className="absolute left-3 top-3 flex h-10 w-10 items-center justify-center rounded-xl bg-primary-500 font-extrabold text-secondary-900 shadow-md">
                          {step.number}
                        </span>
                      </div>
                      <div className="p-2 pt-4 sm:p-3">
                        <div className="flex items-start gap-3">
                          <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary-100 text-primary-700">
                            <step.icon className="h-5 w-5" aria-hidden="true" />
                          </span>
                          <div>
                            <p className="text-[11px] font-extrabold uppercase tracking-[0.14em] text-primary-700">
                              Step {step.number}
                            </p>
                            <h3 className="mt-1 text-base font-extrabold text-secondary-900 sm:text-lg">
                              {step.title}
                            </h3>
                            <p className="mt-2 text-sm leading-6 text-secondary-600">
                              {step.description}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-7 flex items-center justify-center gap-2 text-center text-xs font-medium text-secondary-500 sm:mt-8 sm:text-sm">
                  <ShieldCheck className="h-4 w-4 shrink-0 text-primary-600" />
                  <span>Choose services and complete your booking in the ExtraHand app.</span>
                </div>
              </div>
            </section>
          </>
        )}
      </div>
    </main>
  );
}
