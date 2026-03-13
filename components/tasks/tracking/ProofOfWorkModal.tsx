"use client";

/**
 * ProofOfWorkModal - Modal to prompt user to add proof of work before submission
 * Shows recommended message about uploading before/after photos
 */

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Upload, CheckCircle2 } from "lucide-react";

interface ProofOfWorkModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpload: () => void;
  onSkip: () => void;
  isLoading?: boolean;
}

export function ProofOfWorkModal({
  open,
  onOpenChange,
  onUpload,
  onSkip,
  isLoading = false,
}: ProofOfWorkModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            Add Proof of Work (Recommended)
          </DialogTitle>
          <DialogDescription className="sr-only">
            Upload before and after photos to verify your work
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Icon and Message */}
          <div className="flex flex-col items-center text-center space-y-3">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
              <Upload className="w-8 h-8 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-700 leading-relaxed">
                Upload before and after photos of the completed task. This helps verify
                the work and prevents disputes.
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-3">
            <Button
              onClick={onUpload}
              disabled={isLoading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium h-10"
            >
              <Upload className="w-4 h-4 mr-2" />
              Upload Images
            </Button>
            <Button
              onClick={onSkip}
              disabled={isLoading}
              variant="outline"
              className="w-full font-medium h-10"
            >
              <CheckCircle2 className="w-4 h-4 mr-2" />
              Skip & Submit
            </Button>
          </div>

          {/* Info Text */}
          <p className="text-xs text-center text-gray-500">
            You can add or change images even after submitting
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
