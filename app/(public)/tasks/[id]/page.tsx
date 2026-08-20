import { cache } from "react";
import { getApiBaseUrl } from "@/lib/config";
import type { Task } from "@/types/task";
import { TaskDetailsClient } from "./TaskDetailsClient";
import type { Metadata } from "next";
import {
   buildPublicTaskHandle,
   parsePublicTaskHandle,
} from "@/lib/utils/taskHandle";

type PageProps = { params: Promise<{ id: string }> };

const fetchTaskOnServer = cache(async (id: string): Promise<Task | null> => {
   const apiBase = getApiBaseUrl().replace(/\/$/, "");
   const url = `${apiBase}/api/v1/tasks/${id}`;
   try {
      const res = await fetch(url, {
         next: { revalidate: 30 },
      });
      if (!res.ok) return null;
      const json = await res.json();
      const taskData = json?.data ?? json;
      return taskData && typeof taskData === "object" && taskData._id ? (taskData as Task) : null;
   } catch {
      return null;
   }
});

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
   const { id: handleOrId } = await params;
   const { taskId } = parsePublicTaskHandle(handleOrId);
   const effectiveId = taskId || handleOrId;
   const task = await fetchTaskOnServer(effectiveId);
   const canonicalHandle =
      task?._id && task?.title ? buildPublicTaskHandle(task.title, task._id) : null;
   const canonicalUrl = canonicalHandle
      ? `https://extrahand.in/tasks/${canonicalHandle}`
      : `https://extrahand.in/tasks/${effectiveId}`;
   const ogImagePath = canonicalHandle
      ? `/tasks/${canonicalHandle}/opengraph-image`
      : `/tasks/${effectiveId}/opengraph-image`;

   const title = task?.title
      ? `${task.title} – ExtraHand`
      : "Task – ExtraHand";
   const description =
      (typeof task?.description === "string" && task.description.trim()) ||
      "Get help, start earning, and get things done with ExtraHand.";

   return {
      title,
      description,
      alternates: {
         canonical: canonicalUrl,
      },
      openGraph: {
         title,
         description,
         url: canonicalUrl,
         images: [
            {
               url: ogImagePath,
               width: 1200,
               height: 630,
               alt: task?.title ? `${task.title} – ExtraHand` : "Task – ExtraHand",
            },
         ],
      },
      twitter: {
         title,
         description,
         images: [ogImagePath],
      },
   };
}

export default async function TaskDetailsPage({ params }: PageProps) {
   const { id: handleOrId } = await params;
   const { taskId } = parsePublicTaskHandle(handleOrId);
   const effectiveId = taskId || handleOrId;

   const initialTask = await fetchTaskOnServer(effectiveId);
   const canonicalHandle =
      initialTask?._id && initialTask?.title
         ? buildPublicTaskHandle(initialTask.title, initialTask._id)
         : null;

   return (
      <TaskDetailsClient
         initialTask={initialTask}
         taskId={effectiveId}
         currentHandle={handleOrId}
         canonicalHandle={canonicalHandle}
      />
   );
}
