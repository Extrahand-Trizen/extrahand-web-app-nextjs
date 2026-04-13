"use client";

import React, { useState, useCallback, useRef, useEffect, useMemo } from "react";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
   Camera,
   X,
   Plus,
   Check,
   Loader2,
   MapPin,
   AlertCircle,
} from "lucide-react";
import { toast } from "sonner";
import { UserProfile } from "@/types/user";
import { api } from "@/lib/api";
import { isValidImageType, isValidFileSize } from "@/lib/utils/sanitization";
import { postTaskCategories } from "@/lib/data/categories";
import { PROFESSION_OPTIONS } from "@/lib/data/professions";

interface ProfileEditFormProps {
   user: UserProfile;
   onSave: (data: Partial<UserProfile>) => Promise<void>;
   onCancel?: () => void;
}

interface FormData {
   firstName: string;
   lastName: string;
   profession: string;
   bio: string;
   portfolioTitle: string;
   portfolioDescription: string;
   portfolioUrl: string;
   email: string;
   phone: string;
   location: string;
   skills: string[];
   userType: "individual" | "business";
}

export function ProfileEditForm({
   user,
   onSave,
   onCancel,
}: ProfileEditFormProps) {
   const nameParts = user.name?.split(" ") || ["", ""];

   // Extract only the 10-digit phone number, removing "+91" and other formatting
   const extractPhoneDigits = (phoneStr: string): string => {
      if (!phoneStr) return "";
      // Remove all non-digits
      const digitsOnly = phoneStr.replace(/\D/g, "");
      // If it starts with "91", remove it (India country code)
      if (digitsOnly.startsWith("91") && digitsOnly.length === 12) {
         return digitsOnly.slice(2);
      }
      // Return last 10 digits if longer than 10
      return digitsOnly.slice(-10);
   };

   const normalizePhoneInput = (value: string): string => {
      const digitsOnly = value.replace(/\D/g, "");
      if (!digitsOnly) return "";
      if (digitsOnly.startsWith("91") && digitsOnly.length > 10) {
         return digitsOnly.slice(-10);
      }
      return digitsOnly.slice(0, 10);
   };

   const getBioWordMetrics = (value: string) => {
      const words = value
         .trim()
         .toLowerCase()
         .split(/\s+/)
         .map((word) => word.replace(/^[^a-z0-9]+|[^a-z0-9]+$/g, ""))
         .filter(Boolean);

      const stopWords = new Set([
         "a",
         "an",
         "and",
         "as",
         "at",
         "be",
         "for",
         "from",
         "in",
         "is",
         "it",
         "my",
         "of",
         "on",
         "or",
         "that",
         "the",
         "to",
         "with",
         "i",
         "am",
         "we",
         "you",
      ]);

      const meaningfulWords = words.filter(
         (word) => word.length > 2 && !stopWords.has(word)
      );

      return {
         totalWords: words.length,
         meaningfulWords: meaningfulWords.length,
      };
   };

   const [formData, setFormData] = useState<FormData>({
      firstName: nameParts[0] || "",
      lastName: nameParts.slice(1).join(" ") || "",
      profession: user.profession || "",
      // Prefer the main profile bio for individuals; fall back to business description.
      bio: user.bio || user.business?.description || "",
      portfolioTitle: user.portfolio?.[0]?.title || "",
      portfolioDescription: user.portfolio?.[0]?.description || "",
      portfolioUrl: user.portfolio?.[0]?.url || "",
      email: user.email || "",
      phone: extractPhoneDigits(user.phone || ""),
      location: user.location?.address || user.location?.city || "",
      skills: user.skills?.list?.map((s) => s.name) || [],
      userType: user.userType || "individual",
   });

   const [photoURL, setPhotoURL] = useState(user.photoURL || "");
   const [pendingPhotoFile, setPendingPhotoFile] = useState<File | null>(null);
   const [photoPreviewUrl, setPhotoPreviewUrl] = useState<string>("");
   const [isSaving, setIsSaving] = useState(false);
   const [errors, setErrors] = useState<Record<string, string>>({});
   const [newSkill, setNewSkill] = useState("");
   const [skillsInputFocused, setSkillsInputFocused] = useState(false);
   const [professionInputFocused, setProfessionInputFocused] = useState(false);
   const [hasChanges, setHasChanges] = useState(false);
   const [activeSaveSection, setActiveSaveSection] = useState<string | null>(null);
   const fileInputRef = useRef<HTMLInputElement>(null);
   const portfolioFileInputRef = useRef<HTMLInputElement>(null);
   const [portfolioImageUrls, setPortfolioImageUrls] = useState<string[]>(
      Array.isArray(user.portfolio?.[0]?.images)
         ? (user.portfolio?.[0]?.images || []).filter(Boolean)
         : []
   );
   const [pendingPortfolioFiles, setPendingPortfolioFiles] = useState<File[]>([]);
   const [portfolioPreviewUrls, setPortfolioPreviewUrls] = useState<string[]>([]);
   const existingSkills = useMemo(() => {
      return Array.isArray(user.skills?.list) ? user.skills.list : [];
   }, [user.skills?.list]);
   const allProfessions = useMemo(
      () =>
         Array.from(new Set(PROFESSION_OPTIONS)).sort(
            (a, b) => a.localeCompare(b)
         ),
      []
   );
   const suggestedProfessions = useMemo(() => {
      const query = formData.profession.trim().toLowerCase();
      const filtered = allProfessions.filter((name) => {
         if (!query) return true;
         return name.toLowerCase().includes(query);
      });
      return filtered.slice(0, 20);
   }, [allProfessions, formData.profession]);
   const suggestedSkills = useMemo(() => {
      const query = newSkill.trim().toLowerCase();
      return postTaskCategories
         .map((item) => item.label)
         .filter((name) => {
            if (!query) return false;
            return name.toLowerCase().includes(query);
         })
         .filter(
            (name) =>
               !formData.skills.some(
                  (skill) => skill.toLowerCase() === name.toLowerCase()
               )
         )
         .slice(0, 8);
   }, [formData.skills, newSkill]);


   const cachedPhotoUrl = React.useMemo(() => {
      if (!photoURL) return "";
      const rawVersion = user.updatedAt ? new Date(user.updatedAt).getTime() : Date.now();
      const separator = photoURL.includes("?") ? "&" : "?";
      return `${photoURL}${separator}v=${rawVersion}`;
   }, [photoURL, user.updatedAt]);

   const MAX_PHOTO_MB = 5;

   // Revoke object URL on cleanup to avoid memory leaks
   useEffect(() => {
      return () => {
         if (photoPreviewUrl) {
            URL.revokeObjectURL(photoPreviewUrl);
         }
         portfolioPreviewUrls.forEach((url) => URL.revokeObjectURL(url));
      };
   }, [photoPreviewUrl, portfolioPreviewUrls]);

   const updateField = useCallback(
      (field: keyof FormData, value: any) => {
         setFormData((prev) => ({ ...prev, [field]: value }));
         setHasChanges(true);
         // Clear error when field is updated
         if (errors[field]) {
            setErrors((prev) => {
               const newErrors = { ...prev };
               delete newErrors[field];
               return newErrors;
            });
         }
      },
      [errors]
   );

   const validateForm = (): boolean => {
      const newErrors: Record<string, string> = {};

      if (!formData.firstName.trim()) {
         newErrors.firstName = "First name is required";
      }
      if (!formData.lastName.trim()) {
         newErrors.lastName = "Last name is required";
      }
      if (
         formData.email &&
         !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)
      ) {
         newErrors.email = "Please enter a valid email";
      }
      if (
         formData.phone &&
         !/^[6-9]\d{9}$/.test(formData.phone.replace(/\D/g, ""))
      ) {
         newErrors.phone = "Please enter a valid 10-digit phone number";
      }

      const trimmedBio = formData.bio.trim();
      if (trimmedBio) {
         const { totalWords, meaningfulWords } = getBioWordMetrics(trimmedBio);
         if (totalWords < 8 || meaningfulWords < 5) {
            newErrors.bio =
               "Please write at least 8 words with clear, meaningful details.";
         }
      }

      const portfolioTitle = formData.portfolioTitle.trim();
      const portfolioUrl = formData.portfolioUrl.trim();
      const hasPortfolioImages =
         portfolioImageUrls.length > 0 || pendingPortfolioFiles.length > 0;
      const hasAnyPortfolioInput =
         !!portfolioTitle ||
         !!portfolioUrl ||
         hasPortfolioImages ||
         !!formData.portfolioDescription.trim();

      if (hasAnyPortfolioInput) {
         if (!portfolioTitle) {
            newErrors.portfolioTitle = "Portfolio title is required";
         }

         if (!portfolioUrl && !hasPortfolioImages) {
            newErrors.portfolio =
               "Add at least one portfolio photo or a website link";
         }

         if (portfolioUrl) {
            try {
               const parsed = new URL(portfolioUrl);
               if (!(parsed.protocol === "http:" || parsed.protocol === "https:")) {
                  newErrors.portfolioUrl = "Portfolio URL must start with http:// or https://";
               }
            } catch {
               newErrors.portfolioUrl = "Please enter a valid website URL";
            }
         }
      }

      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
   };

   const handleSave = async (sectionKey: string) => {
      if (isSaving) return;
      if (!validateForm()) return;

      setActiveSaveSection(sectionKey);
      setIsSaving(true);
      try {
         let savedPhotoURL: string | undefined = photoURL || undefined;
         let savedPortfolioImages: string[] = [...portfolioImageUrls];
         if (pendingPhotoFile) {
            try {
               savedPhotoURL = await api.uploadImage(pendingPhotoFile);
               if (photoPreviewUrl) {
                  URL.revokeObjectURL(photoPreviewUrl);
               }
               setPhotoPreviewUrl("");
               setPhotoURL(savedPhotoURL);
               setPendingPhotoFile(null);
            } catch (uploadError: any) {
               console.error("Photo upload failed:", uploadError);
               toast.error("Failed to upload photo", {
                  description: uploadError?.message || "Please try again.",
               });
               setIsSaving(false);
               return;
            }
         }

         if (pendingPortfolioFiles.length > 0) {
            try {
               const uploaded = await Promise.all(
                  pendingPortfolioFiles.map((file) => api.uploadImage(file))
               );
               savedPortfolioImages = [...savedPortfolioImages, ...uploaded.filter(Boolean)];
               portfolioPreviewUrls.forEach((url) => URL.revokeObjectURL(url));
               setPortfolioPreviewUrls([]);
               setPendingPortfolioFiles([]);
               setPortfolioImageUrls(savedPortfolioImages);
            } catch (uploadError: any) {
               console.error("Portfolio image upload failed:", uploadError);
               toast.error("Failed to upload portfolio images", {
                  description: uploadError?.message || "Please try again.",
               });
               setIsSaving(false);
               return;
            }
         }

         const portfolioTitle = formData.portfolioTitle.trim();
         const portfolioDescription = formData.portfolioDescription.trim();
         const portfolioUrl = formData.portfolioUrl.trim();
         const hasPortfolioData =
            !!portfolioTitle ||
            !!portfolioUrl ||
            savedPortfolioImages.length > 0 ||
            !!portfolioDescription;

         const portfolioPayload = hasPortfolioData
            ? [
                 {
                    title: portfolioTitle,
                    url: portfolioUrl || undefined,
                    images: savedPortfolioImages,
                    description: portfolioDescription || undefined,
                 },
              ]
            : [];

         await onSave({
            name: `${formData.firstName} ${formData.lastName}`.trim(),
            profession: formData.profession.trim() || undefined,
            email: formData.email,
            phone: formData.phone,
            userType: formData.userType,
            // "About you" should always populate the public profile bio for individuals.
            bio: formData.bio ? formData.bio : undefined,
            // Business accounts also keep business.description in sync.
            business:
               formData.userType === "business" && formData.bio
                  ? { description: formData.bio }
                  : undefined,
            skills: {
               list: formData.skills.map((name) => {
                  const normalizedName = name.trim().toLowerCase();
                  const matchedSkill = existingSkills.find((skill) => {
                     return (skill.name || "").trim().toLowerCase() === normalizedName;
                  });

                  if (matchedSkill) {
                     return {
                        ...matchedSkill,
                        name,
                     };
                  }

                  return { name };
               }),
            },
            photoURL: savedPhotoURL,
            portfolio: portfolioPayload,
         });
         setHasChanges(false);
      } catch (error) {
         console.error("Failed to save profile:", error);
         toast.error("Failed to save profile. Please try again.");
      } finally {
         setIsSaving(false);
         setActiveSaveSection(null);
      }
   };

   const handleSaveAll = async () => {
      await handleSave("all");
   };

   const addSkill = () => {
      const cleanSkill = newSkill.trim();
      if (!cleanSkill) return;
      if (
         formData.skills.some(
            (existingSkill) =>
               existingSkill.toLowerCase() === cleanSkill.toLowerCase()
         )
      ) {
         setNewSkill("");
         return;
      }

      updateField("skills", [...formData.skills, cleanSkill]);
      setNewSkill("");
   };

   const addSuggestedSkill = (skillName: string) => {
      if (
         formData.skills.some(
            (existingSkill) =>
               existingSkill.toLowerCase() === skillName.toLowerCase()
         )
      ) {
         return;
      }

      updateField("skills", [...formData.skills, skillName]);
      setNewSkill("");
   };

   const removeSkill = (skillToRemove: string) => {
      updateField(
         "skills",
         formData.skills.filter((s) => s !== skillToRemove)
      );
   };

   const selectProfession = (profession: string) => {
      updateField("profession", profession);
      setProfessionInputFocused(false);
   };

   const handlePhotoUpload = () => {
      fileInputRef.current?.click();
   };

   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      // Clear the file input value immediately to prevent any carry-over
      // This is especially important to prevent mixing with other file uploads (e.g., certificate verification)
      e.target.value = "";
      (e.target as any).files = null;
      
      if (!file) return;

      if (!isValidImageType(file.type)) {
         toast.error("Invalid file type", {
            description: "Please choose a JPG, PNG, or WebP image.",
         });
         return;
      }
      if (!isValidFileSize(file.size, MAX_PHOTO_MB)) {
         toast.error("File too large", {
            description: `Image must be under ${MAX_PHOTO_MB}MB.`,
         });
         return;
      }

      if (photoPreviewUrl) {
         URL.revokeObjectURL(photoPreviewUrl);
      }
      setPhotoPreviewUrl(URL.createObjectURL(file));
      setPendingPhotoFile(file);
      setHasChanges(true);
   };

   const handlePortfolioImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(e.target.files || []);
      // Clear file input immediately to prevent carry-over to other uploads
      e.target.value = "";
      (e.target as any).files = null;
      
      if (files.length === 0) return;

      const validFiles: File[] = [];
      const nextPreviewUrls: string[] = [];

      for (const file of files) {
         if (!isValidImageType(file.type)) {
            toast.error("Invalid portfolio image type", {
               description: "Please choose JPG, PNG, or WebP files.",
            });
            continue;
         }

         if (!isValidFileSize(file.size, MAX_PHOTO_MB)) {
            toast.error("Portfolio image too large", {
               description: `Each image must be under ${MAX_PHOTO_MB}MB.`,
            });
            continue;
         }

         validFiles.push(file);
         nextPreviewUrls.push(URL.createObjectURL(file));
      }

      if (validFiles.length === 0) return;

      setPendingPortfolioFiles((prev) => [...prev, ...validFiles].slice(0, 8));
      setPortfolioPreviewUrls((prev) => [...prev, ...nextPreviewUrls].slice(0, 8));
      setHasChanges(true);
   };

   const removeExistingPortfolioImage = (index: number) => {
      setPortfolioImageUrls((prev) => prev.filter((_, i) => i !== index));
      setHasChanges(true);
   };

   const removePendingPortfolioImage = (index: number) => {
      setPendingPortfolioFiles((prev) => prev.filter((_, i) => i !== index));
      setPortfolioPreviewUrls((prev) => {
         const next = [...prev];
         const removed = next[index];
         if (removed) URL.revokeObjectURL(removed);
         return next.filter((_, i) => i !== index);
      });
      setHasChanges(true);
   };

   const displayPhotoUrl = photoPreviewUrl || cachedPhotoUrl || undefined;

   return (
      <div className="max-w-4xl space-y-4 sm:space-y-6">
         {/* Form Header */}
         <div>
            <h2 className="text-base sm:text-lg font-semibold text-gray-900">
               Edit Profile
            </h2>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">
               Update your personal information and how you appear on ExtraHand
            </p>
            {hasChanges && (
               <p className="text-xs sm:text-sm text-amber-600 flex items-center gap-1.5 mt-2">
                  <AlertCircle className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span className="hidden sm:inline">You have unsaved changes</span>
                  <span className="sm:hidden">Unsaved changes</span>
               </p>
            )}
         </div>

         {/* Photo Section */}
         <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-5">
            <input
               ref={fileInputRef}
               type="file"
               accept="image/jpeg,image/jpg,image/png,image/webp"
               className="hidden"
               aria-label="Upload profile photo"
               onChange={handleFileChange}
            />
            <Label className="text-xs sm:text-sm font-medium text-gray-900 mb-3 block">
               Profile Photo
            </Label>
            <div className="flex items-center gap-3 sm:gap-4">
               <div className="relative">
                  <Avatar className="w-16 h-16 sm:w-20 sm:h-20">
                     <AvatarImage src={displayPhotoUrl} />
                     <AvatarFallback className="bg-gray-100 text-gray-600 text-xl sm:text-2xl font-medium">
                        {formData.firstName.charAt(0).toUpperCase() || "U"}
                     </AvatarFallback>
                  </Avatar>
                  <button
                     type="button"
                     onClick={handlePhotoUpload}
                     className="absolute bottom-0 right-0 w-6 h-6 sm:w-7 sm:h-7 bg-white border border-gray-200 rounded-full flex items-center justify-center shadow-sm hover:bg-gray-50 transition-colors"
                  >
                     <Camera className="w-3 h-3 sm:w-4 sm:h-4 text-gray-600" />
                  </button>
               </div>
               <div>
                  <Button
                     type="button"
                     variant="outline"
                     size="sm"
                     onClick={handlePhotoUpload}
                     className="text-xs h-8 px-3"
                  >
                     Upload Photo
                  </Button>
                  <p className="text-[10px] sm:text-xs text-gray-500 mt-1.5">
                     JPG, PNG or WebP. Max size {MAX_PHOTO_MB}MB.
                  </p>
               </div>
            </div>
         </div>

         {/* Basic Info */}
         <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-5 space-y-3 sm:space-y-4">
            <h3 className="text-xs sm:text-sm font-medium text-gray-900">
               Basic Information
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
               <div>
                  <Label
                     htmlFor="firstName"
                     className="text-xs sm:text-sm text-gray-700"
                  >
                     First Name *
                  </Label>
                  <Input
                     id="firstName"
                     value={formData.firstName}
                     onChange={(e) => updateField("firstName", e.target.value)}
                     className={cn(
                        "mt-1.5 h-9 sm:h-10 text-xs md:text-sm",
                        errors.firstName &&
                           "border-red-300 focus:border-red-500"
                     )}
                     placeholder="First name"
                  />
                  {errors.firstName && (
                     <p className="text-[10px] sm:text-xs text-red-500 mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {errors.firstName}
                     </p>
                  )}
               </div>
               <div>
                  <Label
                     htmlFor="lastName"
                     className="text-xs sm:text-sm text-gray-700"
                  >
                     Last Name *
                  </Label>
                  <Input
                     id="lastName"
                     value={formData.lastName}
                     onChange={(e) => updateField("lastName", e.target.value)}
                     className={cn(
                        "mt-1.5 h-9 sm:h-10 text-xs md:text-sm",
                        errors.lastName && "border-red-300 focus:border-red-500"
                     )}
                     placeholder="Last name"
                  />
                  {errors.lastName && (
                     <p className="text-[10px] sm:text-xs text-red-500 mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {errors.lastName}
                     </p>
                  )}
               </div>
            </div>

            <div className="relative">
               <Label
                  htmlFor="profession"
                  className="text-xs sm:text-sm text-gray-700"
               >
                  Profession
               </Label>
               <Input
                  id="profession"
                  value={formData.profession}
                  onChange={(e) => updateField("profession", e.target.value.slice(0, 100))}
                  onFocus={() => setProfessionInputFocused(true)}
                  onBlur={() => {
                     setTimeout(() => setProfessionInputFocused(false), 120);
                  }}
                  className="mt-1.5 h-9 sm:h-10 text-xs md:text-sm"
                  placeholder="e.g. IT Support / Laptop Repair"
                  maxLength={100}
               />
               {professionInputFocused && suggestedProfessions.length > 0 && (
                  <div className="absolute z-20 mt-1 w-full rounded-md border border-gray-200 bg-white shadow-lg max-h-56 overflow-y-auto">
                     {suggestedProfessions.map((profession) => (
                        <button
                           key={profession}
                           type="button"
                           className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50"
                           onMouseDown={(e) => {
                              e.preventDefault();
                              selectProfession(profession);
                           }}
                        >
                           {profession}
                        </button>
                     ))}
                  </div>
               )}
               <p className="text-[10px] sm:text-xs text-gray-500 mt-1">
                  Pick a profession suggestion or type your own custom profession.
               </p>
            </div>

            <div>
               <Label
                  htmlFor="bio"
                  className="text-xs sm:text-sm text-gray-700"
               >
                  About You
               </Label>
               <Textarea
                  id="bio"
                  value={formData.bio}
                  onChange={(e) => updateField("bio", e.target.value)}
                  className="mt-1.5 min-h-20 sm:min-h-[100px] text-xs md:text-sm"
                  placeholder="Tell others a bit about yourself..."
                  maxLength={500}
               />
               <p className="text-[10px] sm:text-xs text-gray-400 mt-1 text-right">
                  {formData.bio.length}/500
               </p>
               {errors.bio && (
                  <p className="text-[10px] sm:text-xs text-red-500 mt-1 flex items-center gap-1">
                     <AlertCircle className="w-3 h-3" />
                     {errors.bio}
                  </p>
               )}
            </div>
         </div>

         {/* Portfolio */}
         <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-5 space-y-3 sm:space-y-4">
            <h3 className="text-xs sm:text-sm font-medium text-gray-900">
               Portfolio
            </h3>

            <input
               ref={portfolioFileInputRef}
               type="file"
               accept="image/jpeg,image/jpg,image/png,image/webp"
               multiple
               className="hidden"
               aria-label="Upload portfolio photos"
               onChange={handlePortfolioImageSelect}
            />

            <div>
               <Label htmlFor="portfolioTitle" className="text-xs sm:text-sm text-gray-700">
                  Portfolio Title
               </Label>
               <Input
                  id="portfolioTitle"
                  value={formData.portfolioTitle}
                  onChange={(e) => updateField("portfolioTitle", e.target.value.slice(0, 120))}
                  className={cn(
                     "mt-1.5 h-9 sm:h-10 text-xs md:text-sm",
                     errors.portfolioTitle && "border-red-300 focus:border-red-500"
                  )}
                  placeholder="e.g. Real estate lead generation dashboard"
                  maxLength={120}
               />
               {errors.portfolioTitle && (
                  <p className="text-[10px] sm:text-xs text-red-500 mt-1 flex items-center gap-1">
                     <AlertCircle className="w-3 h-3" />
                     {errors.portfolioTitle}
                  </p>
               )}
            </div>

            <div>
               <Label htmlFor="portfolioUrl" className="text-xs sm:text-sm text-gray-700">
                  Website Link
               </Label>
               <Input
                  id="portfolioUrl"
                  value={formData.portfolioUrl}
                  onChange={(e) => updateField("portfolioUrl", e.target.value.slice(0, 500))}
                  className={cn(
                     "mt-1.5 h-9 sm:h-10 text-xs md:text-sm",
                     errors.portfolioUrl && "border-red-300 focus:border-red-500"
                  )}
                  placeholder="https://your-portfolio-link.com"
                  maxLength={500}
               />
               {errors.portfolioUrl && (
                  <p className="text-[10px] sm:text-xs text-red-500 mt-1 flex items-center gap-1">
                     <AlertCircle className="w-3 h-3" />
                     {errors.portfolioUrl}
                  </p>
               )}
            </div>

            <div>
               <div className="flex items-center justify-between gap-2">
                  <Label className="text-xs sm:text-sm text-gray-700">Portfolio Photos</Label>
                  <Button
                     type="button"
                     variant="outline"
                     size="sm"
                     className="text-xs h-8 px-3"
                     onClick={() => portfolioFileInputRef.current?.click()}
                  >
                     Upload Photos
                  </Button>
               </div>

               {(portfolioImageUrls.length > 0 || portfolioPreviewUrls.length > 0) && (
                  <div className="mt-2 grid grid-cols-2 sm:grid-cols-3 gap-2">
                     {portfolioImageUrls.map((src, idx) => (
                        <div key={`existing-${idx}`} className="relative rounded-md overflow-hidden border border-gray-200">
                           <img src={src} alt={`Portfolio ${idx + 1}`} className="w-full h-24 object-cover" />
                           <button
                              type="button"
                              onClick={() => removeExistingPortfolioImage(idx)}
                              className="absolute top-1 right-1 bg-white/90 rounded p-1 shadow"
                           >
                              <X className="w-3 h-3 text-gray-700" />
                           </button>
                        </div>
                     ))}

                     {portfolioPreviewUrls.map((src, idx) => (
                        <div key={`pending-${idx}`} className="relative rounded-md overflow-hidden border border-gray-200">
                           <img src={src} alt={`Pending portfolio ${idx + 1}`} className="w-full h-24 object-cover" />
                           <button
                              type="button"
                              onClick={() => removePendingPortfolioImage(idx)}
                              className="absolute top-1 right-1 bg-white/90 rounded p-1 shadow"
                           >
                              <X className="w-3 h-3 text-gray-700" />
                           </button>
                        </div>
                     ))}
                  </div>
               )}

               <p className="text-[10px] sm:text-xs text-gray-500 mt-1">
                  Add up to 8 images. Title + at least one image or website link is required.
               </p>
               {errors.portfolio && (
                  <p className="text-[10px] sm:text-xs text-red-500 mt-1 flex items-center gap-1">
                     <AlertCircle className="w-3 h-3" />
                     {errors.portfolio}
                  </p>
               )}
            </div>

            <div>
               <Label htmlFor="portfolioDescription" className="text-xs sm:text-sm text-gray-700">
                  Portfolio Description (Optional)
               </Label>
               <Textarea
                  id="portfolioDescription"
                  value={formData.portfolioDescription}
                  onChange={(e) => updateField("portfolioDescription", e.target.value.slice(0, 1000))}
                  className="mt-1.5 min-h-20 sm:min-h-[90px] text-xs md:text-sm"
                  placeholder="Explain this portfolio work (optional)"
                  maxLength={1000}
               />
            </div>
         </div>

         {/* Contact Info */}
         <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-5 space-y-3 sm:space-y-4">
            <h3 className="text-xs sm:text-sm font-medium text-gray-900">
               Contact Information
            </h3>

            <div>
               <Label
                  htmlFor="email"
                  className="text-xs sm:text-sm text-gray-700"
               >
                  Email
               </Label>
               <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => updateField("email", e.target.value)}
                  className={cn(
                     "mt-1.5 h-9 sm:h-10 text-xs md:text-sm",
                     errors.email && "border-red-300 focus:border-red-500"
                  )}
                  placeholder="your@email.com"
               />
               {errors.email && (
                  <p className="text-[10px] sm:text-xs text-red-500 mt-1 flex items-center gap-1">
                     <AlertCircle className="w-3 h-3" />
                     {errors.email}
                  </p>
               )}
            </div>

            <div>
               <Label
                  htmlFor="phone"
                  className="text-xs sm:text-sm text-gray-700"
               >
                  Phone Number
               </Label>
               <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => updateField("phone", normalizePhoneInput(e.target.value))}
                  className={cn(
                     "mt-1.5 h-9 sm:h-10 text-xs md:text-sm",
                     errors.phone && "border-red-300 focus:border-red-500"
                  )}
                  placeholder="10-digit phone number"
                  maxLength={10}
                  inputMode="numeric"
               />
               {errors.phone && (
                  <p className="text-[10px] sm:text-xs text-red-500 mt-1 flex items-center gap-1">
                     <AlertCircle className="w-3 h-3" />
                     {errors.phone}
                  </p>
               )}
            </div>

            <div>
               <Label
                  htmlFor="location"
                  className="text-xs sm:text-sm text-gray-700"
               >
                  Service Area
               </Label>
               <div className="relative mt-1.5">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-3 h-3 sm:w-4 sm:h-4 text-gray-400" />
                  <Input
                     id="location"
                     value={formData.location}
                     onChange={(e) => updateField("location", e.target.value)}
                     className="pl-8 sm:pl-9 h-9 sm:h-10 text-xs md:text-sm"
                     placeholder="City or locality"
                  />
               </div>
               <p className="text-[10px] sm:text-xs text-gray-500 mt-1">
                  This helps users find you in their area
               </p>
            </div>
         </div>

         {/* Account Type */}
         <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-5">
            <Label className="text-xs sm:text-sm font-medium text-gray-900 mb-3 block">
               Account Type
            </Label>
            <div className="grid grid-cols-2 gap-2 sm:gap-3">
               <button
                  type="button"
                  onClick={() => updateField("userType", "individual")}
                  className={cn(
                     "py-2.5 sm:py-3 px-3 sm:px-4 rounded-lg border text-xs sm:text-sm font-medium transition-colors",
                     formData.userType === "individual"
                        ? "border-primary-600 bg-primary-600 text-white"
                        : "border-gray-200 bg-white text-gray-600 hover:border-gray-300"
                  )}
               >
                  Individual
               </button>
               <button
                  type="button"
                  onClick={() => updateField("userType", "business")}
                  className={cn(
                     "py-2.5 sm:py-3 px-3 sm:px-4 rounded-lg border text-xs sm:text-sm font-medium transition-colors",
                     formData.userType === "business"
                        ? "border-primary-600 bg-primary-600 text-white"
                        : "border-gray-200 bg-white text-gray-600 hover:border-gray-300"
                  )}
               >
                  Business
               </button>
            </div>
         </div>

         {/* Skills */}
         <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-5">
            <Label className="text-xs sm:text-sm font-medium text-gray-900 mb-3 block">
               Skills & Services
            </Label>

            {/* Existing Skills */}
            <div className="flex flex-wrap gap-2 mb-3">
               {formData.skills.map((skill) => (
                  <Badge
                     key={skill}
                     variant="secondary"
                     className="bg-gray-100 text-gray-700 hover:bg-gray-100 pr-1.5 text-xs"
                  >
                     {skill}
                     <button
                        onClick={() => removeSkill(skill)}
                        className="ml-1.5 p-0.5 rounded hover:bg-gray-200 transition-colors"
                     >
                        <X className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                     </button>
                  </Badge>
               ))}
            </div>

            {/* Add New Skill */}
            <div className="relative">
               <div className="flex gap-2">
                  <Input
                     value={newSkill}
                     onChange={(e) => setNewSkill(e.target.value)}
                     placeholder="Add a skill..."
                     className="flex-1 h-9 sm:h-10 text-xs md:text-sm"
                     onFocus={() => setSkillsInputFocused(true)}
                     onBlur={() => {
                        setTimeout(() => setSkillsInputFocused(false), 120);
                     }}
                     onKeyDown={(e) => {
                        if (e.key === "Enter") {
                           e.preventDefault();
                           addSkill();
                        }
                     }}
                  />
                  <Button
                     type="button"
                     variant="outline"
                     size="icon"
                     onClick={addSkill}
                     disabled={!newSkill.trim()}
                     className="size-8 md:size-9 sm:size-10"
                  >
                     <Plus className="size-3.5 md:size-4" />
                  </Button>
               </div>

               {skillsInputFocused && newSkill.trim().length > 0 && suggestedSkills.length > 0 && (
                  <div className="absolute z-20 mt-1 w-full rounded-md border border-gray-200 bg-white shadow-lg">
                     {suggestedSkills.map((skill) => (
                        <button
                           key={skill}
                           type="button"
                           className="block w-full px-3 py-2 text-left text-xs sm:text-sm hover:bg-gray-50"
                           onPointerDown={(e) => {
                              e.preventDefault();
                              addSuggestedSkill(skill);
                           }}
                        >
                           {skill}
                        </button>
                     ))}
                  </div>
               )}
            </div>
            <p className="text-[10px] sm:text-xs text-gray-500 mt-2">
               Add skills to help people find you for relevant tasks
            </p>
         </div>

         {/* Single save button (bottom) */}
         <div className="flex items-center justify-end gap-2 pt-2">
            {onCancel ? (
               <Button type="button" variant="outline" onClick={onCancel} disabled={isSaving}>
                  Cancel
               </Button>
            ) : null}
            <Button
               type="button"
               onClick={handleSaveAll}
               disabled={isSaving || !hasChanges}
               className="min-w-32 bg-primary-500 hover:bg-primary-600"
            >
               {isSaving && activeSaveSection === "all" ? (
                  <>
                     <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                     Saving...
                  </>
               ) : (
                  <>
                     <Check className="size-4 mr-2" />
                     Save changes
                  </>
               )}
            </Button>
         </div>
      </div>
   );
}

export default ProfileEditForm;
