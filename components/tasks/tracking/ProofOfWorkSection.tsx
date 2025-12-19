"use client";

/**
 * ProofOfWorkSection - Main section for proof of work management
 * Handles uploads, displays gallery, and manages proof history
 */

import React, { useState } from "react";
import { Plus, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProofUploadForm } from "./ProofUploadForm";
import { ProofGallery } from "./ProofGallery";
import type { ProofOfWork } from "@/types/tracking";
import type { Attachment } from "@/components/shared/ImageUpload";

interface ProofOfWorkSectionProps {
   taskId: string;
   proofs: ProofOfWork[];
   userRole: "poster" | "tasker" | "viewer";
   onProofUpload: (
      proof: Omit<ProofOfWork, "_id" | "uploadedAt">
   ) => Promise<void>;
   currentUserId?: string;
}

export function ProofOfWorkSection({
   taskId,
   proofs,
   userRole,
   onProofUpload,
   currentUserId,
}: ProofOfWorkSectionProps) {
   const [showUploadForm, setShowUploadForm] = useState(false);
   const [activeTab, setActiveTab] = useState<"gallery" | "upload">("gallery");

   // Only tasker can upload proof of work
   const canUpload = userRole === "tasker";

   const handleUpload = async (files: Attachment[], caption?: string) => {
      // Convert Attachment[] to ProofOfWork format
      const proofData: Omit<ProofOfWork, "_id" | "uploadedAt"> = {
         taskId,
         uploadedBy: currentUserId || "",
         uploadedByName: "You", // Would come from auth context
         files: files.map((file) => ({
            url: file.url,
            filename: file.filename,
            type: file.type,
            size: 0, // Would be calculated from file
         })),
         caption,
      };

      await onProofUpload(proofData);
      setShowUploadForm(false);
      setActiveTab("gallery");
   };

   return (
      <div className="bg-white rounded-xl shadow-sm border border-secondary-200 p-4 md:p-6">
         <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4 md:mb-6">
            <div>
               <h2 className="text-base md:text-lg font-semibold md:font-bold text-secondary-900">
                  Proof of Work
               </h2>
               <p className="text-xs md:text-sm text-secondary-600 mt-1">
                  {proofs.length} upload{proofs.length !== 1 ? "s" : ""} total
               </p>
            </div>
            {canUpload && !showUploadForm && (
               <Button
                  onClick={() => {
                     setShowUploadForm(true);
                     setActiveTab("upload");
                  }}
                  size="sm"
                  className="w-full sm:w-auto text-sm"
               >
                  <Plus className="w-4 h-4 mr-2" />
                  Upload Proof
               </Button>
            )}
         </div>

         {showUploadForm && canUpload ? (
            <div className="border border-secondary-200 rounded-lg p-3 md:p-4 lg:p-6 bg-secondary-50">
               <div className="flex items-center justify-between mb-3 md:mb-4">
                  <h3 className="text-sm md:text-base font-semibold text-secondary-900">
                     Upload New Proof
                  </h3>
                  <Button
                     variant="ghost"
                     size="sm"
                     onClick={() => {
                        setShowUploadForm(false);
                        setActiveTab("gallery");
                     }}
                     className="text-xs md:text-sm"
                  >
                     Cancel
                  </Button>
               </div>
               <ProofUploadForm
                  taskId={taskId}
                  onUpload={handleUpload}
                  onCancel={() => {
                     setShowUploadForm(false);
                     setActiveTab("gallery");
                  }}
               />
            </div>
         ) : (
            <ProofGallery proofs={proofs} currentUserId={currentUserId} />
         )}
      </div>
   );
}
