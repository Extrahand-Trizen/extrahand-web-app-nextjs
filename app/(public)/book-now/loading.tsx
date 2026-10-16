export default function BookNowLoading() {
  return (
    <main
      className="min-h-screen animate-pulse bg-white"
      aria-label="Loading services"
    >
      <div className="bg-primary-50 px-4 py-20 sm:px-6">
        <div className="mx-auto max-w-7xl">
          <div className="h-5 w-52 rounded bg-primary-100" />
          <div className="mt-6 h-12 max-w-2xl rounded bg-primary-100" />
          <div className="mt-4 h-5 max-w-xl rounded bg-primary-100" />
          <div className="mt-8 h-12 w-44 rounded-xl bg-primary-200" />
        </div>
      </div>
      <div className="mx-auto max-w-7xl space-y-8 px-4 py-12 sm:px-6">
        <div className="h-8 w-64 rounded bg-secondary-100" />
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {Array.from({ length: 8 }, (_, index) => (
            <div
              key={index}
              className="h-44 rounded-2xl bg-secondary-100"
            />
          ))}
        </div>
      </div>
    </main>
  );
}
