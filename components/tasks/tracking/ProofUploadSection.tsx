"use client";

/**
 * ProofUploadSection - Component for uploading completion proof
 * Allows taskers to upload proof images and submit for poster review
 */

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Upload,
  X,
  Image as ImageIcon,
  Loader2,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import Image from "next/image";
import type { Task } from "@/types/task";
import { toast } from "sonner";

interface ProofUploadSectionProps {
  task: Task;
  onSubmitProof: (proofUrls: string[], notes?: string) => Promise<void>;
  userRole: "poster" | "tasker" | "viewer";
}

export function ProofUploadSection({
  task,
  onSubmitProof,
  userRole,
}: ProofUploadSectionProps) {
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [notes, setNotes] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const hasExistingProof =
    task.completionProof && task.completionProof.length > 0;
  const isInReview = task.status === "review";
  const isCompleted = task.status === "completed";
  const canUpload = userRole === "tasker" && task.status === "in_progress";

  // Handle file selection
  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);

    try {
      // Validate all files first
      const validFiles: File[] = [];
      for (let i = 0; i < files.length; i++) {
        const file = files[i];

        // Validate file type
        if (!file.type.startsWith("image/")) {
          toast.error(`${file.name} is not an image file`);
          continue;
        }

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
          toast.error(`${file.name} is too large (max 5MB)`);
          continue;
        }

        validFiles.push(file);
      }

      if (validFiles.length === 0) {
        toast.error("No valid images to upload");
        return;
      }

      // Upload all valid files in a single request
      const formData = new FormData();
      validFiles.forEach(file => {
        formData.append("images", file); // Backend expects 'images' field
      });

      // Use proper API client pattern - construct URL same way as fetchWithAuth
      const { getApiBaseUrl, CORS_CONFIG, isDevelopment } = await import("@/lib/config");
      const cleanApiBase = getApiBaseUrl().replace(/\/$/, "");
      const cleanPath = `uploads/completion-proof/${task._id}/multiple`;
      const uploadUrl = `${cleanApiBase}/api/v1/${cleanPath}`;
      
      console.log("🔧 Uploading to:", uploadUrl);
      
      const corsConfig = CORS_CONFIG[isDevelopment ? "development" : "production"];
      
      const response = await fetch(uploadUrl, {
        method: "POST",
        body: formData,
        // Don't set Content-Type - let browser set it with boundary for multipart
        ...corsConfig,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Upload failed with status ${response.status}`);
      }

      const data = await response.json();
      // Backend returns { success: true, data: { urls: [...] } }
      const imageUrls = data.data?.urls || [];

      if (imageUrls.length > 0) {
        setUploadedImages([...uploadedImages, ...imageUrls]);
        toast.success(`${imageUrls.length} image(s) uploaded successfully`);
      } else {
        throw new Error("No URLs returned from upload");
      }
    } catch (error) {
      console.error("Upload error:", error);
      toast.error(error instanceof Error ? error.message : "Failed to upload images");
    } finally {
      setIsUploading(false);
      // Reset file input
      e.target.value = "";
    }
  };

  // Remove uploaded image
  const handleRemoveImage = (indexToRemove: number) => {
    setUploadedImages(uploadedImages.filter((_, i) => i !== indexToRemove));
  };


  // Submit proof
  const handleSubmit = async () => {
    // Check if there are uploaded images (local state) or existing proof
    const hasProof = uploadedImages.length > 0 || (task.completionProof && task.completionProof.length > 0);
    if (!hasProof) {
      toast.error("Please upload at least one proof image");
      return;
    }

    setIsSubmitting(true);
    try {
      // Pass uploadedImages to the submit handler
      await onSubmitProof(uploadedImages, notes.trim() || undefined);
      // Clear local state after successful submit
      setUploadedImages([]);
      setNotes("");
    } catch (error) {
      console.error("Submit proof error:", error);
      toast.error("Failed to submit proof");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Show existing proof for review, completed, or cancelled states (read-only)
  if (hasExistingProof && (isInReview || isCompleted || task.status === 'cancelled')) {
    const statusConfig = {
      review: {
        icon: CheckCircle2,
        iconColor: 'text-green-600',
        title: 'Completion Proof Submitted',
        bgColor: 'bg-green-50',
        borderColor: 'border-green-200',
        textColor: 'text-green-800',
        message: 'Your work has been submitted and is awaiting approval from the task poster.'
      },
      completed: {
        icon: CheckCircle2,
        iconColor: 'text-blue-600',
        title: 'Completed Work Proof',
        bgColor: 'bg-blue-50',
        borderColor: 'border-blue-200',
        textColor: 'text-blue-800',
        message: 'This task has been completed and approved.'
      },
      cancelled: {
        icon: AlertCircle,
        iconColor: 'text-gray-600',
        title: 'Submitted Proof (Task Cancelled)',
        bgColor: 'bg-gray-50',
        borderColor: 'border-gray-200',
        textColor: 'text-gray-700',
        message: 'This task was cancelled.'
      }
    };

    const config = statusConfig[task.status as keyof typeof statusConfig] || statusConfig.review;
    const StatusIcon = config.icon;

    return (
      <div className="bg-white rounded-xl shadow-sm border border-secondary-200 p-4 md:p-6">
        <div className="flex items-center gap-2 mb-4">
          <StatusIcon className={`w-5 h-5 ${config.iconColor}`} />
          <h2 className="text-base md:text-lg font-semibold md:font-bold text-secondary-900">
            {config.title}
          </h2>
        </div>

        <div className={`${config.bgColor} border ${config.borderColor} rounded-lg p-4 mb-4`}>
          <p className={`text-sm ${config.textColor}`}>
            {config.message}
          </p>
        </div>

        {/* Display submitted proof */}
        <div className="space-y-4">
          <div>
            <Label className="text-sm font-medium text-secondary-700">
              Submitted Images
            </Label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-2">
              {task.completionProof?.map((proof, index) => (
                <div
                  key={proof.url || index}
                  className="relative aspect-square rounded-lg overflow-hidden border border-secondary-200"
                >
                  <Image
                    src={proof.url}
                    alt={`Proof ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          </div>

          {task.completionNotes && (
            <div>
              <Label className="text-sm font-medium text-secondary-700">
                Notes
              </Label>
              <p className="text-sm text-secondary-600 mt-1 p-3 bg-secondary-50 rounded-lg">
                {task.completionNotes}
              </p>
            </div>
          )}
        </div>
      </div>
    );
  }

  // If proof was rejected, show rejection reason
  if (task.completionStatus === "rejected") {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-secondary-200 p-4 md:p-6">
        <div className="flex items-center gap-2 mb-4">
          <AlertCircle className="w-5 h-5 text-orange-600" />
          <h2 className="text-base md:text-lg font-semibold md:font-bold text-secondary-900">
            Upload Completion Proof
          </h2>
        </div>

        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-4">
          <p className="text-sm font-medium text-orange-900 mb-1">
            Your previous submission was rejected
          </p>
          <p className="text-sm text-orange-700">
            {task.completionRejectedReason ||
              "Please review the feedback and resubmit."}
          </p>
        </div>

        {/* Continue with upload form below */}
      </div>
    );
  }

  // Show empty state or upload form for taskers
  if (!canUpload) {
    // Show empty state for tasker when task is in progress but no proof yet
    if (!hasExistingProof) {
      return (
        <div className="bg-white rounded-xl shadow-sm border border-secondary-200 p-4 md:p-6">
          <div className="flex items-center gap-2 mb-4">
            <ImageIcon className="w-5 h-5 text-secondary-600" />
            <h2 className="text-base md:text-lg font-semibold md:font-bold text-secondary-900">
              Completion Proof
            </h2>
          </div>
          <div className="text-center py-8">
            <ImageIcon className="w-12 h-12 text-secondary-400 mx-auto mb-3" />
            
            <p className="text-sm text-secondary-600">
              No proof of work uploaded yet
            </p>
            <p className="text-xs text-secondary-500 mt-1">
              {userRole === "tasker"
                ? "Upload proof when task is in progress"
                : "Proof of work will be uploaded here"
              }
            </p>
          </div>
        </div>
      );
    }
    return null;
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-secondary-200 p-4 md:p-6">
      <div className="flex items-center gap-2 mb-4">
        <Upload className="w-5 h-5 text-secondary-600" />
        <h2 className="text-base md:text-lg font-semibold md:font-bold text-secondary-900">
          Upload Completion Proof
        </h2>
      </div>

      <p className="text-sm text-secondary-600 mb-4">
        Upload images showing your completed work. The task poster will review
        your submission before approving completion.
      </p>

      {/* File Upload */}
      <div className="space-y-4">
        <div>
          <Label htmlFor="proof-upload" className="text-sm font-medium">
            Proof Images *
          </Label>
          <div className="mt-2">
            <label
              htmlFor="proof-upload"
              className="flex flex-col items-center justify-center w-full h-32 px-4 border-2 border-dashed rounded-lg cursor-pointer bg-secondary-50 hover:bg-secondary-100 border-secondary-300"
            >
              {isUploading ? (
                <div className="flex flex-col items-center">
                  <Loader2 className="w-8 h-8 text-primary-600 animate-spin mb-2" />
                  <span className="text-sm text-secondary-600">
                    Uploading...
                  </span>
                </div>
              ) : (
                <div className="flex flex-col items-center">
                  <ImageIcon className="w-8 h-8 text-secondary-400 mb-2" />
                  <span className="text-sm text-secondary-600">
                    Click to upload images
                  </span>
                  <span className="text-xs text-secondary-500 mt-1">
                    PNG, JPG up to 5MB each
                  </span>
                </div>
              )}
              <input
                id="proof-upload"
                type="file"
                className="hidden"
                accept="image/*"
                multiple
                onChange={handleFileSelect}
                disabled={isUploading}
              />
            </label>
          </div>
        </div>

        {/* Preview uploaded images */}
        {uploadedImages.length > 0 && (
          <div>
            <Label className="text-sm font-medium">
              Uploaded Images ({uploadedImages.length})
            </Label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-2">
              {uploadedImages.map((url, index) => (
                <div
                  key={index}
                  className="relative aspect-square rounded-lg overflow-hidden border border-secondary-200 group"
                >
                  <Image
                    src={url}
                    alt={`Proof ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                  <button
                    onClick={() => handleRemoveImage(index)}
                    className="absolute top-2 right-2 p-1 bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Completion Notes */}
        <div>
          <Label htmlFor="completion-notes" className="text-sm font-medium">
            Completion Notes (Optional)
          </Label>
          <Textarea
            id="completion-notes"
            placeholder="Add any notes about the completed work..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
            className="mt-2"
          />
        </div>

        {/* Submit Button */}
        <Button
          onClick={handleSubmit}
          disabled={isSubmitting || (uploadedImages.length === 0 && (!task.completionProof || task.completionProof.length === 0))}
          className="w-full"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Submitting...
            </>
          ) : (
            <>
              <CheckCircle2 className="w-4 h-4 mr-2" />
              Submit for Review
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
