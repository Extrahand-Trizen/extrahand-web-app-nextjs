import { notFound } from "next/navigation";
import { OpenAppBridgePage } from "@/components/open-app/OpenAppBridgePage";
import { buildTaskOpenDeepLink, isValidTaskId } from "@/lib/openAppBridge";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function OpenTaskTrackBridgePage({ params }: PageProps) {
  const { id } = await params;
  const taskId = decodeURIComponent(id || "").trim();

  if (!isValidTaskId(taskId)) {
    notFound();
  }

  return (
    <OpenAppBridgePage
      appDeepLink={buildTaskOpenDeepLink(taskId, true)}
      headline="Opening work tracking in ExtraHand…"
    />
  );
}
