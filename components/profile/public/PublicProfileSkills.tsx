import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2 } from "lucide-react";
import { UserProfile } from "@/types/user";

export function PublicProfileSkills({ user }: { user: UserProfile }) {
  const skills = user.skills?.list ?? [];
  if (skills.length === 0) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Skills & Services</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2">
          {skills.map((skill, index) => (
            <Badge
              key={`${skill.name}-${index}`}
              variant="secondary"
              className="bg-gray-100 text-sm text-gray-700 hover:bg-gray-200"
            >
              {skill.name}
              {skill.verified && <CheckCircle2 className="w-3 h-3 ml-1.5 text-green-500" />}
              {skill.yearsOfExperience ? (
                <span className="ml-1.5 text-xs text-gray-500">• {skill.yearsOfExperience}y</span>
              ) : null}
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

