import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2 } from "lucide-react";
import { UserProfile } from "@/types/user";

export function PublicProfileSkills({ user }: { user: UserProfile }) {
  const rawSkills = Array.isArray((user as any)?.skills?.list)
    ? (user as any).skills.list
    : Array.isArray((user as any)?.skills)
    ? (user as any).skills
    : [];

  const skills = rawSkills
    .map((skill: any) => {
      if (typeof skill === "string") {
        return { name: skill };
      }
      if (skill && typeof skill === "object") {
        const normalizedName =
          typeof skill.name === "string"
            ? skill.name
            : typeof skill.skill === "string"
            ? skill.skill
            : typeof skill.title === "string"
            ? skill.title
            : "";
        if (normalizedName) {
          return {
            ...skill,
            name: normalizedName,
          };
        }
      }
      return null;
    })
    .filter((skill): skill is { name: string; verified?: boolean; yearsOfExperience?: number } => {
      return Boolean(skill?.name && skill.name.trim().length > 0);
    });
  if (skills.length === 0) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base font-bold">Skills</CardTitle>
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

