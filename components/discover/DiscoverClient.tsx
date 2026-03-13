"use client";

import React, { useState, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { TaskMap } from "@/components/tasks/TaskMap";
import { TaskCard } from "@/components/tasks/TaskCard";
import { TaskDetailCard } from "@/components/tasks/TaskDetailCard";
import { CompactFilterBar } from "@/components/tasks/CompactFilterBar";
import { TaskListSkeleton } from "@/components/tasks/TaskSkeleton";
import type { Task, TaskListResponse } from "@/types/task";
import { List, Plus, AlertCircle } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { useUserStore } from "@/lib/state/userStore";
import { useTasksInfinite } from "@/hooks/useTasksInfinite";
import { serviceCategories } from "@/lib/data/categories";
import { PrefetchTaskWrapper } from "@/hooks/usePrefetchTaskDetails";
import { getLocationCoordinates } from "@/lib/utils/locationMapping";

const DEFAULT_CENTER = { lat: 17.385, lng: 78.4867 }; // Hyderabad

type CompactFilterState = {
  categories: string[];
  suburb: string;
  address?: string;
  location?: { lat: number; lng: number };
  remotely: boolean | null;
  minBudget: number;
  maxBudget: number;
  maxDistance?: number;
  sortBy: "recent" | "nearest" | "price-low" | "price-high" | "date";
  availableOnly: boolean;
  noOffersOnly: boolean;
};

// tweak these to match your header/filter/footer sizes
const HEADER_HEIGHT_PX = 110;
const FILTER_BAR_HEIGHT_PX = 0;
const TOP_OFFSET_PX = HEADER_HEIGHT_PX + FILTER_BAR_HEIGHT_PX;

const calculateDistance = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
) => {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
    Math.cos((lat2 * Math.PI) / 180) *
    Math.sin(dLon / 2) *
    Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

const getBudgetAmount = (budget: Task["budget"]) =>
  typeof budget === "number" ? budget : budget?.amount ?? 0;

const normalizeCategoryValue = (value: string) =>
  value
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

// Empty state
const EmptyState = ({ searchQuery }: { searchQuery: string }) => {
  const router = useRouter();
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="w-16 h-16 rounded-full bg-secondary-100 flex items-center justify-center mb-4">
        <List className="w-8 h-8 text-secondary-400" />
      </div>
      <h3 className="text-lg font-semibold text-secondary-900 mb-2">
        No tasks found
      </h3>
      <p className="text-sm text-secondary-600 mb-4 max-w-md">
        {searchQuery
          ? `No results for "${searchQuery}". Try different keywords or adjust your filters.`
          : "Try adjusting your filters or post your own task to get started."}
      </p>
      <Button
        onClick={() => router.push("/tasks/new")}
        className="bg-primary-500 hover:bg-primary-600 text-secondary-900 font-semibold"
      >
        <Plus className="w-4 h-4 mr-2" />
        Post a task
      </Button>
    </div>
  );
};

export function DiscoverClient({
  initialData,
}: {
  initialData: TaskListResponse | null;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const initialSearch = searchParams.get("q") || "";
  const initialSuburb = searchParams.get("suburb") || "";

  // State
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [showTaskDetail, setShowTaskDetail] = useState(false);
  const [filters, setFilters] = useState<CompactFilterState>({
    categories: [],
    suburb: initialSuburb,
    location: DEFAULT_CENTER,
    address: "Hyderabad",
    remotely: null,
    minBudget: 50,
    maxBudget: 50000,
    sortBy: "recent",
    availableOnly: false,
    noOffersOnly: false,
  });

  const isMobile = useIsMobile();
  const userProfile = useUserStore((state) => state.user);

  const {
    data,
    isLoading,
    isError,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useTasksInfinite(
    {
      status: "open,assigned",
      categories: filters.categories,
      search: searchQuery,
      suburb: filters.suburb,
      remotely: filters.remotely,
      sortBy: filters.sortBy,
      minBudget: filters.minBudget,
      maxBudget: filters.maxBudget,
    },
    initialData || undefined
  );

  const pages = data?.pages ?? [];
  const tasks: Task[] = pages.flatMap((page) => page.tasks || []);

  // Filter and sort tasks (client-side for unsupported backend filters)
  const getFilteredTasks = useCallback((): Task[] => {
    let filtered = [...tasks];

    if (userProfile?._id) {
      filtered = filtered.filter((task) => task.requesterId !== userProfile._id);
    }

    // Client-side filters for unsupported backend options
    if (searchQuery.trim()) {
      const query = searchQuery.trim().toLowerCase();
      filtered = filtered.filter((task) => {
        const title = task.title?.toLowerCase() || "";
        const description = task.description?.toLowerCase() || "";
        const category = task.category?.toLowerCase() || "";
        const city = task.location?.city?.toLowerCase() || "";
        const address = task.location?.address?.toLowerCase() || "";

        return (
          title.includes(query) ||
          description.includes(query) ||
          category.includes(query) ||
          city.includes(query) ||
          address.includes(query)
        );
      });
    }

    if (filters.categories.length > 0) {
      const selectedCategoryValues = new Set<string>();

      filters.categories.forEach((selectedId) => {
        const category = serviceCategories.find((cat) => cat.id === selectedId);
        const candidates = [selectedId, category?.id, category?.name].filter(
          Boolean
        ) as string[];

        candidates.forEach((candidate) => {
          const normalized = normalizeCategoryValue(candidate);
          if (normalized) selectedCategoryValues.add(normalized);
        });
      });

      filtered = filtered.filter((task) => {
        const taskCategoryCandidates = [
          task.category,
          task.categorySlug,
          task.categoryLabel,
        ].filter(Boolean) as string[];

        return taskCategoryCandidates.some((candidate) => {
          const normalizedTaskCategory = normalizeCategoryValue(candidate);
          if (!normalizedTaskCategory) return false;
          return selectedCategoryValues.has(normalizedTaskCategory);
        });
      });
    }

    // Suburb filter
    if (filters.suburb) {
      filtered = filtered.filter((task) =>
        ((task.location?.address || task.location?.city) || "")
          .toLowerCase()
          .includes(filters.suburb.toLowerCase())
      );
    }

    // Budget range filter (client-side)
    if (
      typeof filters.minBudget === "number" &&
      typeof filters.maxBudget === "number"
    ) {
      filtered = filtered.filter((task) => {
        const amount = getBudgetAmount(task.budget);
        return amount >= filters.minBudget && amount <= filters.maxBudget;
      });
    }

    // Remotely / In-person filter
    if (typeof filters.remotely !== "undefined" && filters.remotely !== null) {
      if (filters.remotely === true) {
        // Remote tasks: no coordinates/address
        filtered = filtered.filter(
          (task) =>
            !task.location ||
            !task.location.coordinates ||
            task.location.coordinates.length === 0 ||
            !task.location.address
        );
      } else {
        // In-person tasks: must have coordinates
        filtered = filtered.filter(
          (task) =>
            task.location &&
            task.location.coordinates &&
            task.location.coordinates.length > 0
        );
      }
    }

    // Available tasks only - hide assigned/started/in-progress tasks when filter is enabled
    if (filters.availableOnly) {
      filtered = filtered.filter((task) => {
        const isAssigned = task.status === "assigned" || task.status === "started" || task.status === "in_progress";
        return !isAssigned;
      });
    }

    // Tasks with no offers only - show only tasks with no applications
    if (filters.noOffersOnly) {
      filtered = filtered.filter((task) => {
        return (task.applications ?? 0) === 0;
      });
    }

    // Sort by nearest (client-side distance calculation)
    const centerLat = filters.location?.lat ?? DEFAULT_CENTER.lat;
    const centerLng = filters.location?.lng ?? DEFAULT_CENTER.lng;

    if (filters.sortBy === "nearest" || filters.maxDistance) {
      // Calculate distances for all tasks
      const tasksWithDistance = filtered.map((task) => {
        const [lngA, latA] = task.location?.coordinates || [centerLng, centerLat];
        const distance = calculateDistance(centerLat, centerLng, latA, lngA);
        return { task, distance };
      });

      // Filter by distance if maxDistance is set
      if (filters.maxDistance) {
        filtered = tasksWithDistance
          .filter(({ distance }) => distance <= filters.maxDistance!)
          .map(({ task }) => task);
      } else {
        // Sort by nearest
        filtered = tasksWithDistance.sort((a, b) => a.distance - b.distance).map(({ task }) => task);
      }
    } else if (filters.sortBy === "price-low") {
      filtered.sort(
        (a, b) => getBudgetAmount(a.budget) - getBudgetAmount(b.budget)
      );
    } else if (filters.sortBy === "price-high") {
      filtered.sort(
        (a, b) => getBudgetAmount(b.budget) - getBudgetAmount(a.budget)
      );
    }

    return filtered;
  }, [tasks, filters, userProfile, searchQuery]);

  const filteredTasks = getFilteredTasks();
  const selectedTask = filteredTasks.find((t) => t._id === selectedTaskId);
  const errorMessage =
    error instanceof Error
      ? error.message
      : "Failed to load tasks. Please try again.";

  // On mobile: go directly to task details. On desktop: show detail card overlay on map.
  const handleTaskSelect = (taskId: string) => {
    if (isMobile) {
      router.push(`/tasks/${taskId}`);
      return;
    }
    setSelectedTaskId(taskId);
    setShowTaskDetail(true);
  };

  // Handle closing detail card
  const handleCloseDetail = () => {
    setShowTaskDetail(false);
    setSelectedTaskId(null);
  };

  // Handle filter changes and compute location coordinates
  const handleFilterChange = (newFilters: CompactFilterState) => {
    // If suburb or address changed, update location coordinates
    if (newFilters.suburb || newFilters.address) {
      const location = newFilters.suburb || newFilters.address || "Hyderabad";
      const coordinates = getLocationCoordinates(location);
      newFilters.location = coordinates;
    }
    setFilters(newFilters);
  };

  return (
    <div className="flex flex-col bg-secondary-50">
      {/* Filter bar (sticky) */}
      <CompactFilterBar
        filters={filters}
        onFilterChange={handleFilterChange}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      {/* Main content */}
      <div className="w-full max-w-6xl mx-auto px-4 lg:px-8">
        <div className="flex gap-0">
          {/* Left column: list (full width on mobile; 1/2 on desktop) */}
          <div className="w-full lg:w-1/2">
            <div
              style={{
                maxHeight: `calc(100vh - ${TOP_OFFSET_PX}px)`,
              }}
              className="overflow-y-auto py-8 pr-4"
            >
              {isError ? (
                <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
                  <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mb-4">
                    <AlertCircle className="w-8 h-8 text-red-500" />
                  </div>
                  <h3 className="text-lg font-semibold text-secondary-900 mb-2">
                    Error Loading Tasks
                  </h3>
                  <p className="text-sm text-secondary-600 mb-4 max-w-md">
                    {errorMessage}
                  </p>
                  <Button
                    onClick={() => window.location.reload()}
                    className="bg-primary-500 hover:bg-primary-600 text-secondary-900 font-semibold"
                  >
                    Retry
                  </Button>
                </div>
              ) : isLoading ? (
                <div className="p-4">
                  <TaskListSkeleton count={8} />
                </div>
              ) : filteredTasks.length === 0 ? (
                <EmptyState searchQuery={searchQuery} />
              ) : (
                <div className="space-y-3">
                  {filteredTasks.map((task) => {
                    let distance: number | undefined;
                    if (task.location?.coordinates && filters.location) {
                      const [lng, lat] = task.location.coordinates;
                      distance = calculateDistance(
                        filters.location.lat,
                        filters.location.lng,
                        lat,
                        lng
                      );
                    }
                    return (
                      <PrefetchTaskWrapper key={task._id} taskId={task._id}>
                        <TaskCard
                          task={task}
                          isSelected={selectedTaskId === task._id}
                          onClick={() => handleTaskSelect(task._id)}
                          distance={distance}
                        />
                      </PrefetchTaskWrapper>
                    );
                  })}
                </div>
              )}

              {/* Load more button */}
              {!isLoading && !isError && hasNextPage && (
                <div className="p-4 text-center border-t border-secondary-200">
                  <Button
                    onClick={() => fetchNextPage()}
                    variant="outline"
                    className="border-secondary-300"
                    disabled={isFetchingNextPage}
                  >
                    {isFetchingNextPage ? "Loading..." : `Load more tasks`}
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Right column: map (desktop only; hidden on mobile) */}
          <div className="hidden lg:block lg:w-1/2">
            <div className="sticky" style={{ top: `${TOP_OFFSET_PX}px` }}>
              <div
                className="relative"
                style={{
                  height: `calc(100vh - ${TOP_OFFSET_PX}px)`,
                }}
              >
                <TaskMap
                  tasks={filteredTasks}
                  selectedTaskId={selectedTaskId}
                  onTaskSelect={handleTaskSelect}
                  centerCoordinates={filters.location || DEFAULT_CENTER}
                />
                {/* Desktop Task Detail Card Overlay */}
                {showTaskDetail && selectedTask && (
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-[1000] w-full px-4">
                    <TaskDetailCard
                      task={selectedTask}
                      onClose={handleCloseDetail}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}

