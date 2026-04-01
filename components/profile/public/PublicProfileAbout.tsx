import React, { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp } from "lucide-react";
import { UserProfile } from "@/types/user";

function getAboutText(user: UserProfile): string {
  const text =
    (user.bio && user.bio.trim()) ||
    // Backend may store "about" under business.description even for individuals.
    (user.business?.description?.trim() || "") ||
    "";
  return text;
}

export function PublicProfileAbout({
  user,
  maxChars = 260,
}: {
  user: UserProfile;
  maxChars?: number;
}) {
  const [expanded, setExpanded] = useState(false);
  const text = getAboutText(user);
  if (!text.trim()) return null;

  const { visible, canExpand } = useMemo(() => {
    const clean = text.trim();
    if (!clean) return { visible: "", canExpand: false };
    if (clean.length <= maxChars) return { visible: clean, canExpand: false };
    if (expanded) return { visible: clean, canExpand: true };
    return { visible: `${clean.slice(0, maxChars).trim()}…`, canExpand: true };
  }, [text, expanded, maxChars]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">About</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line">{visible}</p>
        {canExpand ? (
          <div className="mt-3">
            <Button
              type="button"
              variant="ghost"
              className="px-0 h-auto text-slate-700 hover:text-slate-900"
              onClick={() => setExpanded((v) => !v)}
            >
              {expanded ? (
                <>
                  Read less <ChevronUp className="size-4 ml-1" />
                </>
              ) : (
                <>
                  Read more <ChevronDown className="size-4 ml-1" />
                </>
              )}
            </Button>
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}

