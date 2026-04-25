import { getApiBaseUrl } from "@/lib/config";
import { cookies } from "next/headers";
import type { Task } from "@/types/task";
import { TaskDetailsClient } from "./TaskDetailsClient";
import { redirect } from "next/navigation";
import type { Metadata } from "next";
import {
   buildPublicTaskHandle,
   parsePublicTaskHandle,
} from "@/lib/utils/taskHandle";

type PageProps = { params: Promise<{ id: string }> };

async function fetchTaskOnServer(id: string): Promise<Task | null> {
   const apiBase = getApiBaseUrl().replace(/\/$/, "");
   const url = `${apiBase}/api/v1/tasks/${id}`;
   try {
      const cookieStore = await cookies();
      const cookieHeader = cookieStore
         .getAll()
         .map((c) => `${c.name}=${c.value}`)
         .join("; ");
      const res = await fetch(url, {
         headers: cookieHeader ? { Cookie: cookieHeader } : {},
         next: { revalidate: 30 },
      });
      if (!res.ok) return null;
      const json = await res.json();
      const taskData = json?.data ?? json;
      return taskData && typeof taskData === "object" && taskData._id ? (taskData as Task) : null;
   } catch {
      return null;
   }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
   const { id: handleOrId } = await params;
   const { taskId } = parsePublicTaskHandle(handleOrId);
   const effectiveId = taskId || handleOrId;
   const task = await fetchTaskOnServer(effectiveId);
   const canonicalHandle =
      task?._id && task?.title ? buildPublicTaskHandle(task.title, task._id) : null;
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
      openGraph: {
         title,
         description,
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

   // Canonicalize URL to include task title slug when possible.
   if (initialTask?._id && initialTask?.title) {
      const canonicalHandle = buildPublicTaskHandle(initialTask.title, initialTask._id);
      if (handleOrId !== canonicalHandle) {
         redirect(`/tasks/${canonicalHandle}`);
      }
   }

   return <TaskDetailsClient initialTask={initialTask} taskId={effectiveId} />;
}
