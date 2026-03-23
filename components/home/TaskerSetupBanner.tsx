"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
   Dialog,
   DialogContent,
   DialogHeader,
   DialogTitle,
} from "@/components/ui/dialog";
import { postTaskCategories } from "@/lib/data/categories";
import { profilesApi } from "@/lib/api/endpoints/profiles";
import { toast } from "sonner";
import { UserProfile } from "@/types/user";
import { useUserStore } from "@/lib/state/userStore";

type BannerType = "skills" | "aadhaar" | null;

interface TaskerSetupBannerProps {
   user: UserProfile;
}

export function TaskerSetupBanner({ user }: TaskerSetupBannerProps) {
   const router = useRouter();
   const refreshProfile = useUserStore((state) => state.refreshProfile);
   const [skillsModalOpen, setSkillsModalOpen] = useState(false);
   const [skillInput, setSkillInput] = useState("");
   const [selectedSkills, setSelectedSkills] = useState<string[]>(
      (user.skills?.list || []).map((item) => item.name).filter(Boolean)
   );
   const [isSkillInputFocused, setIsSkillInputFocused] = useState(false);
   const [savingSkills, setSavingSkills] = useState(false);
   const [dismissed, setDismissed] = useState(false);
   const [skillsSavedThisVisit, setSkillsSavedThisVisit] = useState(false);
   const [visitId, setVisitId] = useState<string>("");

   const uid = user.uid || user._id || "anon";
   const roles = user.roles || [];
   const isTasker = roles.includes("tasker") || roles.includes("both");
   const hasSkills = selectedSkills.length > 0;
   const isAadhaarVerified =
      "isAadhaarVerified" in user
         ? Boolean((user as { isAadhaarVerified?: boolean }).isAadhaarVerified)
         : false;

   useEffect(() => {
      try {
         const visitKey = `tasker_banner_visit_${uid}`;
         const existingVisitId = sessionStorage.getItem(visitKey);
         if (existingVisitId) {
            setVisitId(existingVisitId);
            return;
         }

         const newVisitId = String(Date.now());
         sessionStorage.setItem(visitKey, newVisitId);
         setVisitId(newVisitId);
      } catch {
         // Ignore storage errors
      }
   }, [uid]);

   const suggestedSkills = useMemo(
      () =>
         postTaskCategories
            .map((item) => item.label)
            .filter((name) => {
               const query = skillInput.trim().toLowerCase();
               if (!query) return false;
               return name.toLowerCase().includes(query);
            })
            .filter(
               (name) =>
                  !selectedSkills.some(
                     (selected) => selected.toLowerCase() === name.toLowerCase()
                  )
            )
            .slice(0, 8),
      [selectedSkills, skillInput]
   );

   const handleSkillsModalOpenChange = (open: boolean) => {
      setSkillsModalOpen(open);
      if (open) {
         setSelectedSkills(
            (user.skills?.list || []).map((item) => item.name).filter(Boolean)
         );
      } else {
         setSkillInput("");
         setIsSkillInputFocused(false);
      }
   };

   const bannerType: BannerType = useMemo(() => {
      if (!isTasker) return null;
      if (dismissed) return null;
      if (!visitId) return null;

      try {
         if (typeof window !== "undefined") {
            const alreadyShownInVisit =
               sessionStorage.getItem(`tasker_banner_seen_${uid}_${visitId}`) === "1";
            if (alreadyShownInVisit) {
               return null;
            }

            const hiddenSkills =
               sessionStorage.getItem(`tasker_banner_hidden_${uid}_skills`) === "1";
            const hiddenAadhaar =
               sessionStorage.getItem(`tasker_banner_hidden_${uid}_aadhaar`) === "1";

            if (!hasSkills) {
               return hiddenSkills ? null : "skills";
            }

            // Show aadhaar only on a subsequent visit, not immediately after saving skills.
            if (!isAadhaarVerified && !skillsSavedThisVisit) {
               return hiddenAadhaar ? null : "aadhaar";
            }
         }
      } catch {
         // Ignore storage errors
      }

      return null;
   }, [
      dismissed,
      hasSkills,
      isAadhaarVerified,
      isTasker,
      skillsSavedThisVisit,
      uid,
      visitId,
   ]);

   useEffect(() => {
      if (!bannerType || !visitId) return;
      try {
         sessionStorage.setItem(`tasker_banner_seen_${uid}_${visitId}`, "1");
      } catch {
         // Ignore storage errors
      }
   }, [bannerType, uid, visitId]);

   const dismissBanner = () => {
      if (!bannerType) return;
      try {
         sessionStorage.setItem(`tasker_banner_hidden_${uid}_${bannerType}`, "1");
      } catch {
         // Ignore storage errors
      }
      setDismissed(true);
   };

   const addSkill = (skillName: string) => {
      const clean = skillName.trim();
      if (!clean) return;
      if (selectedSkills.some((s) => s.toLowerCase() === clean.toLowerCase())) {
         setSkillInput("");
         return;
      }
      setSelectedSkills((prev) => [...prev, clean]);
      setSkillInput("");
   };

   const removeSkill = (skillName: string) => {
      setSelectedSkills((prev) => prev.filter((s) => s !== skillName));
   };

   const saveSkills = async () => {
      const pendingInput = skillInput.trim();
      const normalizedSkills =
         pendingInput.length > 0 &&
         !selectedSkills.some(
            (skill) => skill.toLowerCase() === pendingInput.toLowerCase()
         )
            ? [...selectedSkills, pendingInput]
            : selectedSkills;

      if (normalizedSkills.length === 0) {
         toast.error("Please add at least one skill");
         return;
      }

      setSavingSkills(true);
      try {
         await profilesApi.upsertProfile({
            skills: {
               list: normalizedSkills.map((name) => ({ name })),
            },
         });

         setSelectedSkills(normalizedSkills);
         setSkillInput("");
         await refreshProfile();

         try {
            sessionStorage.removeItem(`tasker_banner_hidden_${uid}_skills`);
         } catch {
            // Ignore storage errors
         }

         toast.success("Skills saved successfully");
         setSkillsModalOpen(false);
         setSkillsSavedThisVisit(true);
         setDismissed(true);
      } catch (error) {
         console.error("Failed to save skills", error);
         toast.error("Failed to save skills");
      } finally {
         setSavingSkills(false);
      }
   };

   if (!bannerType) {
      return null;
   }

   return (
      <>
         <div className="fixed right-4 top-4 z-40 w-[420px] max-w-[calc(100vw-2rem)] rounded-lg border border-primary-200 bg-white shadow-lg md:top-6">
            <button
               type="button"
               onClick={dismissBanner}
               className="absolute right-2 top-2 rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
               aria-label="Dismiss"
            >
               <X className="h-4 w-4" />
            </button>

            <div className="p-4">
               {bannerType === "skills" ? (
                  <>
                     <p className="text-sm font-semibold text-gray-900">Get matched with tasks</p>
                     <p className="mt-1 text-sm text-gray-600">Add your skills</p>
                     <Button
                        className="mt-3 h-9 w-full"
                        onClick={() => {
                           setDismissed(true);
                           router.push("/profile?section=overview");
                        }}
                        style={{
                           backgroundColor: "#f9b233",
                           color: "#222",
                        }}
                     >
                        Add now
                     </Button>
                  </>
               ) : (
                  <>
                     <p className="text-sm font-semibold text-gray-900">
                        Verify your account to apply for tasks
                     </p>
                     <Button
                        className="mt-3 h-9 w-full"
                        onClick={() => router.push("/profile/verify/aadhaar")}
                        style={{
                           backgroundColor: "#f9b233",
                           color: "#222",
                        }}
                     >
                        Verify now
                     </Button>
                  </>
               )}
            </div>
         </div>

         <Dialog open={skillsModalOpen} onOpenChange={handleSkillsModalOpenChange}>
            <DialogContent className="max-w-2xl">
               <DialogHeader>
                  <DialogTitle>Choose your skills to start earning</DialogTitle>
               </DialogHeader>

               <div className="space-y-4">
                  <div>
                     <Input
                        value={skillInput}
                        placeholder="Type a skill"
                        onChange={(e) => setSkillInput(e.target.value)}
                        onFocus={() => setIsSkillInputFocused(true)}
                        onBlur={() => {
                           setTimeout(() => setIsSkillInputFocused(false), 120);
                        }}
                        onKeyDown={(e) => {
                           if (e.key === "Enter") {
                              e.preventDefault();
                              addSkill(skillInput);
                           }
                        }}
                     />

                     {isSkillInputFocused && skillInput.trim().length > 0 && suggestedSkills.length > 0 && (
                        <div className="mt-2 max-h-44 overflow-auto rounded-md border border-gray-200 bg-white">
                           {suggestedSkills.map((skill) => (
                              <button
                                 key={skill}
                                 type="button"
                                 className="block w-full px-3 py-2 text-left text-sm hover:bg-gray-50"
                                 onPointerDown={(e) => {
                                    e.preventDefault();
                                    addSkill(skill);
                                 }}
                              >
                                 {skill}
                              </button>
                           ))}
                        </div>
                     )}
                  </div>

                  <p className="text-xs font-medium text-gray-600">Selected skills</p>
                  <div className="flex flex-wrap gap-2">
                     {selectedSkills.map((skill) => (
                        <span
                           key={skill}
                           className="inline-flex items-center gap-1 rounded-full bg-primary-50 px-3 py-1 text-xs text-primary-700"
                        >
                           {skill}
                           <button
                              type="button"
                              className="text-primary-700 hover:text-primary-900"
                              onClick={() => removeSkill(skill)}
                           >
                              ×
                           </button>
                        </span>
                     ))}
                  </div>

                  <div className="flex justify-end">
                     <Button
                        onClick={saveSkills}
                        disabled={savingSkills}
                        style={{
                           backgroundColor: "#f9b233",
                           color: "#222",
                        }}
                     >
                        {savingSkills ? "Saving..." : "Save"}
                     </Button>
                  </div>
               </div>
            </DialogContent>
         </Dialog>
      </>
   );
}
