import { getApiBaseUrl } from "@/lib/config";
import type { TaskListResponse } from "@/types/task";
import { DiscoverClient } from "@/components/discover/DiscoverClient";

export default async function TasksPage() {
  const apiBase = getApiBaseUrl().replace(/\/$/, "");
  const url = `${apiBase}/api/v1/tasks?page=1&limit=20&status=open`;

  let initialData: TaskListResponse | null = null;

  try {
    const res = await fetch(url, { cache: "no-store" });
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
