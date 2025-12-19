"use client";

/**
 * ProofUploadForm - Form component for uploading proof of work
 * Handles file selection, captions, and submission
 */

import React, { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ImageUpload } from "@/components/shared/ImageUpload";
import { Upload, X } from "lucide-react";
import { toast } from "sonner";

// Attachment type matching ImageUpload component
interface Attachment {
   type: string;
   url: string;
   filename: string;
   uploadedAt?: Date;
}

interface ProofUploadFormProps {
   taskId: string;
   onUpload: (files: Attachment[], caption?: string) => Promise<void>;
   onCancel?: () => void;
}

export function ProofUploadForm({
   taskId,
   onUpload,
   onCancel,
}: ProofUploadFormProps) {
   const [files, setFiles] = useState<Attachment[]>([]);
   const [caption, setCaption] = useState("");
   const [isUploading, setIsUploading] = useState(false);

   const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();

      if (files.length === 0) {
         toast.error("Please upload at least one file");
         return;
      }

      setIsUploading(true);
      try {
         await onUpload(files, caption.trim() || undefined);
         setFiles([]);
         setCaption("");
         toast.success("Proof of work uploaded successfully");
      } catch (error) {
         toast.error("Failed to upload proof of work");
         console.error(error);
      } finally {
         setIsUploading(false);
      }
   };

   return (
      <form onSubmit={handleSubmit} className="space-y-3 md:space-y-4">
         <div>
            <Label
               htmlFor="proof-files"
               className="mb-1.5 md:mb-2 block text-sm"
            >
               Upload Files
            </Label>
            <ImageUpload
               value={files}
               onChange={setFiles}
               maxFiles={10}
               maxSizeMB={10}
            />
            <p className="text-[10px] md:text-xs text-secondary-500 mt-1.5 md:mt-2">
               Upload images, PDFs, or other documents as proof of work (max 10
               files, 10MB each)
            </p>
         </div>

         <div>
            <Label
               htmlFor="proof-caption"
               className="mb-1.5 md:mb-2 block text-sm"
            >
               Caption (Optional)
            </Label>
            <Textarea
               id="proof-caption"
               placeholder="Add a description or notes about this proof of work..."
               value={caption}
               onChange={(e) => setCaption(e.target.value)}
               rows={3}
               maxLength={500}
               className="text-sm"
            />
            <p className="text-[10px] md:text-xs text-secondary-500 mt-1">
               {caption.length}/500 characters
            </p>
         </div>

         <div className="flex flex-col sm:flex-row gap-2 md:gap-3">
            {onCancel && (
               <Button
                  type="button"
                  variant="outline"
                  onClick={onCancel}
                  className="flex-1 text-sm"
                  disabled={isUploading}
               >
                  Cancel
               </Button>
            )}
            <Button
               type="submit"
               className="flex-1 text-sm"
               disabled={isUploading || files.length === 0}
            >
               {isUploading ? (
                  <>
                     <Upload className="w-4 h-4 mr-2 animate-pulse" />
                     Uploading...
                  </>
               ) : (
                  <>
                     <Upload className="w-4 h-4 mr-2" />
                     Upload Proof
                  </>
               )}
            </Button>
         </div>
      </form>
   );
}
