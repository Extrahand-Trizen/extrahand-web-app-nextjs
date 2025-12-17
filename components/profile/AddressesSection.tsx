"use client";

/**
 * Addresses Section
 * Manage saved addresses for task locations
 */

import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
   MapPin,
   Plus,
   Trash2,
   Edit2,
   CheckCircle2,
   Home,
   Briefcase,
   CreditCard,
   MoreHorizontal,
   Star,
   Navigation,
   Phone,
   X,
} from "lucide-react";
import { SavedAddress, AddressType } from "@/types/profile";

interface AddressesSectionProps {
   addresses?: SavedAddress[];
   onEditAddress?: (address: SavedAddress) => void;
   onDeleteAddress?: (id: string) => void;
   onSetDefault?: (id: string) => void;
   onSaveAddress?: (address: Partial<SavedAddress>) => void;
}

// Mock addresses for development
const mockAddresses: SavedAddress[] = [
   {
      id: "addr1",
      type: "home",
      label: "Home",
      name: "Anita Kapoor",
      addressLine1: "Flat 402, Sunrise Apartments",
      addressLine2: "Sector 15, Koregaon Park",
      landmark: "Near Phoenix Mall",
      city: "Pune",
      state: "Maharashtra",
      pinCode: "411001",
      country: "India",
      phone: "+91 98765 43210",
      isDefault: true,
      isVerified: true,
      coordinates: { lat: 18.5362, lng: 73.8939 },
      createdAt: new Date("2024-01-15"),
   },
   {
      id: "addr2",
      type: "work",
      label: "Office",
      name: "Anita Kapoor",
      addressLine1: "WeWork, Tower B, 5th Floor",
      addressLine2: "Magarpatta City",
      city: "Pune",
      state: "Maharashtra",
      pinCode: "411028",
      country: "India",
      phone: "+91 98765 43210",
      isDefault: false,
      isVerified: true,
      coordinates: { lat: 18.5089, lng: 73.926 },
      createdAt: new Date("2024-02-20"),
   },
   {
      id: "addr3",
      type: "other",
      label: "Parents' Home",
      name: "Suresh Kapoor",
      addressLine1: "12, Shanti Nagar",
      landmark: "Opposite City Hospital",
      city: "Mumbai",
      state: "Maharashtra",
      pinCode: "400001",
      country: "India",
      phone: "+91 99887 76655",
      alternatePhone: "+91 22 2345 6789",
      isDefault: false,
      isVerified: false,
      createdAt: new Date("2024-03-10"),
   },
];

export function AddressesSection({
   addresses = mockAddresses,
   onEditAddress,
   onDeleteAddress,
   onSetDefault,
   onSaveAddress,
}: AddressesSectionProps) {
   const [expandedId, setExpandedId] = useState<string | null>(null);

   // Internal modal state
   const [showAddressModal, setShowAddressModal] = useState(false);
   const [editingAddress, setEditingAddress] = useState<
      SavedAddress | undefined
   >(undefined);

   // Internal handlers
   const handleAddAddress = () => {
      setEditingAddress(undefined);
      setShowAddressModal(true);
   };

   const handleEditAddress = (address: SavedAddress) => {
      setEditingAddress(address);
      setShowAddressModal(true);
      if (onEditAddress) onEditAddress(address);
   };

   const handleSaveAddress = (data: Partial<SavedAddress>) => {
      if (onSaveAddress) {
         onSaveAddress(data);
      } else {
         console.log("Address saved:", data);
      }
      setShowAddressModal(false);
      setEditingAddress(undefined);
   };

   const getTypeIcon = (type: AddressType) => {
      switch (type) {
         case "home":
            return <Home className="w-4 h-4" />;
         case "work":
            return <Briefcase className="w-4 h-4" />;
         case "billing":
            return <CreditCard className="w-4 h-4" />;
         default:
            return <MapPin className="w-4 h-4" />;
      }
   };

   const getTypeColor = (type: AddressType) => {
      switch (type) {
         case "home":
            return "bg-blue-100 text-blue-700";
         case "work":
            return "bg-purple-100 text-purple-700";
         case "billing":
            return "bg-green-100 text-green-700";
         default:
            return "bg-gray-100 text-gray-700";
      }
   };

   return (
      <div className="max-w-4xl space-y-4 sm:space-y-6">
         {/* Header */}
         <div className="flex items-start justify-between">
            <div>
               <h2 className="text-base sm:text-lg font-semibold text-gray-900">
                  Saved Addresses
               </h2>
               <p className="text-xs sm:text-sm text-gray-500 mt-1">
                  Manage your saved locations for quick task posting
               </p>
            </div>
            <Button
               onClick={handleAddAddress}
               size="sm"
               className="text-xs h-8 px-3 bg-primary-600 hover:bg-primary-700"
            >
               <Plus className="w-3.5 h-3.5 mr-1.5" />
               Add Address
            </Button>
         </div>

         {/* Address List */}
         <div className="space-y-3">
            {addresses.length > 0 ? (
               addresses.map((address) => (
                  <AddressCard
                     key={address.id}
                     address={address}
                     isExpanded={expandedId === address.id}
                     onToggle={() =>
                        setExpandedId(
                           expandedId === address.id ? null : address.id
                        )
                     }
                     onEdit={() => handleEditAddress(address)}
                     onDelete={() => onDeleteAddress?.(address.id)}
                     onSetDefault={() => onSetDefault?.(address.id)}
                     getTypeIcon={getTypeIcon}
                     getTypeColor={getTypeColor}
                  />
               ))
            ) : (
               <div className="bg-white rounded-lg border border-gray-200 px-4 py-8 sm:px-5 sm:py-10 text-center">
                  <MapPin className="w-10 h-10 sm:w-12 sm:h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-sm text-gray-600 font-medium mb-1">
                     No addresses saved
                  </p>
                  <p className="text-xs text-gray-500 mb-4">
                     Add your frequently used locations for faster task posting
                  </p>
                  <Button
                     onClick={handleAddAddress}
                     size="sm"
                     className="text-xs h-9 bg-primary-600 hover:bg-primary-700"
                  >
                     <Plus className="w-4 h-4 mr-2" />
                     Add Your First Address
                  </Button>
               </div>
            )}
         </div>

         {/* Info Section */}
         {addresses.length > 0 && (
            <div className="bg-gray-50 rounded-lg p-3 sm:p-4">
               <div className="flex items-start gap-2">
                  <Navigation className="w-4 h-4 text-gray-500 mt-0.5 shrink-0" />
                  <div>
                     <p className="text-xs sm:text-sm font-medium text-gray-700">
                        Quick Location Selection
                     </p>
                     <p className="text-[10px] sm:text-xs text-gray-500 mt-0.5">
                        Your saved addresses will appear as quick options when
                        posting tasks. The default address is pre-selected
                        automatically.
                     </p>
                  </div>
               </div>
            </div>
         )}

         {/* Address Form Modal */}
         <AddressForm
            address={editingAddress}
            isOpen={showAddressModal}
            onClose={() => {
               setShowAddressModal(false);
               setEditingAddress(undefined);
            }}
            onSave={handleSaveAddress}
         />
      </div>
   );
}

interface AddressCardProps {
   address: SavedAddress;
   isExpanded: boolean;
   onToggle: () => void;
   onEdit: () => void;
   onDelete: () => void;
   onSetDefault: () => void;
   getTypeIcon: (type: AddressType) => React.ReactNode;
   getTypeColor: (type: AddressType) => string;
}

function AddressCard({
   address,
   isExpanded,
   onToggle,
   onEdit,
   onDelete,
   onSetDefault,
   getTypeIcon,
   getTypeColor,
}: AddressCardProps) {
   const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

   const fullAddress = [
      address.addressLine1,
      address.addressLine2,
      address.landmark && `Near ${address.landmark}`,
      `${address.city}, ${address.state} ${address.pinCode}`,
   ]
      .filter(Boolean)
      .join(", ");

   return (
      <div
         className={cn(
            "bg-white rounded-lg border transition-all duration-200",
            address.isDefault
               ? "border-primary-200 ring-1 ring-primary-100"
               : "border-gray-200",
            isExpanded && "shadow-sm"
         )}
      >
         {/* Main Row */}
         <div
            className="px-4 py-3 sm:px-5 sm:py-4 cursor-pointer"
            onClick={onToggle}
         >
            <div className="flex items-start gap-3">
               {/* Icon */}
               <div
                  className={cn(
                     "w-9 h-9 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center shrink-0",
                     getTypeColor(address.type)
                  )}
               >
                  {getTypeIcon(address.type)}
               </div>

               {/* Content */}
               <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                     <span className="text-sm font-semibold text-gray-900">
                        {address.label}
                     </span>
                     {address.isDefault && (
                        <Badge
                           variant="secondary"
                           className="text-[10px] bg-primary-100 text-primary-700 px-1.5 py-0"
                        >
                           <Star className="w-2.5 h-2.5 mr-0.5 fill-current" />
                           Default
                        </Badge>
                     )}
                     {address.isVerified && (
                        <CheckCircle2 className="w-3.5 h-3.5 text-green-500" />
                     )}
                  </div>
                  <p className="text-xs sm:text-sm text-gray-600 line-clamp-2">
                     {fullAddress}
                  </p>
               </div>

               {/* Actions Toggle */}
               <button
                  onClick={(e) => {
                     e.stopPropagation();
                     onToggle();
                  }}
                  className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
               >
                  <MoreHorizontal className="w-4 h-4 text-gray-400" />
               </button>
            </div>
         </div>

         {/* Expanded Content */}
         {isExpanded && (
            <div className="px-4 pb-4 sm:px-5 sm:pb-5 pt-0">
               {/* Additional Details */}
               <div className="pl-12 sm:pl-13 space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-xs text-gray-600">
                     <span className="font-medium text-gray-500">
                        Recipient:
                     </span>
                     <span>{address.name}</span>
                  </div>
                  {address.phone && (
                     <div className="flex items-center gap-2 text-xs text-gray-600">
                        <Phone className="w-3 h-3 text-gray-400" />
                        <span>{address.phone}</span>
                        {address.alternatePhone && (
                           <span className="text-gray-400">
                              / {address.alternatePhone}
                           </span>
                        )}
                     </div>
                  )}
                  {address.coordinates && (
                     <div className="flex items-center gap-2 text-xs text-gray-500">
                        <Navigation className="w-3 h-3" />
                        <span>
                           {address.coordinates.lat.toFixed(4)},{" "}
                           {address.coordinates.lng.toFixed(4)}
                        </span>
                     </div>
                  )}
               </div>

               {/* Action Buttons */}
               <div className="flex items-center gap-2 pl-12 sm:pl-13">
                  {!address.isDefault && (
                     <Button
                        variant="outline"
                        size="sm"
                        onClick={(e) => {
                           e.stopPropagation();
                           onSetDefault();
                        }}
                        className="text-xs h-8 px-3"
                     >
                        <Star className="w-3 h-3 mr-1.5" />
                        Set as Default
                     </Button>
                  )}
                  <Button
                     variant="outline"
                     size="sm"
                     onClick={(e) => {
                        e.stopPropagation();
                        onEdit();
                     }}
                     className="text-xs h-8 px-3"
                  >
                     <Edit2 className="w-3 h-3 mr-1.5" />
                     Edit
                  </Button>

                  {showDeleteConfirm ? (
                     <div className="flex items-center gap-1.5 ml-auto">
                        <span className="text-xs text-red-600 mr-1">
                           Delete?
                        </span>
                        <Button
                           variant="destructive"
                           size="sm"
                           onClick={(e) => {
                              e.stopPropagation();
                              onDelete();
                              setShowDeleteConfirm(false);
                           }}
                           className="text-xs h-7 px-2"
                        >
                           Yes
                        </Button>
                        <Button
                           variant="ghost"
                           size="sm"
                           onClick={(e) => {
                              e.stopPropagation();
                              setShowDeleteConfirm(false);
                           }}
                           className="text-xs h-7 px-2"
                        >
                           No
                        </Button>
                     </div>
                  ) : (
                     <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                           e.stopPropagation();
                           setShowDeleteConfirm(true);
                        }}
                        className="text-xs h-8 px-2 text-gray-400 hover:text-red-600 ml-auto"
                     >
                        <Trash2 className="w-3.5 h-3.5" />
                     </Button>
                  )}
               </div>
            </div>
         )}
      </div>
   );
}

// Address Form Modal Component
interface AddressFormProps {
   address?: SavedAddress;
   isOpen: boolean;
   onClose: () => void;
   onSave: (address: Partial<SavedAddress>) => void;
}

export function AddressForm({
   address,
   isOpen,
   onClose,
   onSave,
}: AddressFormProps) {
   const [formData, setFormData] = useState<Partial<SavedAddress>>(
      address || {
         type: "home",
         label: "",
         name: "",
         addressLine1: "",
         addressLine2: "",
         landmark: "",
         city: "",
         state: "",
         pinCode: "",
         country: "India",
         phone: "",
      }
   );

   const [errors, setErrors] = useState<Record<string, string>>({});

   if (!isOpen) return null;

   const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();

      // Basic validation
      const newErrors: Record<string, string> = {};
      if (!formData.label) newErrors.label = "Label is required";
      if (!formData.name) newErrors.name = "Name is required";
      if (!formData.addressLine1)
         newErrors.addressLine1 = "Address is required";
      if (!formData.city) newErrors.city = "City is required";
      if (!formData.state) newErrors.state = "State is required";
      if (!formData.pinCode) newErrors.pinCode = "PIN code is required";

      if (Object.keys(newErrors).length > 0) {
         setErrors(newErrors);
         return;
      }

      onSave(formData);
      onClose();
   };

   const addressTypes: { value: AddressType; label: string }[] = [
      { value: "home", label: "Home" },
      { value: "work", label: "Work" },
      { value: "billing", label: "Billing" },
      { value: "other", label: "Other" },
   ];

   return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
         <div className="bg-white rounded-xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-xl">
            {/* Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
               <h3 className="text-base font-semibold text-gray-900">
                  {address ? "Edit Address" : "Add New Address"}
               </h3>
               <button
                  onClick={onClose}
                  className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
               >
                  <X className="w-5 h-5 text-gray-500" />
               </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-4 space-y-4">
               {/* Address Type */}
               <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1.5">
                     Address Type
                  </label>
                  <div className="flex gap-2">
                     {addressTypes.map((type) => (
                        <button
                           key={type.value}
                           type="button"
                           onClick={() =>
                              setFormData({ ...formData, type: type.value })
                           }
                           className={cn(
                              "flex-1 py-2 px-3 rounded-lg text-xs font-medium border transition-colors",
                              formData.type === type.value
                                 ? "border-primary-500 bg-primary-50 text-primary-700"
                                 : "border-gray-200 text-gray-600 hover:border-gray-300"
                           )}
                        >
                           {type.label}
                        </button>
                     ))}
                  </div>
               </div>

               {/* Label */}
               <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1.5">
                     Label *
                  </label>
                  <input
                     type="text"
                     value={formData.label || ""}
                     onChange={(e) =>
                        setFormData({ ...formData, label: e.target.value })
                     }
                     placeholder="e.g., Home, Office, Mom's Place"
                     className={cn(
                        "w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500",
                        errors.label ? "border-red-300" : "border-gray-300"
                     )}
                  />
                  {errors.label && (
                     <p className="text-xs text-red-500 mt-1">{errors.label}</p>
                  )}
               </div>

               {/* Recipient Name */}
               <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1.5">
                     Recipient Name *
                  </label>
                  <input
                     type="text"
                     value={formData.name || ""}
                     onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                     }
                     placeholder="Full name"
                     className={cn(
                        "w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500",
                        errors.name ? "border-red-300" : "border-gray-300"
                     )}
                  />
                  {errors.name && (
                     <p className="text-xs text-red-500 mt-1">{errors.name}</p>
                  )}
               </div>

               {/* Address Line 1 */}
               <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1.5">
                     Address Line 1 *
                  </label>
                  <input
                     type="text"
                     value={formData.addressLine1 || ""}
                     onChange={(e) =>
                        setFormData({
                           ...formData,
                           addressLine1: e.target.value,
                        })
                     }
                     placeholder="House/Flat No., Building Name, Street"
                     className={cn(
                        "w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500",
                        errors.addressLine1
                           ? "border-red-300"
                           : "border-gray-300"
                     )}
                  />
                  {errors.addressLine1 && (
                     <p className="text-xs text-red-500 mt-1">
                        {errors.addressLine1}
                     </p>
                  )}
               </div>

               {/* Address Line 2 */}
               <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1.5">
                     Address Line 2
                  </label>
                  <input
                     type="text"
                     value={formData.addressLine2 || ""}
                     onChange={(e) =>
                        setFormData({
                           ...formData,
                           addressLine2: e.target.value,
                        })
                     }
                     placeholder="Area, Colony, Sector"
                     className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
               </div>

               {/* Landmark */}
               <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1.5">
                     Landmark
                  </label>
                  <input
                     type="text"
                     value={formData.landmark || ""}
                     onChange={(e) =>
                        setFormData({ ...formData, landmark: e.target.value })
                     }
                     placeholder="Nearby landmark for easy finding"
                     className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
               </div>

               {/* City & State */}
               <div className="grid grid-cols-2 gap-3">
                  <div>
                     <label className="block text-xs font-medium text-gray-700 mb-1.5">
                        City *
                     </label>
                     <input
                        type="text"
                        value={formData.city || ""}
                        onChange={(e) =>
                           setFormData({ ...formData, city: e.target.value })
                        }
                        placeholder="City"
                        className={cn(
                           "w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500",
                           errors.city ? "border-red-300" : "border-gray-300"
                        )}
                     />
                     {errors.city && (
                        <p className="text-xs text-red-500 mt-1">
                           {errors.city}
                        </p>
                     )}
                  </div>
                  <div>
                     <label className="block text-xs font-medium text-gray-700 mb-1.5">
                        State *
                     </label>
                     <input
                        type="text"
                        value={formData.state || ""}
                        onChange={(e) =>
                           setFormData({ ...formData, state: e.target.value })
                        }
                        placeholder="State"
                        className={cn(
                           "w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500",
                           errors.state ? "border-red-300" : "border-gray-300"
                        )}
                     />
                     {errors.state && (
                        <p className="text-xs text-red-500 mt-1">
                           {errors.state}
                        </p>
                     )}
                  </div>
               </div>

               {/* PIN Code & Country */}
               <div className="grid grid-cols-2 gap-3">
                  <div>
                     <label className="block text-xs font-medium text-gray-700 mb-1.5">
                        PIN Code *
                     </label>
                     <input
                        type="text"
                        value={formData.pinCode || ""}
                        onChange={(e) =>
                           setFormData({ ...formData, pinCode: e.target.value })
                        }
                        placeholder="6-digit PIN"
                        maxLength={6}
                        className={cn(
                           "w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500",
                           errors.pinCode ? "border-red-300" : "border-gray-300"
                        )}
                     />
                     {errors.pinCode && (
                        <p className="text-xs text-red-500 mt-1">
                           {errors.pinCode}
                        </p>
                     )}
                  </div>
                  <div>
                     <label className="block text-xs font-medium text-gray-700 mb-1.5">
                        Country
                     </label>
                     <input
                        type="text"
                        value={formData.country || "India"}
                        onChange={(e) =>
                           setFormData({ ...formData, country: e.target.value })
                        }
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                     />
                  </div>
               </div>

               {/* Phone */}
               <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1.5">
                     Phone Number
                  </label>
                  <input
                     type="tel"
                     value={formData.phone || ""}
                     onChange={(e) =>
                        setFormData({ ...formData, phone: e.target.value })
                     }
                     placeholder="+91 XXXXX XXXXX"
                     className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
               </div>

               {/* Submit */}
               <div className="flex gap-3 pt-2">
                  <Button
                     type="button"
                     variant="outline"
                     onClick={onClose}
                     className="flex-1"
                  >
                     Cancel
                  </Button>
                  <Button
                     type="submit"
                     className="flex-1 bg-primary-600 hover:bg-primary-700"
                  >
                     {address ? "Save Changes" : "Add Address"}
                  </Button>
               </div>
            </form>
         </div>
      </div>
   );
}
