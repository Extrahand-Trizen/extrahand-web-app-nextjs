"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { MapPin } from "lucide-react";
import type { Task } from "@/types/task";

interface TaskMapProps {
   tasks: Task[];
   selectedTaskId?: string | null;
   onTaskSelect?: (taskId: string) => void;
   onBoundsUpdate?: (bounds: google.maps.LatLngBounds) => void;
   centerCoordinates?: { lat: number; lng: number };
   className?: string;
}

/**
 * TaskMap Component - Production-ready with bounds control
 * Features: Debounced bounds updates, keyboard accessible, privacy-aware locations
 * Performance: Throttled updates, lazy marker rendering
 */
export function TaskMap({
   tasks,
   selectedTaskId,
   onTaskSelect,
   onBoundsUpdate,
   centerCoordinates = { lat: 17.385, lng: 78.4867 },
   className = "",
}: TaskMapProps) {
   const mapRef = useRef<HTMLDivElement>(null);
   const mapInstanceRef = useRef<google.maps.Map | null>(null);
   const markersRef = useRef<Array<{ id: string; marker: google.maps.Marker }>>(
      []
   );
   const infoWindowRef = useRef<google.maps.InfoWindow | null>(null);
   const [boundsChanged, setBoundsChanged] = useState(false);
   const [mapLoaded, setMapLoaded] = useState(false);
   const boundsChangeTimerRef = useRef<NodeJS.Timeout | null>(null);

   // Load Google Maps Script securely via backend proxy (only once globally)
   useEffect(() => {
      // Check if already loaded
      if (window.google?.maps) {
         setMapLoaded(true);
         return;
      }

      // Check if script is already being loaded
      const existingScript = document.querySelector(
         'script[src*="/api/maps/script"]'
      );

      if (existingScript) {
         // Script already exists, just wait for it to load
         existingScript.addEventListener("load", () => setMapLoaded(true));
         return;
      }

      // Load script from our secure backend proxy
      const script = document.createElement("script");
      script.src = "/api/maps/script"; // Backend route that hides the API key
      script.async = true;
      script.defer = true;
      script.onload = () => setMapLoaded(true);
      script.onerror = () => console.error("Failed to load Google Maps");
      document.head.appendChild(script);

      return () => {
         // Cleanup: remove event listener if component unmounts before load
         if (existingScript) {
            existingScript.removeEventListener("load", () =>
               setMapLoaded(true)
            );
         }
      };
   }, []);

   // Initialize Google Map
   useEffect(() => {
      if (
         !mapLoaded ||
         !window.google?.maps ||
         !mapRef.current ||
         mapInstanceRef.current
      )
         return;

      try {
         const map = new google.maps.Map(mapRef.current, {
            center: centerCoordinates,
            zoom: 12,
            mapTypeControl: false,
            streetViewControl: false,
            fullscreenControl: false,
            zoomControl: true,
            zoomControlOptions: {
               position: google.maps.ControlPosition.RIGHT_CENTER,
            },
            gestureHandling: "greedy",
            styles: [
               {
                  featureType: "poi",
                  elementType: "labels",
                  stylers: [{ visibility: "off" }],
               },
            ],
         });

         mapInstanceRef.current = map;
         infoWindowRef.current = new google.maps.InfoWindow();

         // Debounced bounds change handler (500ms)
         map.addListener("bounds_changed", () => {
            if (boundsChangeTimerRef.current) {
               clearTimeout(boundsChangeTimerRef.current);
            }
            boundsChangeTimerRef.current = setTimeout(() => {
               setBoundsChanged(true);
            }, 500);
         });

         // Current location button
         const locationButton = document.createElement("button");
         locationButton.innerHTML = `
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="10"/>
          <circle cx="12" cy="12" r="3"/>
          <line x1="12" y1="2" x2="12" y2="6"/>
          <line x1="12" y1="18" x2="12" y2="22"/>
          <line x1="2" y1="12" x2="6" y2="12"/>
          <line x1="18" y1="12" x2="22" y2="12"/>
        </svg>
      `;
         locationButton.title = "Show my location";
         locationButton.className =
            "bg-white border-2 border-white rounded-lg shadow-md text-secondary-900 cursor-pointer w-10 h-10 m-2.5 p-0 flex items-center justify-center hover:bg-secondary-50 transition-colors";

         locationButton.addEventListener("click", () => {
            if (navigator.geolocation) {
               navigator.geolocation.getCurrentPosition(
                  (position) => {
                     const pos = {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude,
                     };
                     map.setCenter(pos);
                     map.setZoom(14);

                     new google.maps.Marker({
                        position: pos,
                        map: map,
                        icon: {
                           path: google.maps.SymbolPath.CIRCLE,
                           scale: 8,
                           fillColor: "#2563eb",
                           fillOpacity: 1,
                           strokeColor: "#fff",
                           strokeWeight: 2,
                        },
                        title: "Your Location",
                     });
                  },
                  () => {
                     alert("Error: The Geolocation service failed.");
                  }
               );
            }
         });

         map.controls[google.maps.ControlPosition.RIGHT_BOTTOM].push(
            locationButton
         );
      } catch (error) {
         console.error("Error initializing Google Maps:", error);
      }
   }, [mapLoaded, centerCoordinates]);

   // Handle apply bounds update
   const handleApplyBounds = () => {
      if (!mapInstanceRef.current || !onBoundsUpdate) return;
      const bounds = mapInstanceRef.current.getBounds();
      if (bounds) {
         onBoundsUpdate(bounds);
      }
      setBoundsChanged(false);
   };

   // Update markers when tasks change
   useEffect(() => {
      if (!mapInstanceRef.current || !mapLoaded) return;

      const map = mapInstanceRef.current;

      // Clear existing markers
      markersRef.current.forEach(({ marker }) => marker.setMap(null));
      markersRef.current = [];

      // Add markers for tasks with coordinates (jittered for privacy)
      tasks.forEach((task) => {
         if (
            task.location?.coordinates &&
            task.location.coordinates.length === 2
         ) {
            const [lng, lat] = task.location.coordinates;

            // Add slight jitter for privacy (±0.005 degrees ≈ 500m)
            const jitteredLat = lat + (Math.random() - 0.5) * 0.01;
            const jitteredLng = lng + (Math.random() - 0.5) * 0.01;

            const marker = new google.maps.Marker({
               position: { lat: jitteredLat, lng: jitteredLng },
               map: map,
               title: task.title,
               icon: {
                  path: google.maps.SymbolPath.CIRCLE,
                  scale: 8,
                  fillColor: "#f9b233",
                  fillOpacity: 0.9,
                  strokeColor: "#ffffff",
                  strokeWeight: 2,
               },
            });

            // Create info window content
            const budgetAmount =
               typeof task.budget === "object"
                  ? task.budget.amount
                  : task.budget;
            const infoContent = `
          <div style="padding: 12px; min-width: 250px; font-family: Inter, sans-serif;">
            <h3 style="font-weight: 600; margin: 0 0 8px 0; font-size: 15px; color: #0d1117;">
              ${task.title}
            </h3>
            <div style="display: flex; align-items: center; margin-bottom: 6px; color: #6b7280; font-size: 13px;">
              <span style="margin-right: 6px;">📍</span>
              <span>${task.location.city}, ${task.location.state}</span>
            </div>
            <div style="display: flex; align-items: center; margin-bottom: 6px; color: #6b7280; font-size: 13px;">
              <span style="margin-right: 6px;">💰</span>
              <span style="font-weight: 600; color: #0d1117;">₹${budgetAmount}</span>
            </div>
            <div style="display: flex; align-items: center; justify-content: space-between; padding-top: 8px; border-top: 1px solid #e5e7eb;">
              <span style="font-size: 12px; color: #6b7280;">
                ${task.status}
              </span>
              <a href="/tasks/${task._id}" style="color: #f9b233; font-weight: 600; font-size: 13px; text-decoration: none;">
                View →
              </a>
            </div>
          </div>
        `;

            marker.addListener("click", () => {
               // When parent shows overlay (TaskDetailCard), don't open InfoWindow to avoid overlapping cards
               if (onTaskSelect) {
                  infoWindowRef.current?.close();
                  onTaskSelect(task._id);
               } else {
                  infoWindowRef.current?.setContent(infoContent);
                  infoWindowRef.current?.open(map, marker);
               }
               map.panTo(marker.getPosition()!);
            });

            // Hover effects
            marker.addListener("mouseover", () => {
               marker.setIcon({
                  path: google.maps.SymbolPath.CIRCLE,
                  scale: 10,
                  fillColor: "#e6a030",
                  fillOpacity: 1,
                  strokeColor: "#ffffff",
                  strokeWeight: 2,
               });
            });

            marker.addListener("mouseout", () => {
               marker.setIcon({
                  path: google.maps.SymbolPath.CIRCLE,
                  scale: 8,
                  fillColor: "#f9b233",
                  fillOpacity: 0.9,
                  strokeColor: "#ffffff",
                  strokeWeight: 2,
               });
            });

            markersRef.current.push({ id: task._id, marker });
         }
      });
   }, [tasks, onTaskSelect, mapLoaded]);

   // Highlight selected task marker and keep InfoWindow closed when parent shows overlay
   useEffect(() => {
      if (!mapInstanceRef.current || !mapLoaded) return;
      // Close any open InfoWindow when selection changes so overlay is the single source of truth
      infoWindowRef.current?.close();
      if (!selectedTaskId) return;

      const selectedMarkerData = markersRef.current.find(
         ({ id }) => id === selectedTaskId
      );
      if (selectedMarkerData) {
         const { marker } = selectedMarkerData;
         mapInstanceRef.current.panTo(marker.getPosition()!);
         google.maps.event.trigger(marker, "click");
      }
   }, [selectedTaskId, mapLoaded]);

   return (
      <div className={`relative w-full h-full ${className}`}>
         {/* Bounds update notification */}
         {boundsChanged && onBoundsUpdate && (
            <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10 animate-in slide-in-from-top-2">
               <Button
                  onClick={handleApplyBounds}
                  className="bg-white hover:bg-secondary-50 text-secondary-900 shadow-lg border border-secondary-200 font-medium"
                  size="sm"
               >
                  <MapPin className="w-4 h-4 mr-2" />
                  Update results to this area
               </Button>
            </div>
         )}

         {/* Loading state */}
         {!mapLoaded && (
            <div className="absolute inset-0 flex items-center justify-center bg-secondary-50 z-10 rounded-lg">
               <div className="text-center p-8">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
                  <p className="text-sm text-secondary-600">Loading map...</p>
               </div>
            </div>
         )}

         <div
            ref={mapRef}
            className="w-full h-full rounded-lg"
            style={{ minHeight: "500px" }}
         />
      </div>
   );
}
