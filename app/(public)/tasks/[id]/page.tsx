import { getApiBaseUrl } from "@/lib/config";
import { cookies } from "next/headers";
import type { Task } from "@/types/task";
import { TaskDetailsClient } from "./TaskDetailsClient";

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

export default async function TaskDetailsPage({ params }: PageProps) {
   const { id } = await params;
   const initialTask = await fetchTaskOnServer(id);
   return <TaskDetailsClient initialTask={initialTask} taskId={id} />;
}
