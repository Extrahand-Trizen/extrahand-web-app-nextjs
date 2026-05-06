import type { Metadata } from "next";
import { getApiBaseUrl } from "@/lib/config";
import { buildPublicProfileHandle, parsePublicProfileHandle } from "@/lib/utils/profileHandle";

type LayoutProps = {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
};

async function fetchProfileName(idOrHandle: string): Promise<{ id: string; name?: string } | null> {
  const { userId } = parsePublicProfileHandle(idOrHandle);
  const id = userId || idOrHandle;
  if (!id) return null;

  const apiBase = getApiBaseUrl().replace(/\/$/, "");
  const url = `${apiBase}/api/v1/profiles/${id}`;
  try {
    const res = await fetch(url, { next: { revalidate: 60 } });
    if (!res.ok) return { id };
    const json = await res.json();
    const profile = json?.profile ?? json;
    const resolvedId = String(profile?.uid || profile?._id || id);
    const name =
      typeof profile?.name === "string" && profile.name.trim()
        ? profile.name.trim()
        : undefined;
    return { id: resolvedId, name };
  } catch {
    return { id };
  }
}

export async function generateMetadata({ params }: LayoutProps): Promise<Metadata> {
  const { id: handleOrId } = await params;
  const profile = await fetchProfileName(handleOrId);

  const canonicalHandle =
    profile?.id && profile?.name
      ? buildPublicProfileHandle(profile.name, profile.id)
      : null;
  const ogPath = canonicalHandle
    ? `/profile/${canonicalHandle}/opengraph-image`
    : `/profile/${handleOrId}/opengraph-image`;

  const title = profile?.name
    ? `${profile.name} – ExtraHand`
    : "ExtraHand – Hire Help or Earn Money Near You";
  const description =
    "Connect with skilled helpers and get things done. Get help, hire services, and become a helper on ExtraHand.";

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [
        {
          url: ogPath,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      title,
      description,
      images: [ogPath],
    },
  };
}

export default function ProfileLayout({ children }: LayoutProps) {
  return <>{children}</>;
}

