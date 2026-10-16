"use client";

export default function BookNowError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="flex min-h-[60vh] items-center justify-center px-4 py-16">
      <div className="max-w-lg text-center">
        <h1 className="text-2xl font-extrabold text-secondary-900">
          We couldn&apos;t load services
        </h1>
        <p className="mt-3 text-secondary-600">
          Please try again. You can also browse currently available services
          directly in the ExtraHand app.
        </p>
        <button
          type="button"
          onClick={reset}
          className="mt-6 rounded-xl bg-primary-600 px-5 py-3 font-bold text-white transition hover:bg-primary-700"
        >
          Try again
        </button>
      </div>
    </main>
  );
}
