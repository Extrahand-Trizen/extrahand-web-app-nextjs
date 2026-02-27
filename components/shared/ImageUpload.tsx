"use client";

/**
 * Image Upload Component for Task Attachments
 * Supports multiple images, drag & drop, preview, and removal
 * Production-grade with strict validation and sanitization
 */

import React, { useCallback, useState } from "react";
import { Upload, X, Image as ImageIcon, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { isValidImageType, isValidFileSize } from "@/lib/utils/sanitization";
import { CORS_CONFIG, getApiBaseUrl, isDevelopment } from "@/lib/config";

interface Attachment {
   type: string;
   url: string;
   filename: string;
   uploadedAt?: Date;
}

interface ImageUploadProps {
   value: Attachment[];
   onChange: (attachments: Attachment[]) => void;
   maxFiles?: number;
   maxSizeMB?: number;
}

export function ImageUpload({
   value = [],
   onChange,
   maxFiles = 5,
   maxSizeMB = 5,
}: ImageUploadProps) {
   const [isUploading, setIsUploading] = useState(false);
   const [isDragging, setIsDragging] = useState(false);

   const uploadFile = async (file: File): Promise<Attachment> => {
      const formData = new FormData();
      formData.append("image", file);

      const baseUrl = getApiBaseUrl().replace(/\/$/, "");
      const uploadUrl = `${baseUrl}/api/v1/uploads/task-image`;
      const corsConfig = CORS_CONFIG[isDevelopment ? "development" : "production"];

      const response = await fetch(uploadUrl, {
         method: "POST",
         body: formData,
         ...corsConfig,
      });

      if (!response.ok) {
         let errorData: any = { message: `Upload failed with status ${response.status}` };
         const contentType = response.headers.get("content-type");
         if (contentType && contentType.includes("application/json")) {
            try {
               errorData = await response.json();
            } catch (e) {
               const text = await response.text();
               errorData = { message: text || `Upload failed with status ${response.status}` };
            }
         } else {
            const text = await response.text();
            errorData = { message: text || `Upload failed with status ${response.status}` };
         }

         throw new Error(errorData.message || errorData.error || "Failed to upload image");
      }

      const data = await response.json();
      const url = data?.data?.url || data?.url;
      if (!url) {
         throw new Error(data?.message || "Failed to upload image");
      }

      return {
         type: file.type,
         url,
         filename: file.name,
         uploadedAt: new Date(),
      };
   };

   const validateFile = (file: File): string | null => {
      // Strict file type validation using sanitization utility
      if (!isValidImageType(file.type)) {
         return "Only JPG, PNG, and WebP images are allowed";
      }

      // Strict file size validation
      if (!isValidFileSize(file.size, maxSizeMB)) {
         return `File size must be less than ${maxSizeMB}MB`;
      }

      // Check filename length and characters
      if (file.name.length > 255) {
         return "Filename is too long";
      }

      // Check total number of files
      if (value.length >= maxFiles) {
         return `Maximum ${maxFiles} images allowed`;
      }

      return null;
   };

   const handleFileSelect = useCallback(
      async (files: FileList | null) => {
         if (!files || files.length === 0) return;

         const filesArray = Array.from(files);
         const remainingSlots = maxFiles - value.length;

         if (filesArray.length > remainingSlots) {
            toast.error(`You can only upload ${remainingSlots} more image(s)`);
            return;
         }

         setIsUploading(true);
         const newAttachments: Attachment[] = [];

         for (const file of filesArray) {
            const error = validateFile(file);
            if (error) {
               toast.error(error, { description: file.name });
               continue;
            }

            try {
               const attachment = await uploadFile(file);
               newAttachments.push(attachment);
            } catch (error) {
               const message =
                  error instanceof Error && error.message
                     ? error.message
                     : "Upload failed";
               toast.error(message, { description: file.name });
            }
         }

         if (newAttachments.length > 0) {
            onChange([...value, ...newAttachments]);
            toast.success(`${newAttachments.length} image(s) uploaded successfully`);
         }

         setIsUploading(false);
      },
      [value, onChange, maxFiles, maxSizeMB]
   );

   const handleDrop = useCallback(
      (e: React.DragEvent<HTMLDivElement>) => {
         e.preventDefault();
         setIsDragging(false);
         handleFileSelect(e.dataTransfer.files);
      },
      [handleFileSelect]
   );

   const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setIsDragging(true);
   }, []);

   const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setIsDragging(false);
   }, []);

   const removeAttachment = useCallback(
      (index: number) => {
         const updated = value.filter((_, i) => i !== index);
         onChange(updated);
         toast.success("Image removed");
      },
      [value, onChange]
   );

   return (
      <div className="space-y-4">
         {/* Upload Area */}
         {value.length < maxFiles && (
            <div
               onDrop={handleDrop}
               onDragOver={handleDragOver}
               onDragLeave={handleDragLeave}
               className={cn(
                  "relative border-2 border-dashed rounded-lg p-6 transition-all",
                  isDragging
                     ? "border-primary-600 bg-primary-50"
                     : "border-gray-300 bg-gray-50 hover:border-gray-400 hover:bg-gray-100"
               )}
            >
               <input
                  type="file"
                  accept="image/*"
                  multiple
                  disabled={isUploading}
                  onChange={(e) => handleFileSelect(e.target.files)}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
                  id="image-upload"
               />

               <div className="flex flex-col items-center justify-center text-center">
                  {isUploading ? (
                     <>
                        <Loader2 className="w-12 h-12 text-primary-600 animate-spin mb-3" />
                        <p className="text-sm font-medium text-gray-700">Uploading images...</p>
                     </>
                  ) : (
                     <>
                        <div className="w-16 h-16 rounded-full bg-primary-100 flex items-center justify-center mb-3">
                           <Upload className="w-8 h-8 text-primary-600" />
                        </div>
                        <p className="text-sm font-medium text-gray-900 mb-1">
                           {isDragging ? "Drop images here" : "Upload task images"}
                        </p>
                        <p className="text-xs text-gray-500 mb-3">
                           Drag & drop or click to browse
                        </p>
                        <p className="text-xs text-gray-400">
                           Max {maxFiles} images • Up to {maxSizeMB}MB each • JPG, PNG, WEBP
                        </p>
                     </>
                  )}
               </div>
            </div>
         )}

         {/* Image Grid */}
         {value.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
               {value.map((attachment, index) => (
                  <div
                     key={index}
                     className="relative group aspect-square rounded-lg overflow-hidden border-2 border-gray-200 bg-gray-100"
                  >
                     {/* Image Preview */}
                     <img
                        src={attachment.url}
                        alt={attachment.filename}
                        className="w-full h-full object-cover"
                     />

                     {/* Overlay on Hover */}
                     <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <Button
                           type="button"
                           variant="destructive"
                           size="sm"
                           onClick={() => removeAttachment(index)}
                           className="h-8 px-3 text-xs gap-1"
                        >
                           <X className="w-4 h-4" />
                           Remove
                        </Button>
                     </div>

                     {/* Filename */}
                     <div className="absolute bottom-0 left-0 right-0 bg-linear-to-t from-black/70 to-transparent p-2">
                        <p className="text-xs text-white truncate">{attachment.filename}</p>
                     </div>
                  </div>
               ))}
            </div>
         )}

         {/* Counter */}
         {value.length > 0 && (
            <div className="flex items-center justify-between text-xs text-gray-500">
               <span>
                  {value.length} of {maxFiles} images uploaded
               </span>
               {value.length === maxFiles && (
                  <span className="text-amber-600 font-medium">
                     Maximum limit reached
                  </span>
               )}
            </div>
         )}
      </div>
   );
}
