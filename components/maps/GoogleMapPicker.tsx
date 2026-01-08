"use client";

/**
 * Google Maps Component with Draggable Marker
 * Optimized for minimal API calls
 */

import React, { useState, useCallback, memo } from "react";
import { GoogleMap, useJsApiLoader, Marker } from "@react-google-maps/api";
import { Loader2 } from "lucide-react";

interface GoogleMapPickerProps {
   center: [number, number]; // [lng, lat]
   markerPosition: [number, number]; // [lng, lat]
   onMarkerDragEnd: (lat: number, lng: number) => void;
   apiKey: string;
}

const mapContainerStyle = {
   width: "100%",
   height: "100%",
};

const defaultMapOptions = {
   disableDefaultUI: false,
   zoomControl: true,
   streetViewControl: false,
   mapTypeControl: false,
   fullscreenControl: false,
   clickableIcons: false,
};

function GoogleMapPickerComponent({
   center,
   markerPosition,
   onMarkerDragEnd,
   apiKey,
}: GoogleMapPickerProps) {
   const [map, setMap] = useState<google.maps.Map | null>(null);

   const { isLoaded, loadError } = useJsApiLoader({
      id: "google-map-script",
      googleMapsApiKey: apiKey,
   });

   const onLoad = useCallback((map: google.maps.Map) => {
      setMap(map);
   }, []);

   const onUnmount = useCallback(() => {
      setMap(null);
   }, []);

   const handleMarkerDragEnd = useCallback(
      (e: google.maps.MapMouseEvent) => {
         if (e.latLng) {
            const lat = e.latLng.lat();
            const lng = e.latLng.lng();
            onMarkerDragEnd(lat, lng);
         }
      },
      [onMarkerDragEnd]
   );

   const handleMapClick = useCallback(
      (e: google.maps.MapMouseEvent) => {
         if (e.latLng) {
            const lat = e.latLng.lat();
            const lng = e.latLng.lng();
            onMarkerDragEnd(lat, lng);
         }
      },
      [onMarkerDragEnd]
   );

   if (loadError) {
      return (
         <div className="w-full h-full flex items-center justify-center bg-gray-100 rounded-lg border-2 border-gray-200">
            <div className="text-center text-red-600">
               <p className="text-sm font-medium">Failed to load map</p>
               <p className="text-xs mt-1">{loadError.message}</p>
            </div>
         </div>
      );
   }

   if (!isLoaded) {
      return (
         <div className="w-full h-full flex items-center justify-center bg-gray-100 rounded-lg border-2 border-gray-200">
            <div className="text-center text-gray-500">
               <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2" />
               <p className="text-sm font-medium">Loading map...</p>
            </div>
         </div>
      );
   }

   return (
      <GoogleMap
         mapContainerStyle={mapContainerStyle}
         center={{ lat: center[1], lng: center[0] }}
         zoom={15}
         onLoad={onLoad}
         onUnmount={onUnmount}
         onClick={handleMapClick}
         options={defaultMapOptions}
      >
         <Marker
            position={{ lat: markerPosition[1], lng: markerPosition[0] }}
            draggable={true}
            onDragEnd={handleMarkerDragEnd}
         />
      </GoogleMap>
   );
}

// Memoize to prevent unnecessary re-renders
export const GoogleMapPicker = memo(GoogleMapPickerComponent);
