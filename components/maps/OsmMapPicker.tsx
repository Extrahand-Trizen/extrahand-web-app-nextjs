"use client";

import React, { memo, useMemo } from "react";
import { MapContainer, Marker, TileLayer, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

interface OsmMapPickerProps {
   center: [number, number]; // [lng, lat]
   markerPosition: [number, number]; // [lng, lat]
   onMarkerDragEnd: (lat: number, lng: number) => void;
}

function MapClickHandler({
   onMarkerDragEnd,
}: {
   onMarkerDragEnd: (lat: number, lng: number) => void;
}) {
   useMapEvents({
      click: (event) => {
         onMarkerDragEnd(event.latlng.lat, event.latlng.lng);
      },
   });

   return null;
}

function OsmMapPickerComponent({
   center,
   markerPosition,
   onMarkerDragEnd,
}: OsmMapPickerProps) {
   const markerIcon = useMemo(
      () =>
         L.divIcon({
            className: "osm-location-marker",
            html: '<div style="width:28px;height:34px;display:flex;align-items:center;justify-content:center;filter:drop-shadow(0 2px 4px rgba(0,0,0,0.35));"><svg width="26" height="34" viewBox="0 0 24 32" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><path d="M12 0C5.925 0 1 4.925 1 11c0 8.25 11 21 11 21s11-12.75 11-21C23 4.925 18.075 0 12 0z" fill="#ef4444"/><circle cx="12" cy="11" r="5" fill="#ffffff"/></svg></div>',
            iconSize: [28, 34],
            iconAnchor: [14, 33],
         }),
      []
   );

   return (
      <MapContainer
         center={[center[1], center[0]]}
         zoom={15}
         style={{ width: "100%", height: "100%" }}
         zoomControl
      >
         <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            maxZoom={19}
         />

         <Marker
            position={[markerPosition[1], markerPosition[0]]}
            draggable
            icon={markerIcon}
            eventHandlers={{
               dragend: (event) => {
                  const latLng = (event.target as L.Marker).getLatLng();
                  onMarkerDragEnd(latLng.lat, latLng.lng);
               },
            }}
         />

         <MapClickHandler onMarkerDragEnd={onMarkerDragEnd} />
      </MapContainer>
   );
}

export const OsmMapPicker = memo(OsmMapPickerComponent);
