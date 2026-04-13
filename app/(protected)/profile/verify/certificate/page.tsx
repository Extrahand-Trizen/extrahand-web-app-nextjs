"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
   AlertCircle,
   ArrowLeft,
   CheckCircle2,
   FileImage,
   Lock,
   RefreshCw,
   Shield,
   Sparkles,
   Upload,
   XCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/api";
import { profilesApi } from "@/lib/api/endpoints/profiles";
import { useAuth } from "@/lib/auth/context";
import { cn } from "@/lib/utils";
import { isValidFileSize, isValidImageType } from "@/lib/utils/sanitization";
import { toast } from "sonner";
import { UserProfile } from "@/types/user";

type FlowStep = "badge" | "details" | "upload" | "processing" | "success" | "error";
type VerificationType = "certified" | "licensed";
type CertificateField =
   | "verificationType"
   | "certificateType"
   | "issuingAuthority"
   | "certificateNumber"
   | "issueDate"
   | "expiryDate"
   | "file"
   | "consentGiven";

interface CertificateState {
   step: FlowStep;
   verificationType: VerificationType | "";
   certificateType: string;
   issuingAuthority: string;
   certificateNumber: string;
   issueDate: string;
   expiryDate: string;
   file: File | null;
   consentGiven: boolean;
   uploadedUrl?: string;
   error?: string;
   fieldErrors: Partial<Record<CertificateField, string>>;
}

interface CertificateEntry {
   title: string;
   issuedBy: string;
   issuedDate: Date;
   documentUrl: string;
   status?: "pending" | "verified" | "rejected";
   verificationType: VerificationType;
   certificateType: string;
   issuingAuthority: string;
   certificateNumber?: string;
   issueDate: Date;
   expiryDate?: Date;
}

const MAX_CERTIFICATE_MB = 10;

function normalizeName(value?: string): string {
   return (value || "").trim().toLowerCase().replace(/\s+/g, " ");
}

function getDisplayProfession(user?: UserProfile | null): string {
   const profession = user?.profession?.trim();
   if (profession) return profession;

   const skills = Array.isArray(user?.skills?.list) ? user.skills.list : [];
   const firstSkill = skills.find((skill) => typeof skill?.name === "string" && skill.name.trim());
   return firstSkill?.name?.trim() || "Professional";
}

function getExistingCertificate(user?: UserProfile | null): CertificateEntry | null {
   const skills = Array.isArray(user?.skills?.list) ? user.skills.list : [];
   for (const skill of skills) {
      const certificates = Array.isArray(skill?.certificates) ? skill.certificates : [];
      const match = certificates.find((certificate) => Boolean(certificate?.documentUrl));
      if (match) {
         return match as CertificateEntry;
      }
   }
   return null;
}

function parseDateInput(value: string): Date | undefined {
   if (!value) return undefined;
   const date = new Date(value);
   return Number.isNaN(date.getTime()) ? undefined : date;
}

function formatDateLabel(value?: string | Date): string {
   if (!value) return "";
   const date = new Date(value);
   if (Number.isNaN(date.getTime())) return "";
   return new Intl.DateTimeFormat("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
   }).format(date);
}

function getDefaultCertificateType(verificationType: VerificationType): string {
   return verificationType === "certified"
      ? "Professional Certification"
      : "Professional License";
}

function getCertificateTypePlaceholder(verificationType: VerificationType): string {
   return verificationType === "certified"
      ? "e.g. CCTV Installation Certification"
      : "e.g. Electrical Contractor License";
}

function getStepStatus(
   currentStep: FlowStep,
   stepIndex: number
): "complete" | "active" | "pending" {
   if (currentStep === "processing" || currentStep === "success" || currentStep === "error") {
      return "complete";
   }

   const flowIndex = currentStep === "badge" ? 0 : currentStep === "details" ? 1 : 2;
   if (stepIndex < flowIndex) return "complete";
   if (stepIndex === flowIndex) return "active";
   return "pending";
}

function buildCertificateSummary(state: CertificateState): Array<{ label: string; value: string }> {
   return [
      { label: "Badge Type", value: state.verificationType ? state.verificationType === "certified" ? "Certified" : "Licensed" : "-" },
      { label: "Certificate Type", value: state.certificateType || "-" },
      { label: "Issuing Authority", value: state.issuingAuthority || "-" },
      { label: "Certificate Number", value: state.certificateNumber || "Optional" },
      { label: "Issue Date", value: formatDateLabel(state.issueDate) || "-" },
      { label: "Expiry Date", value: state.expiryDate ? formatDateLabel(state.expiryDate) : "If applicable" },
   ];
}

export default function CertificateVerificationPage() {
   const router = useRouter();
   const { userData, refreshUserData } = useAuth();
   const scrollTopRef = useRef(0);

   const [user, setUser] = useState<UserProfile | null>(userData);
   const [state, setState] = useState<CertificateState>({
      step: "badge",
      verificationType: "",
      certificateType: "",
      issuingAuthority: "",
      certificateNumber: "",
      issueDate: "",
      expiryDate: "",
      file: null,
      consentGiven: false,
      fieldErrors: {},
   });
   const [isLoading, setIsLoading] = useState(false);

   useEffect(() => {
      if (userData) {
         setUser(userData);
      }
   }, [userData]);

   useEffect(() => {
      if (typeof window === "undefined") return;
      if (state.step !== "processing" && state.step !== "success" && state.step !== "error") return;

      const frame = window.requestAnimationFrame(() => {
         window.scrollTo({ top: scrollTopRef.current, behavior: "auto" });
      });

      return () => window.cancelAnimationFrame(frame);
   }, [state.step]);

   const profileVerificationsUrl = "/profile?section=verifications";
   const existingCertificate = useMemo(() => getExistingCertificate(user), [user]);
   const professionLabel = useMemo(() => getDisplayProfession(user), [user]);

   const handleBack = () => {
      router.push(profileVerificationsUrl);
   };

   const updateField = <K extends keyof CertificateState>(field: K, value: CertificateState[K]) => {
      setState((prev) => ({
         ...prev,
         [field]: value,
         error: undefined,
         fieldErrors: {
            ...prev.fieldErrors,
            [field]: undefined,
         },
      }));
   };

   const selectVerificationType = (verificationType: VerificationType) => {
      setState((prev) => ({
         ...prev,
         verificationType,
         certificateType: prev.certificateType || getDefaultCertificateType(verificationType),
         error: undefined,
         fieldErrors: {
            ...prev.fieldErrors,
            verificationType: undefined,
         },
      }));
   };

   const continueToDetails = () => {
      if (!state.verificationType) {
         setState((prev) => ({
            ...prev,
            error: "Please select Certified or Licensed to continue.",
            fieldErrors: {
               ...prev.fieldErrors,
               verificationType: "Select a verification type.",
            },
         }));
         return;
      }

      setState((prev) => ({
         ...prev,
         step: "details",
         error: undefined,
      }));
   };

   const validateDetails = (): boolean => {
      const fieldErrors: Partial<Record<CertificateField, string>> = {};

      if (!state.certificateType.trim()) {
         fieldErrors.certificateType = "Certificate Type is required.";
      }

      if (!state.issuingAuthority.trim()) {
         fieldErrors.issuingAuthority = "Issuing Authority / Institute is required.";
      }

      if (!state.issueDate) {
         fieldErrors.issueDate = "Issue Date is required.";
      }

      const issueDate = parseDateInput(state.issueDate);
      const expiryDate = parseDateInput(state.expiryDate);

      if (state.expiryDate && issueDate && expiryDate && expiryDate < issueDate) {
         fieldErrors.expiryDate = "Expiry Date must be after the Issue Date.";
      }

      if (Object.keys(fieldErrors).length > 0) {
         setState((prev) => ({
            ...prev,
            error: "Please fill in the required certificate details.",
            fieldErrors: {
               ...prev.fieldErrors,
               ...fieldErrors,
            },
         }));
         return false;
      }

      return true;
   };

   const continueToUpload = () => {
      if (!validateDetails()) return;
      setState((prev) => ({
         ...prev,
         step: "upload",
         error: undefined,
      }));
   };

   const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0] || null;
      // Clear the file input value to prevent any reuse or carrying over
      event.target.value = "";
      // Also reset the file attribute explicitly
      (event.target as any).files = null;
      
      if (!file) return;

      if (!isValidImageType(file.type)) {
         setState((prev) => ({
            ...prev,
            error: "Please choose a JPG, PNG, or WebP image.",
            fieldErrors: {
               ...prev.fieldErrors,
               file: "Please choose a JPG, PNG, or WebP image.",
            },
         }));
         toast.error("Invalid file type", {
            description: "Please choose a JPG, PNG, or WebP image.",
         });
         return;
      }

      if (!isValidFileSize(file.size, MAX_CERTIFICATE_MB)) {
         setState((prev) => ({
            ...prev,
            error: `Certificate image must be under ${MAX_CERTIFICATE_MB}MB.`,
            fieldErrors: {
               ...prev.fieldErrors,
               file: `Certificate image must be under ${MAX_CERTIFICATE_MB}MB.`,
            },
         }));
         toast.error("File too large", {
            description: `Certificate image must be under ${MAX_CERTIFICATE_MB}MB.`,
         });
         return;
      }

      setState((prev) => ({
         ...prev,
         file,
         error: undefined,
         fieldErrors: {
            ...prev.fieldErrors,
            file: undefined,
         },
      }));
   };

   const buildCertificateEntry = (documentUrl: string): CertificateEntry => ({
      title: state.certificateType.trim(),
      issuedBy: state.issuingAuthority.trim(),
      issuedDate: new Date(state.issueDate),
      documentUrl,
      status: "pending",
      verificationType: state.verificationType || "certified",
      certificateType: state.certificateType.trim(),
      issuingAuthority: state.issuingAuthority.trim(),
      certificateNumber: state.certificateNumber.trim() || undefined,
      issueDate: new Date(state.issueDate),
      expiryDate: state.expiryDate ? new Date(state.expiryDate) : undefined,
   });

   const updateSkillsWithCertificate = (profile: UserProfile, certificateEntry: CertificateEntry) => {
      const normalizedProfession = normalizeName(profile.profession);
      const existingSkills = Array.isArray(profile.skills?.list) ? profile.skills.list : [];
      const targetSkillIndex = existingSkills.findIndex((skill) => {
         const skillName = normalizeName(skill?.name);
         return skillName === normalizedProfession;
      });

      const nextSkills = [...existingSkills];
      const appendCertificate = (skill: (typeof nextSkills)[number]) => {
         const certificates = Array.isArray(skill?.certificates) ? [...skill.certificates] : [];
         certificates.push(certificateEntry);
         return {
            ...skill,
            // Do NOT set verified:true on upload - only after admin verification in DB
            // verified: true,
            // certified: true,
            certificates,
         };
      };

      if (targetSkillIndex >= 0) {
         nextSkills[targetSkillIndex] = appendCertificate(nextSkills[targetSkillIndex]);
      } else if (nextSkills.length > 0) {
         nextSkills[0] = appendCertificate(nextSkills[0]);
      } else {
         nextSkills.push({
            name: professionLabel,
            // Do NOT set verified:true on upload - only after admin verification in DB
            // verified: true,
            // certified: true,
            certificates: [certificateEntry],
         });
      }

      return nextSkills;
   };

   const handleVerifyCertificate = async () => {
      if (typeof window !== "undefined") {
         scrollTopRef.current = window.scrollY;
      }

      if (document.activeElement instanceof HTMLElement) {
         document.activeElement.blur();
      }

      const fileError = !state.file ? "Please upload a certificate image." : undefined;
      const consentError = !state.consentGiven ? "Please confirm that the certificate is genuine." : undefined;

      if (fileError || consentError) {
         setState((prev) => ({
            ...prev,
            error: fileError || consentError,
            fieldErrors: {
               ...prev.fieldErrors,
               file: fileError,
               consentGiven: consentError,
            },
         }));
         return;
      }

      if (!user?.uid) {
         setState((prev) => ({ ...prev, error: "Please refresh your profile and try again." }));
         toast.error("Profile unavailable");
         return;
      }

      setIsLoading(true);
      setState((prev) => ({ ...prev, error: undefined, step: "processing" }));

      try {
         const uploadedUrl = await api.uploadCertificateImage(state.file as File);
         const baseProfile = user || userData;

         if (!baseProfile) {
            throw new Error("Profile data is unavailable");
         }

         // Preserve the original photoURL before any profile updates
         const originalPhotoURL = baseProfile.photoURL;

         const certificateEntry = buildCertificateEntry(uploadedUrl);
         const updatedSkills = updateSkillsWithCertificate(baseProfile, certificateEntry);

         const response = await profilesApi.updateMyProfile({
            skills: {
               ...(baseProfile.skills || {}),
               list: updatedSkills,
            },
         });

         const updatedProfile = response.profile || response;
         
         // CRITICAL: Always preserve the original photoURL 
         // The certificate upload should NEVER modify the profile picture
         setUser({
            ...(updatedProfile as UserProfile),
            photoURL: originalPhotoURL || (updatedProfile as any)?.photoURL,
         });
         
         setState((prev) => ({
            ...prev,
            step: "success",
            uploadedUrl,
         }));

         toast.success("Certificate uploaded successfully", {
            description: "Your certificate is now under review. You'll receive a notification once verified.",
         });

         // Refresh user data but ensure photoURL is preserved
         await refreshUserData();
         
         // After refreshUserData, ensure photoURL is still correct
         const refreshedUser = userData;
         if (refreshedUser && refreshedUser.photoURL !== originalPhotoURL) {
            // If backend returned wrong photoURL, correct it in UI
            setUser((prev) => ({
               ...prev,
               photoURL: originalPhotoURL || prev?.photoURL,
            }));
         }
      } catch (error: any) {
         const errorMessage = error?.message || "Certificate verification failed";
         setState((prev) => ({
            ...prev,
            step: "error",
            error: errorMessage,
         }));
         toast.error(errorMessage);
      } finally {
         setIsLoading(false);
      }
   };

   const renderStepPill = (stepNumber: number, label: string, status: "complete" | "active" | "pending") => (
      <div
         className={cn(
            "flex items-center gap-3 rounded-2xl border px-4 py-3",
            status === "complete"
               ? "border-emerald-200 bg-emerald-50"
               : status === "active"
                  ? "border-primary-300 bg-primary-50"
                  : "border-slate-200 bg-white"
         )}
      >
         <div
            className={cn(
               "flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold",
               status === "complete"
                  ? "bg-emerald-600 text-white"
                  : status === "active"
                     ? "bg-primary-600 text-white"
                     : "bg-slate-100 text-slate-500"
            )}
         >
            {status === "complete" ? <CheckCircle2 className="h-4 w-4" /> : stepNumber}
         </div>
         <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Step {stepNumber}</p>
            <p className="text-sm font-medium text-slate-900">{label}</p>
         </div>
      </div>
   );

   const renderBadgeStep = () => {
      const optionClass = (selected: boolean) =>
         cn(
            "rounded-2xl border p-4 text-left transition-all",
            selected
               ? "border-primary-500 bg-primary-50 ring-2 ring-primary-100"
               : "border-slate-200 bg-white hover:border-primary-300 hover:bg-slate-50"
         );

      return (
         <Card className="border-slate-200 shadow-sm">
            <CardContent className="space-y-6 p-5 sm:p-6">
               <div>
                  <h2 className="text-lg font-semibold text-slate-900">Select badge type</h2>
                  <p className="mt-1 text-sm text-slate-500">
                     Choose the verification type that matches your document before entering the certificate details.
                  </p>
               </div>

               <div className="grid gap-3 sm:grid-cols-2">
                  {[
                     {
                        value: "certified" as VerificationType,
                        title: "Certified",
                        description: "Course completion, professional certification, or training credentials.",
                     },
                     {
                        value: "licensed" as VerificationType,
                        title: "Licensed",
                        description: "Government, board, or institute-issued license with renewal details.",
                     },
                  ].map((option) => {
                     const selected = state.verificationType === option.value;

                     return (
                        <button
                           key={option.value}
                           type="button"
                           onClick={() => selectVerificationType(option.value)}
                           className={optionClass(selected)}
                        >
                           <div className="flex items-start justify-between gap-3">
                              <div>
                                 <p className="text-base font-semibold text-slate-900">{option.title}</p>
                                 <p className="mt-1 text-sm text-slate-600">{option.description}</p>
                              </div>
                              {selected ? <CheckCircle2 className="mt-0.5 h-5 w-5 text-primary-600" /> : null}
                           </div>
                        </button>
                     );
                  })}
               </div>

               {state.fieldErrors.verificationType ? (
                  <p className="flex items-center gap-1 text-sm text-red-600">
                     <AlertCircle className="h-4 w-4" />
                     {state.fieldErrors.verificationType}
                  </p>
               ) : null}

               {existingCertificate ? (
                  <div className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-700">
                     {(() => {
                        const statusMeta = getCertificateStatusMeta(existingCertificate.status);
                        return (
                           <>
                              <div className="flex items-center gap-2">
                                 <p className="font-medium text-slate-900">Existing certificate</p>
                                 <span className={cn("inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium", statusMeta.className)}>
                                    {statusMeta.label}
                                 </span>
                              </div>
                              <p className="mt-1 text-slate-600">
                                 {existingCertificate.title || "Professional Certificate"} is already linked to your profile.
                              </p>
                              <p className="mt-1 text-xs text-slate-500">{statusMeta.subtitle}</p>
                           </>
                        );
                     })()}
                  </div>
               ) : null}

               <Button
                  type="button"
                  onClick={continueToDetails}
                  disabled={!state.verificationType}
                  className="h-12 w-full bg-primary-700 text-base font-medium hover:bg-primary-600"
               >
                  Continue to Details
               </Button>
            </CardContent>
         </Card>
      );
   };

   const renderDetailsStep = () => (
      <Card className="border-slate-200 shadow-sm">
         <CardContent className="space-y-6 p-5 sm:p-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
               <div>
                  <h2 className="text-lg font-semibold text-slate-900">Fill certificate details</h2>
                  <p className="mt-1 text-sm text-slate-500">
                     Add the document details exactly as they appear before uploading the image.
                  </p>
               </div>
               <div className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium uppercase tracking-wider text-slate-600">
                  {state.verificationType === "certified" ? "Certified" : "Licensed"}
               </div>
            </div>

            <div className="grid gap-4">
               <div>
                  <Label htmlFor="certificateType" className="text-xs sm:text-sm text-gray-700">
                     Certificate Type
                  </Label>
                  <Input
                     id="certificateType"
                     value={state.certificateType}
                     onChange={(event) => updateField("certificateType", event.target.value)}
                     className={cn(
                        "mt-1.5 h-10 text-xs md:text-sm",
                        state.fieldErrors.certificateType && "border-red-300 focus:border-red-500"
                     )}
                     placeholder={getCertificateTypePlaceholder(state.verificationType as VerificationType)}
                  />
                  {state.fieldErrors.certificateType ? (
                     <p className="mt-1 flex items-center gap-1 text-[10px] sm:text-xs text-red-500">
                        <AlertCircle className="h-3 w-3" />
                        {state.fieldErrors.certificateType}
                     </p>
                  ) : null}
               </div>

               <div>
                  <Label htmlFor="issuingAuthority" className="text-xs sm:text-sm text-gray-700">
                     Issuing Authority / Institute
                  </Label>
                  <Input
                     id="issuingAuthority"
                     value={state.issuingAuthority}
                     onChange={(event) => updateField("issuingAuthority", event.target.value)}
                     className={cn(
                        "mt-1.5 h-10 text-xs md:text-sm",
                        state.fieldErrors.issuingAuthority && "border-red-300 focus:border-red-500"
                     )}
                     placeholder="e.g. National Skill Development Institute"
                  />
                  {state.fieldErrors.issuingAuthority ? (
                     <p className="mt-1 flex items-center gap-1 text-[10px] sm:text-xs text-red-500">
                        <AlertCircle className="h-3 w-3" />
                        {state.fieldErrors.issuingAuthority}
                     </p>
                  ) : null}
               </div>

               <div>
                  <Label htmlFor="certificateNumber" className="text-xs sm:text-sm text-gray-700">
                     Certificate Number <span className="text-gray-400">(optional)</span>
                  </Label>
                  <Input
                     id="certificateNumber"
                     value={state.certificateNumber}
                     onChange={(event) => updateField("certificateNumber", event.target.value)}
                     className="mt-1.5 h-10 text-xs md:text-sm"
                     placeholder="e.g. CERT-2026-0192"
                  />
               </div>

               <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                     <Label htmlFor="issueDate" className="text-xs sm:text-sm text-gray-700">
                        Issue Date
                     </Label>
                     <Input
                        id="issueDate"
                        type="date"
                        value={state.issueDate}
                        onChange={(event) => updateField("issueDate", event.target.value)}
                        className={cn(
                           "mt-1.5 h-10 text-xs md:text-sm",
                           state.fieldErrors.issueDate && "border-red-300 focus:border-red-500"
                        )}
                     />
                     {state.fieldErrors.issueDate ? (
                        <p className="mt-1 flex items-center gap-1 text-[10px] sm:text-xs text-red-500">
                           <AlertCircle className="h-3 w-3" />
                           {state.fieldErrors.issueDate}
                        </p>
                     ) : null}
                  </div>

                  <div>
                     <Label htmlFor="expiryDate" className="text-xs sm:text-sm text-gray-700">
                        Expiry Date <span className="text-gray-400">(if applicable)</span>
                     </Label>
                     <Input
                        id="expiryDate"
                        type="date"
                        value={state.expiryDate}
                        onChange={(event) => updateField("expiryDate", event.target.value)}
                        className={cn(
                           "mt-1.5 h-10 text-xs md:text-sm",
                           state.fieldErrors.expiryDate && "border-red-300 focus:border-red-500"
                        )}
                     />
                     <p className="mt-1 text-[10px] sm:text-xs text-gray-400">
                        Leave blank if the certificate does not expire.
                     </p>
                     {state.fieldErrors.expiryDate ? (
                        <p className="mt-1 flex items-center gap-1 text-[10px] sm:text-xs text-red-500">
                           <AlertCircle className="h-3 w-3" />
                           {state.fieldErrors.expiryDate}
                        </p>
                     ) : null}
                  </div>
               </div>
            </div>

            {state.error ? (
               <div className="flex items-center gap-2 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  {state.error}
               </div>
            ) : null}

            <div className="flex flex-col gap-3 sm:flex-row sm:justify-between">
               <Button type="button" variant="outline" onClick={() => setState((prev) => ({ ...prev, step: "badge" }))} className="h-12 text-base">
                  Back
               </Button>
               <Button type="button" onClick={continueToUpload} className="h-12 bg-primary-700 text-base font-medium hover:bg-primary-600">
                  Continue to Upload
               </Button>
            </div>
         </CardContent>
      </Card>
   );

   const renderUploadStep = () => (
      <div className="space-y-6">
         <Card className="border-slate-200 shadow-sm">
            <CardContent className="p-5 sm:p-6 space-y-4">
               <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
                     <Shield className="h-5 w-5" />
                  </div>
                  <div>
                     <h3 className="text-sm font-semibold text-slate-900">Review details</h3>
                     <p className="mt-1 text-sm text-slate-600">
                        The uploaded image should match these details exactly.
                     </p>
                  </div>
               </div>

               <div className="grid gap-3 rounded-2xl bg-slate-50 p-4 sm:grid-cols-2">
                  {buildCertificateSummary(state).map((item) => (
                     <div key={item.label}>
                        <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                           {item.label}
                        </p>
                        <p className="mt-1 text-sm font-medium text-slate-900">{item.value}</p>
                     </div>
                  ))}
               </div>
            </CardContent>
         </Card>

         <Card className="border-slate-200 shadow-sm">
            <CardContent className="p-5 sm:p-6 space-y-5">
               <div>
                  <h2 className="text-lg font-semibold text-slate-900">Upload Certificate</h2>
                  <p className="mt-1 text-sm text-slate-500">
                     Now upload the document image that matches the details you entered.
                  </p>
               </div>

               <label
                  className={cn(
                     "group flex min-h-48 cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed px-6 py-8 text-center transition-colors",
                     state.file
                        ? "border-emerald-300 bg-emerald-50/40"
                        : "border-slate-200 bg-slate-50/60 hover:border-primary-300 hover:bg-primary-50/40"
                  )}
               >
                  <input
                     type="file"
                     accept="image/jpeg,image/jpg,image/png,image/webp"
                     className="hidden"
                     onChange={handleFileChange}
                  />
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-sm ring-1 ring-slate-200">
                     <Upload className="h-5 w-5 text-slate-600" />
                  </div>
                  <div className="mt-4 space-y-1">
                     <p className="text-sm font-medium text-slate-900">
                        {state.file ? state.file.name : "Choose certificate image"}
                     </p>
                     <p className="text-xs text-slate-500">
                        JPG, PNG, or WebP up to {MAX_CERTIFICATE_MB}MB
                     </p>
                  </div>
               </label>

               {state.file ? (
                  <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
                     <div className="flex items-center gap-2 font-medium text-slate-900">
                        <FileImage className="h-4 w-4 text-slate-500" />
                        Ready to upload
                     </div>
                     <p className="mt-1 text-slate-600">
                        The image will be uploaded and linked to your selected verification type.
                     </p>
                  </div>
               ) : null}

               {state.fieldErrors.file ? (
                  <div className="flex items-center gap-2 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
                     <AlertCircle className="h-4 w-4 shrink-0" />
                     {state.fieldErrors.file}
                  </div>
               ) : null}

               <label className="flex cursor-pointer items-start gap-3 rounded-xl bg-slate-50 p-4">
                  <input
                     type="checkbox"
                     checked={state.consentGiven}
                     onChange={(event) =>
                        updateField("consentGiven", event.target.checked)
                     }
                     className="mt-0.5 h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-slate-900"
                  />
                  <div className="text-xs leading-relaxed text-slate-600 sm:text-sm">
                     <p className="font-medium text-slate-800">Certificate confirmation</p>
                     <p className="mt-1">
                        I confirm this certificate is genuine, belongs to me, and can be saved to my profile for public verification.
                     </p>
                  </div>
               </label>

               {state.fieldErrors.consentGiven ? (
                  <p className="flex items-center gap-1 text-sm text-red-600">
                     <AlertCircle className="h-4 w-4" />
                     {state.fieldErrors.consentGiven}
                  </p>
               ) : null}

               {state.error ? (
                  <div className="flex items-center gap-2 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
                     <AlertCircle className="h-4 w-4 shrink-0" />
                     {state.error}
                  </div>
               ) : null}

               <div className="flex flex-col gap-3 sm:flex-row sm:justify-between">
                  <Button type="button" variant="outline" onClick={() => setState((prev) => ({ ...prev, step: "details" }))} className="h-12 text-base">
                     Back
                  </Button>
                  <Button
                     type="button"
                     onClick={handleVerifyCertificate}
                     disabled={!state.file || !state.consentGiven || isLoading}
                     className="h-12 bg-primary-700 text-base font-medium hover:bg-primary-600"
                  >
                     {isLoading ? (
                        <span className="flex items-center gap-2">
                           <RefreshCw className="h-4 w-4 animate-spin" />
                           Verifying certificate...
                        </span>
                     ) : (
                        "Upload & Verify Certificate"
                     )}
                  </Button>
               </div>
            </CardContent>
         </Card>

         <Card className="border-slate-200 shadow-sm">
            <CardContent className="p-5 sm:p-6 space-y-4">
               <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
                     <Shield className="h-5 w-5" />
                  </div>
                  <div>
                     <h3 className="text-sm font-semibold text-slate-900">Profile connection</h3>
                     <p className="mt-1 text-sm text-slate-600">
                        Your certificate will be saved under {professionLabel} and reflected in the Verifications section.
                     </p>
                  </div>
               </div>
            </CardContent>
         </Card>
      </div>
   );

   const renderProcessingStep = () => (
      <div className="py-10 text-center space-y-6">
         <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-primary-100">
            <RefreshCw className="h-10 w-10 animate-spin text-primary-600" />
         </div>
         <div className="space-y-2">
            <h2 className="text-xl font-bold text-slate-900">Validating certificate</h2>
            <p className="text-slate-600">
               We&apos;re uploading the document and saving the verified certificate to your profile.
            </p>
         </div>
         <div className="rounded-xl bg-primary-50 p-4 text-sm text-primary-700">
            Please keep this page open until the upload completes.
         </div>
      </div>
   );

   const renderSuccessStep = () => (
      <div className="py-10 text-center space-y-6">
         <div className="relative inline-flex">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100">
               <CheckCircle2 className="h-10 w-10 text-emerald-600" />
            </div>
            <div className="absolute -right-1 -top-1 flex h-8 w-8 items-center justify-center rounded-full bg-amber-100">
               <Sparkles className="h-4 w-4 text-amber-600" />
            </div>
         </div>

         <div className="space-y-2">
            <h2 className="text-xl font-bold text-slate-900">Certificate uploaded successfully</h2>
            <p className="text-slate-600">
               Your {state.verificationType === "certified" ? "certified" : "licensed"} certificate has been saved and linked to {professionLabel} on your profile.
            </p>
         </div>

         <div className="rounded-xl bg-amber-50 border border-amber-200 p-4 space-y-2">
            <div className="flex items-start gap-3">
               <AlertCircle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
               <div className="text-sm">
                  <p className="font-semibold text-amber-900 mb-1">Under review</p>
                  <p className="text-amber-800">
                     Your certificate is now under review by our team. Once verified, you'll see the Professional badge on your profile and in public verifications.
                  </p>
               </div>
            </div>
         </div>

         <div className="rounded-2xl bg-slate-50 p-4 text-left space-y-2">
            <div className="grid gap-3 sm:grid-cols-2">
               {buildCertificateSummary(state).map((item) => (
                  <div key={item.label}>
                     <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                        {item.label}
                     </p>
                     <p className="mt-1 text-sm font-medium text-slate-900">{item.value}</p>
                  </div>
               ))}
            </div>
            <p className="pt-2 text-xs text-slate-500">
               Once verified by our team, this certificate will display publicly.
            </p>
            {state.uploadedUrl ? (
               <a
                  href={state.uploadedUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-sm font-medium text-primary-700 hover:underline"
               >
                  View uploaded image
               </a>
            ) : null}
         </div>

         <div className="flex flex-col gap-3">
            <Button
               type="button"
               onClick={() => router.push("/profile")}
               className="h-12 w-full bg-primary-600 text-base font-medium hover:bg-primary-700"
            >
               Continue to Profile
            </Button>
            <Button
               type="button"
               variant="outline"
               onClick={() => router.push(profileVerificationsUrl)}
               className="h-12 w-full text-base"
            >
               Back to Verifications
            </Button>
         </div>
      </div>
   );

   const renderErrorStep = () => (
      <div className="py-10 text-center space-y-6">
         <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-red-100">
            <XCircle className="h-10 w-10 text-red-600" />
         </div>
         <div className="space-y-2">
            <h2 className="text-xl font-bold text-slate-900">Verification failed</h2>
            <p className="text-slate-600">
               We couldn&apos;t save your certificate. Please try again.
            </p>
         </div>
         <div className="rounded-xl bg-red-50 p-4 text-sm text-red-700">
            {state.error || "Please upload a valid certificate image and try again."}
         </div>
         <div className="flex flex-col gap-3">
            <Button
               type="button"
               onClick={() => setState((prev) => ({ ...prev, step: "badge", error: undefined }))}
               className="h-12 w-full bg-gray-900 text-base font-medium hover:bg-gray-800"
            >
               Start Over
            </Button>
            <Button type="button" variant="outline" onClick={handleBack} className="h-12 w-full text-base">
               Back to Verifications
            </Button>
         </div>
      </div>
   );

   const stepper = [
      { label: "Select Badge Type", key: "badge" as const },
      { label: "Fill Details", key: "details" as const },
      { label: "Upload Certificate", key: "upload" as const },
   ];

   return (
      <div className="min-h-screen bg-white">
         <div className="sticky top-0 z-10 border-b border-slate-100 bg-white/90 backdrop-blur-lg">
            <div className="mx-auto flex h-14 max-w-5xl items-center gap-3 px-4 sm:h-16 sm:px-6">
               <button
                  type="button"
                  onClick={handleBack}
                  className="-ml-2 rounded-full p-2 text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900"
               >
                  <ArrowLeft className="h-5 w-5" />
               </button>
               <div className="min-w-0 flex-1">
                  <h1 className="truncate text-base font-semibold text-slate-900">Certificate Verification</h1>
                  <p className="text-xs text-slate-500">Complete the badge type, details, and upload steps to verify your profile</p>
               </div>
            </div>
         </div>

         <main className="mx-auto min-h-[calc(100vh-10rem)] max-w-5xl px-4 py-8 pb-24 sm:px-6 lg:py-12">
            {state.step === "badge" || state.step === "details" || state.step === "upload" ? (
               <div className="mb-6 grid gap-3 md:grid-cols-3">
                  {stepper.map((step, index) =>
                     renderStepPill(
                        index + 1,
                        step.label,
                        getStepStatus(state.step, index)
                     )
                  )}
               </div>
            ) : null}

            {(state.step === "badge" || state.step === "details" || state.step === "upload") && (
               <div className="mb-8 text-center">
                  <div className="mx-auto mb-4 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-100">
                     <FileImage className="h-7 w-7 text-primary-600" />
                  </div>
                  <h1 className="text-2xl font-bold text-slate-900">Verify your certificate</h1>
                  <p className="mt-2 text-slate-500">
                     Upload a document that matches the details you enter for your {professionLabel.toLowerCase()} profile.
                  </p>
               </div>
            )}

            {state.step === "badge" && renderBadgeStep()}
            {state.step === "details" && renderDetailsStep()}
            {state.step === "upload" && renderUploadStep()}
            {state.step === "processing" && renderProcessingStep()}
            {state.step === "success" && renderSuccessStep()}
            {state.step === "error" && renderErrorStep()}
         </main>

         {state.step === "badge" || state.step === "details" || state.step === "upload" ? (
            <div className="mx-auto max-w-5xl px-4 pb-8 sm:px-6">
               <div className="flex items-center justify-center gap-2 text-xs text-slate-400">
                  <Lock className="h-3.5 w-3.5" />
                  <span>Your data is encrypted and stored securely</span>
               </div>
            </div>
         ) : null}
      </div>
   );
}

function getCertificateStatusMeta(status?: "pending" | "verified" | "rejected") {
   if (status === "verified") {
      return {
         label: "Verified",
         className: "bg-emerald-100 text-emerald-800",
         subtitle: "This certificate is already verified on your profile.",
      };
   }

   if (status === "rejected") {
      return {
         label: "Rejected",
         className: "bg-red-100 text-red-800",
         subtitle: "This certificate was rejected. Please upload a new document.",
      };
   }

   return {
      label: "Under Review",
      className: "bg-amber-100 text-amber-800",
      subtitle: "This certificate is under review.",
   };
}