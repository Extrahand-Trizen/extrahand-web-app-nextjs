import { Suspense } from "react";
import { getApiBaseUrl } from "@/lib/config";
import type { TaskListResponse } from "@/types/task";
import { DiscoverClient } from "@/components/discover/DiscoverClient";

function DiscoverSkeleton() {
  return (
    <div className="min-h-screen bg-secondary-50">
      {/* Header skeleton */}
      <div className="bg-white border-b border-secondary-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="h-6 w-32 bg-secondary-200 rounded animate-pulse" />
          <div className="hidden sm:flex items-center gap-3">
            <div className="h-9 w-32 bg-secondary-200 rounded-full animate-pulse" />
            <div className="h-9 w-9 rounded-full bg-secondary-200 animate-pulse" />
          </div>
        </div>
      </div>

      {/* Filters + list skeleton */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 space-y-4">
        <div className="h-10 w-full max-w-3xl bg-secondary-100 rounded-xl animate-pulse" />
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,2fr),minmax(0,1.4fr)] gap-4 lg:gap-6">
          <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, index) => (
              <div
                key={index}
                className="h-24 sm:h-28 bg-white border border-secondary-100 rounded-2xl shadow-sm animate-pulse"
              />
            ))}
          </div>
          <div className="hidden lg:block">
            <div className="h-[320px] bg-white border border-secondary-100 rounded-2xl shadow-sm animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  );
}

async function DiscoverPageContent() {
  const apiBase = getApiBaseUrl().replace(/\/$/, "");
  const url = `${apiBase}/api/v1/tasks?page=1&limit=20&status=open`;

  let initialData: TaskListResponse | null = null;

  try {
    const res = await fetch(url, {
      // Allow Next.js to cache and revalidate periodically so
      // client-side navigations don't show a blank state.
      next: { revalidate: 30 },
    });
    if (res.ok) {
      const json = await res.json();
      if (json.data && json.meta?.pagination) {
        const p = json.meta.pagination;
        initialData = {
          tasks: json.data,
          pagination: {
            page: p.page,
            limit: p.limit,
            total: p.total,
            pages: p.totalPages ?? p.pages,
          },
        };
      } else if (json.tasks && json.pagination) {
        initialData = json as TaskListResponse;
      }
    }
  } catch {
    initialData = null;
  }

  return <DiscoverClient initialData={initialData} />;
}

export default function TasksPage() {
  return (
    <Suspense fallback={<DiscoverSkeleton />}>
      {/* @ts-expect-error Async Server Component wrapped in Suspense */}
      <DiscoverPageContent />
    </Suspense>
  );
}
