import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UserProfile } from "@/types/user";

export function PublicProfileBio({ user }: { user: UserProfile }) {
  const text =
    (user.bio && user.bio.trim()) ||
    (user.userType === "business" ? user.business?.description?.trim() : "") ||
    "";

  if (!text) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Bio</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-600">This tasker is ready to help with your tasks.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Bio</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-600 leading-relaxed">{text}</p>
      </CardContent>
    </Card>
  );
}

