import { useInfiniteQuery } from "@tanstack/react-query";
import { tasksApi } from "@/lib/api/endpoints/tasks";
import type { TaskListResponse } from "@/types/task";
import { useUserStore } from "@/lib/state/userStore";

export type TasksFilterParams = {
  status: string;
  categories: string[];
  search: string;
  suburb: string;
  remotely: boolean | null;
  sortBy: string;
  minBudget?: number;
  maxBudget?: number;
};

const TASKS_PER_PAGE = 20;

export function useTasksInfinite(
  filters: TasksFilterParams,
  initialData?: TaskListResponse | null
) {
  const userProfile = useUserStore((state) => state.user);

  return useInfiniteQuery<TaskListResponse>({
    queryKey: ["tasks", { ...filters, userId: userProfile?._id ?? null }],
    initialPageParam: 1,
    queryFn: async ({ pageParam = 1 }) => {
      const params: any = {
        page: pageParam,
        limit: TASKS_PER_PAGE,
        status: filters.status,
      };

      if (filters.categories.length > 0) {
        params.category = filters.categories.join(",");
      }

      if (filters.search.trim()) {
        params.search = filters.search.trim();
      }

      if (filters.minBudget && filters.minBudget > 0) {
        params.minBudget = filters.minBudget;
      }

      if (typeof filters.maxBudget === "number" && filters.maxBudget < 100000) {
        params.maxBudget = filters.maxBudget;
      }

      if (filters.suburb) {
        params.suburb = filters.suburb;
      }

      if (typeof filters.remotely !== "undefined" && filters.remotely !== null) {
        params.remotely = filters.remotely;
      }

      if (filters.sortBy && filters.sortBy !== "nearest") {
        params.sortBy = filters.sortBy;
      }

      try {
        if (userProfile?._id) {
          return await tasksApi.getTasks(params);
        }
        return await tasksApi.getPublicTasks(params);
      } catch (err: any) {
        if (err?.status === 401) {
          return await tasksApi.getPublicTasks(params);
        }
        throw err;
      }
    },
    getNextPageParam: (lastPage) => {
      const p = lastPage.pagination;
      if (!p) return undefined;
      return p.page < p.pages ? p.page + 1 : undefined;
    },
    // Seed the cache with server-fetched first page when available
    initialData: initialData
      ? {
          pageParams: [1],
          pages: [initialData],
        }
      : undefined,
    staleTime: 30_000,
  });
}

