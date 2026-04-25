import type { TaskApplication } from "@/types/application";

type ApplicationLike =
  | Pick<TaskApplication, "status" | "negotiation">
  | null
  | undefined;

const INACTIVE_APPLICATION_STATUSES = new Set<TaskApplication["status"]>([
  "withdrawn",
  "rejected",
]);

export function isActiveTaskApplication(
  application: Pick<TaskApplication, "status"> | null | undefined
): boolean {
  return Boolean(
    application && !INACTIVE_APPLICATION_STATUSES.has(application.status)
  );
}

export function getApplicationNegotiationStatus(
  application: ApplicationLike
): NonNullable<TaskApplication["negotiation"]>["status"] | "none" {
  return application?.negotiation?.status ?? "none";
}

export function canEditPendingTaskApplication(
  application: ApplicationLike
): boolean {
  return (
    application?.status === "pending" &&
    getApplicationNegotiationStatus(application) === "none"
  );
}
