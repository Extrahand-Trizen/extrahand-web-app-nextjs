/**
 * Shared query keys for React Query.
 * Use these so cache is shared and prefetch/invalidate stay consistent.
 */

export const taskDetailsQueryKeys = {
   task: (id: string) => ["task", id] as const,
   applications: (id: string) => ["task-applications", id] as const,
   questions: (id: string) => ["task-questions", id] as const,
};
