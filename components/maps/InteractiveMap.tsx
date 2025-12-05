'use client';

/**
 * Interactive Map component using Leaflet
 * For location selection
 * NOTE: This component must only be used with dynamic import (ssr: false)
 */

import React, { useEffect, useRef, useState } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icon in React Leaflet (only on client)
if (typeof window !== 'undefined' && L && L.Icon && L.Icon.Default) {
  delete (L.Icon.Default.prototype as any)._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  });
}

interface InteractiveMapProps {
  onLocationSelect: (location: { latitude: number; longitude: number; address?: string }) => void;
  initialLocation?: { latitude: number; longitude: number };
  className?: string;
  height?: number;
  width?: string;
  showCurrentLocation?: boolean;
}

function MapClickHandler({ onLocationSelect }: { onLocationSelect: (location: { latitude: number; longitude: number }) => void }) {
  useMapEvents({
    click: (e) => {
      const { lat, lng } = e.latlng;
      onLocationSelect({ latitude: lat, longitude: lng });
    },
  });
  return null;
}

function SetViewOnLocation({ location }: { location: { latitude: number; longitude: number } }) {
  const map = useMap();
  useEffect(() => {
    map.setView([location.latitude, location.longitude], map.getZoom());
  }, [location, map]);
  return null;
}

export const InteractiveMap: React.FC<InteractiveMapProps> = ({
  onLocationSelect,
  initialLocation,
  className,
  height = 450,
  width = '100%',
  showCurrentLocation = false,
}) => {
  const [mounted, setMounted] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<{ latitude: number; longitude: number } | null>(
    initialLocation || null
  );
  const [isGettingLocation, setIsGettingLocation] = useState(false);

  // Only render map on client side
  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLocationSelect = (location: { latitude: number; longitude: number }) => {
    setSelectedLocation(location);
    onLocationSelect(location);
  };

  const handleCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }

    setIsGettingLocation(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const newLocation = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        };
        setSelectedLocation(newLocation);
        onLocationSelect(newLocation);
        setIsGettingLocation(false);
      },
      (error) => {
        console.error('Error getting current location:', error);
        alert('Unable to get your current location. Please select manually on the map.');
        setIsGettingLocation(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  };

  useEffect(() => {
    if (initialLocation) {
      setSelectedLocation(initialLocation);
    }
  }, [initialLocation]);

  const defaultCenter: [number, number] = selectedLocation
    ? [selectedLocation.latitude, selectedLocation.longitude]
    : [17.3850, 78.4867]; // Hyderabad default

  const mapClassName = className || 'w-full rounded-lg';
  const mapStyle = {
    height: typeof height === 'number' ? `${height}px` : height,
    width: width,
    position: 'relative' as const,
    zIndex: 1,
  };

  // Don't render map during SSR
  if (!mounted || typeof window === 'undefined') {
    return (
      <div className={mapClassName} style={mapStyle}>
        <div className="w-full h-full flex items-center justify-center bg-gray-100 rounded-lg">
          <p className="text-gray-500">Loading map...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={mapClassName} style={mapStyle}>
      <MapContainer
        center={defaultCenter}
        zoom={13}
        style={{ height: '100%', width: '100%', position: 'relative', zIndex: 1 }}
        className="rounded-lg"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapClickHandler onLocationSelect={handleLocationSelect} />
        {selectedLocation && (
          <>
            <Marker position={[selectedLocation.latitude, selectedLocation.longitude]} />
            <SetViewOnLocation location={selectedLocation} />
          </>
        )}
      </MapContainer>
      
      {showCurrentLocation && (
        <button
          onClick={handleCurrentLocation}
          disabled={isGettingLocation}
          className="absolute bottom-4 right-4 z-[1000] bg-white rounded-full p-3 shadow-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          style={{ zIndex: 1000 }}
          title="Get current location"
        >
          <span className="text-xl">
            {isGettingLocation ? '⏳' : '📍'}
          </span>
        </button>
      )}
    </div>
  );
};
