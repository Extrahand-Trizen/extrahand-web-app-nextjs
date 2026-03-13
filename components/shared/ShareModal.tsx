"use client";

import React, { useState } from "react";
import {
   Copy,
   Check,
   X,
   Facebook,
   Linkedin,
   Twitter,
   MessageCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface ShareModalProps {
   isOpen: boolean;
   onClose: () => void;
   title: string;
   description?: string;
   url: string;
   shareText?: string;
}

export function ShareModal({
   isOpen,
   onClose,
   title,
   description,
   url,
   shareText = "Check this out on ExtraHand!",
}: ShareModalProps) {
   const [copied, setCopied] = useState(false);

   if (!isOpen) return null;

   const handleCopyLink = async () => {
      try {
         await navigator.clipboard.writeText(url);
         setCopied(true);
         toast.success("Link copied to clipboard!");
         setTimeout(() => setCopied(false), 2000);
      } catch (err) {
         toast.error("Failed to copy link");
      }
   };

   const shareOnPlatform = (platform: string) => {
      const encodedUrl = encodeURIComponent(url);
      const encodedText = encodeURIComponent(shareText);
      let shareUrl = "";

      switch (platform) {
         case "facebook":
            shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
            break;
         case "linkedin":
            shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`;
            break;
         case "twitter":
            shareUrl = `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedText}`;
            break;
         case "whatsapp":
            shareUrl = `https://wa.me/?text=${encodedText}%20${encodedUrl}`;
            break;
      }

      if (shareUrl) {
         window.open(shareUrl, "_blank", "width=600,height=400");
      }
   };

   return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
         <div className="bg-white rounded-lg shadow-lg max-w-md w-full">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
               <div>
                  <h2 className="text-lg font-semibold text-gray-900">
                     Share {title}
                  </h2>
                  {description && (
                     <p className="text-sm text-gray-500 mt-1">{description}</p>
                  )}
               </div>
               <button
                  onClick={onClose}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
               >
                  <X className="w-5 h-5" />
               </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
               {/* Copy Link Section */}
               <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                     Copy Link
                  </label>
                  <div className="flex items-center gap-2">
                     <input
                        type="text"
                        value={url}
                        readOnly
                        className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 bg-gray-50"
                     />
                     <button
                        onClick={handleCopyLink}
                        className="p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                     >
                        {copied ? (
                           <Check className="w-5 h-5 text-green-600" />
                        ) : (
                           <Copy className="w-5 h-5" />
                        )}
                     </button>
                  </div>
               </div>

               {/* Social Share */}
               <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                     Share on Social Media
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                     <button
                        onClick={() => shareOnPlatform("facebook")}
                        className="flex items-center justify-center gap-2 px-4 py-2 border border-gray-200 rounded-lg hover:bg-blue-50 transition-colors"
                     >
                        <Facebook className="w-4 h-4 text-blue-600" />
                        <span className="text-sm font-medium">Facebook</span>
                     </button>
                     <button
                        onClick={() => shareOnPlatform("linkedin")}
                        className="flex items-center justify-center gap-2 px-4 py-2 border border-gray-200 rounded-lg hover:bg-blue-50 transition-colors"
                     >
                        <Linkedin className="w-4 h-4 text-blue-700" />
                        <span className="text-sm font-medium">LinkedIn</span>
                     </button>
                     <button
                        onClick={() => shareOnPlatform("twitter")}
                        className="flex items-center justify-center gap-2 px-4 py-2 border border-gray-200 rounded-lg hover:bg-blue-50 transition-colors"
                     >
                        <Twitter className="w-4 h-4 text-blue-500" />
                        <span className="text-sm font-medium">Twitter</span>
                     </button>
                     <button
                        onClick={() => shareOnPlatform("whatsapp")}
                        className="flex items-center justify-center gap-2 px-4 py-2 border border-gray-200 rounded-lg hover:bg-green-50 transition-colors"
                     >
                        <MessageCircle className="w-4 h-4 text-green-600" />
                        <span className="text-sm font-medium">WhatsApp</span>
                     </button>
                  </div>
               </div>

               {/* Share Text Preview */}
               <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                     Share Message
                  </label>
                  <p className="px-3 py-2 bg-gray-50 rounded-lg text-sm text-gray-600 border border-gray-200">
                     {shareText}
                  </p>
               </div>
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
               <Button variant="outline" onClick={onClose}>
                  Close
               </Button>
            </div>
         </div>
      </div>
   );
}

export default ShareModal;
