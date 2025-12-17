"use client";

import React, { useState, useCallback } from "react";
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
import { UserProfile } from "@/types/user";

interface ProfileEditFormProps {
   user: UserProfile;
   onSave: (data: Partial<UserProfile>) => Promise<void>;
   onCancel?: () => void;
}

interface FormData {
   firstName: string;
   lastName: string;
   bio: string;
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

   const [formData, setFormData] = useState<FormData>({
      firstName: nameParts[0] || "",
      lastName: nameParts.slice(1).join(" ") || "",
      bio: user.business?.description || "",
      email: user.email || "",
      phone: user.phone || "",
      location: user.location?.address || user.location?.city || "",
      skills: user.skills?.list?.map((s) => s.name) || [],
      userType: user.userType || "individual",
   });

   const [photoURL, setPhotoURL] = useState(user.photoURL || "");
   const [isSaving, setIsSaving] = useState(false);
   const [errors, setErrors] = useState<Record<string, string>>({});
   const [newSkill, setNewSkill] = useState("");
   const [hasChanges, setHasChanges] = useState(false);

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

      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
   };

   const handleSave = async () => {
      if (!validateForm()) return;

      setIsSaving(true);
      try {
         await onSave({
            name: `${formData.firstName} ${formData.lastName}`.trim(),
            email: formData.email,
            phone: formData.phone,
            userType: formData.userType,
            business: formData.bio ? { description: formData.bio } : undefined,
            skills: {
               list: formData.skills.map((name) => ({ name })),
            },
         });
         setHasChanges(false);
      } catch (error) {
         console.error("Failed to save profile:", error);
      } finally {
         setIsSaving(false);
      }
   };

   const addSkill = () => {
      if (
         newSkill.trim() &&
         !formData.skills.includes(newSkill.trim().toLowerCase())
      ) {
         updateField("skills", [
            ...formData.skills,
            newSkill.trim().toLowerCase(),
         ]);
         setNewSkill("");
      }
   };

   const removeSkill = (skillToRemove: string) => {
      updateField(
         "skills",
         formData.skills.filter((s) => s !== skillToRemove)
      );
   };

   const handlePhotoUpload = () => {
      // This would trigger file upload dialog
      alert("Photo upload functionality would be implemented here");
   };

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
         </div>

         {/* Photo Section */}
         <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-5">
            <Label className="text-xs sm:text-sm font-medium text-gray-900 mb-3 block">
               Profile Photo
            </Label>
            <div className="flex items-center gap-3 sm:gap-4">
               <div className="relative">
                  <Avatar className="w-16 h-16 sm:w-20 sm:h-20">
                     <AvatarImage src={photoURL || undefined} />
                     <AvatarFallback className="bg-gray-100 text-gray-600 text-xl sm:text-2xl font-medium">
                        {formData.firstName.charAt(0).toUpperCase() || "U"}
                     </AvatarFallback>
                  </Avatar>
                  <button
                     onClick={handlePhotoUpload}
                     className="absolute bottom-0 right-0 w-6 h-6 sm:w-7 sm:h-7 bg-white border border-gray-200 rounded-full flex items-center justify-center shadow-sm hover:bg-gray-50 transition-colors"
                  >
                     <Camera className="w-3 h-3 sm:w-4 sm:h-4 text-gray-600" />
                  </button>
               </div>
               <div>
                  <Button
                     variant="outline"
                     size="sm"
                     onClick={handlePhotoUpload}
                     className="text-xs h-8 px-3"
                  >
                     Upload Photo
                  </Button>
                  <p className="text-[10px] sm:text-xs text-gray-500 mt-1.5">
                     JPG or PNG. Max size 5MB.
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
                  onChange={(e) => updateField("phone", e.target.value)}
                  className={cn(
                     "mt-1.5 h-9 sm:h-10 text-xs md:text-sm",
                     errors.phone && "border-red-300 focus:border-red-500"
                  )}
                  placeholder="10-digit phone number"
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
            <div className="flex gap-2">
               <Input
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  placeholder="Add a skill..."
                  className="flex-1 h-9 sm:h-10 text-xs md:text-sm"
                  onKeyDown={(e) =>
                     e.key === "Enter" && (e.preventDefault(), addSkill())
                  }
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
            <p className="text-[10px] sm:text-xs text-gray-500 mt-2">
               Add skills to help people find you for relevant tasks
            </p>
         </div>

         {/* Save Actions */}
         <div className="flex items-center justify-between pt-4 border-t border-gray-200">
            <div>
               {hasChanges && (
                  <p className="text-xs sm:text-sm text-amber-600 flex items-center gap-1.5">
                     <AlertCircle className="w-3 h-3 sm:w-4 sm:h-4" />
                     <span className="hidden sm:inline">
                        You have unsaved changes
                     </span>
                     <span className="sm:hidden">Unsaved changes</span>
                  </p>
               )}
            </div>
            <div className="flex gap-2 sm:gap-3">
               {onCancel && (
                  <Button
                     variant="ghost"
                     onClick={onCancel}
                     disabled={isSaving}
                     size="sm"
                     className="text-xs h-9 px-3"
                  >
                     Cancel
                  </Button>
               )}
               <Button
                  onClick={handleSave}
                  disabled={isSaving || !hasChanges}
                  className="min-w-20 sm:min-w-[100px] bg-primary-500 hover:bg-primary-600"
                  size="sm"
               >
                  {isSaving ? (
                     <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        <span className="hidden sm:inline">Saving...</span>
                        <span className="sm:hidden">...</span>
                     </>
                  ) : (
                     <>
                        <Check className="size-3.5 md:size-4 mr-2" />
                        Save
                     </>
                  )}
               </Button>
            </div>
         </div>
      </div>
   );
}

export default ProfileEditForm;
