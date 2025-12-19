"use client";

/**
 * ProofGallery - Displays uploaded proof of work files
 * Shows gallery with preview, captions, and metadata
 */

import React, { useState } from "react";
import { Download, Eye, Calendar, User, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
   Dialog,
   DialogContent,
   DialogDescription,
   DialogHeader,
   DialogTitle,
} from "@/components/ui/dialog";
import { format } from "date-fns";
import type { ProofOfWork } from "@/types/tracking";
import { cn } from "@/lib/utils";

interface ProofGalleryProps {
   proofs: ProofOfWork[];
   currentUserId?: string;
}

export function ProofGallery({ proofs, currentUserId }: ProofGalleryProps) {
   const [selectedProof, setSelectedProof] = useState<ProofOfWork | null>(null);
   const [selectedFileIndex, setSelectedFileIndex] = useState(0);

   if (proofs.length === 0) {
      return (
         <div className="bg-white rounded-xl shadow-sm border border-secondary-200 p-6 md:p-8 text-center">
            <FileText className="w-10 h-10 md:w-12 md:h-12 text-secondary-300 mx-auto mb-3" />
            <p className="text-sm md:text-base text-secondary-600 font-medium mb-1">
               No proof of work uploaded yet
            </p>
            <p className="text-xs md:text-sm text-secondary-500">
               Upload files to show progress and completion of the task
            </p>
         </div>
      );
   }

   const isImage = (fileType: string) => {
      return fileType.startsWith("image/");
   };

   const handleFileClick = (proof: ProofOfWork, fileIndex: number) => {
      setSelectedProof(proof);
      setSelectedFileIndex(fileIndex);
   };

   const selectedFile = selectedProof?.files[selectedFileIndex];

   return (
      <>
         <div className="space-y-3 md:space-y-4">
            {proofs.map((proof) => (
               <div
                  key={proof._id}
                  className="bg-white rounded-xl shadow-sm border border-secondary-200 p-3 md:p-4 lg:p-6"
               >
                  {/* Proof header */}
                  <div className="flex items-start justify-between mb-3 md:mb-4">
                     <div className="flex items-center gap-2 md:gap-3">
                        {proof.uploadedByAvatar ? (
                           <img
                              src={proof.uploadedByAvatar}
                              alt={proof.uploadedByName}
                              className="w-8 h-8 md:w-10 md:h-10 rounded-full object-cover"
                           />
                        ) : (
                           <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-primary-100 flex items-center justify-center">
                              <User className="w-4 h-4 md:w-5 md:h-5 text-primary-600" />
                           </div>
                        )}
                        <div>
                           <p className="text-sm md:text-base font-medium md:font-semibold text-secondary-900">
                              {proof.uploadedByName}
                           </p>
                           <div className="flex items-center gap-1.5 md:gap-2 text-[10px] md:text-xs text-secondary-500">
                              <Calendar className="w-3 h-3" />
                              <span>
                                 {format(
                                    new Date(proof.uploadedAt),
                                    "MMM dd, yyyy 'at' h:mm a"
                                 )}
                              </span>
                           </div>
                        </div>
                     </div>
                  </div>

                  {/* Caption */}
                  {proof.caption && (
                     <p className="text-xs md:text-sm text-secondary-700 mb-3 md:mb-4 leading-relaxed">
                        {proof.caption}
                     </p>
                  )}

                  {/* Files grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 gap-2 md:gap-3">
                     {proof.files.map((file, index) => (
                        <div
                           key={index}
                           className="group relative aspect-square rounded-lg overflow-hidden border border-secondary-200 cursor-pointer hover:border-primary-400 transition-colors"
                           onClick={() => handleFileClick(proof, index)}
                        >
                           {isImage(file.type) ? (
                              <img
                                 src={file.thumbnailUrl || file.url}
                                 alt={file.filename}
                                 className="w-full h-full object-cover"
                              />
                           ) : (
                              <div className="w-full h-full bg-secondary-100 flex flex-col items-center justify-center p-1.5 md:p-2">
                                 <FileText className="w-6 h-6 md:w-8 md:h-8 text-secondary-400 mb-1" />
                                 <p className="text-[10px] md:text-xs text-secondary-600 text-center line-clamp-2 px-1">
                                    {file.filename}
                                 </p>
                              </div>
                           )}
                           <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                              <Eye className="w-4 h-4 md:w-5 md:h-5 text-white" />
                           </div>
                        </div>
                     ))}
                  </div>

                  {/* File count */}
                  <p className="text-[10px] md:text-xs text-secondary-500 mt-2 md:mt-3">
                     {proof.files.length} file
                     {proof.files.length !== 1 ? "s" : ""} uploaded
                  </p>
               </div>
            ))}
         </div>

         {/* File preview dialog */}
         <Dialog
            open={!!selectedProof}
            onOpenChange={() => setSelectedProof(null)}
         >
            <DialogContent className="max-w-[95vw] md:max-w-4xl max-h-[90vh] overflow-auto p-4 md:p-6">
               <DialogHeader>
                  <DialogTitle className="text-base md:text-lg">
                     {selectedFile?.filename || "File Preview"}
                  </DialogTitle>
                  <DialogDescription className="text-xs md:text-sm">
                     Uploaded by {selectedProof?.uploadedByName} on{" "}
                     {selectedProof &&
                        format(
                           new Date(selectedProof.uploadedAt),
                           "MMM dd, yyyy 'at' h:mm a"
                        )}
                  </DialogDescription>
               </DialogHeader>

               {selectedFile && (
                  <div className="mt-4">
                     {isImage(selectedFile.type) ? (
                        <img
                           src={selectedFile.url}
                           alt={selectedFile.filename}
                           className="w-full h-auto rounded-lg"
                        />
                     ) : (
                        <div className="bg-secondary-50 rounded-lg p-4 md:p-8 text-center">
                           <FileText className="w-12 h-12 md:w-16 md:h-16 text-secondary-400 mx-auto mb-3 md:mb-4" />
                           <p className="text-sm md:text-base font-medium text-secondary-900 mb-2">
                              {selectedFile.filename}
                           </p>
                           <p className="text-xs md:text-sm text-secondary-600 mb-3 md:mb-4">
                              {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                           </p>
                           <Button
                              variant="outline"
                              onClick={() =>
                                 window.open(selectedFile.url, "_blank")
                              }
                              className="text-sm"
                           >
                              <Download className="w-4 h-4 mr-2" />
                              Download File
                           </Button>
                        </div>
                     )}

                     {/* Navigation for multiple files */}
                     {selectedProof && selectedProof.files.length > 1 && (
                        <div className="flex items-center justify-between mt-3 md:mt-4 pt-3 md:pt-4 border-t border-secondary-200">
                           <Button
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                 setSelectedFileIndex(
                                    selectedFileIndex > 0
                                       ? selectedFileIndex - 1
                                       : selectedProof.files.length - 1
                                 )
                              }
                              className="text-xs md:text-sm"
                           >
                              Previous
                           </Button>
                           <span className="text-xs md:text-sm text-secondary-600">
                              {selectedFileIndex + 1} of{" "}
                              {selectedProof.files.length}
                           </span>
                           <Button
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                 setSelectedFileIndex(
                                    selectedFileIndex <
                                       selectedProof.files.length - 1
                                       ? selectedFileIndex + 1
                                       : 0
                                 )
                              }
                              className="text-xs md:text-sm"
                           >
                              Next
                           </Button>
                        </div>
                     )}
                  </div>
               )}
            </DialogContent>
         </Dialog>
      </>
   );
}
