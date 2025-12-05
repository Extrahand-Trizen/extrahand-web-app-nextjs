/**
 * Geocoding service
 * Handles location geocoding and reverse geocoding
 */

export interface Location {
  latitude: number;
  longitude: number;
  address?: string;
}

export interface GeocodingResult {
  address: string;
  components: {
    street?: string;
    city?: string;
    state?: string;
    country?: string;
    postalCode?: string;
  };
}

// Use a CORS-free geocoding service
const reverseGeocodeWithFallback = async (latitude: number, longitude: number): Promise<GeocodingResult> => {
  try {
    const response = await fetch(
      `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (response.ok) {
      const data = await response.json();
      return {
        address: data.locality || data.city || data.countryName || `Lat: ${latitude.toFixed(4)}, Lng: ${longitude.toFixed(4)}`,
        components: {
          street: data.street || '',
          city: data.city || data.locality || '',
          state: data.principalSubdivision || '',
          country: data.countryName || '',
          postalCode: data.postcode || '',
        },
      };
    }
  } catch (error) {
    console.log('BigDataCloud geocoding failed, trying fallback...');
  }

  // Fallback: return coordinates as address
  return {
    address: `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`,
    components: {
      street: '',
      city: '',
      state: '',
      country: '',
      postalCode: '',
    },
  };
};

// Free geocoding service using OpenStreetMap Nominatim API
export const reverseGeocode = async (latitude: number, longitude: number): Promise<GeocodingResult> => {
  try {
    return await reverseGeocodeWithFallback(latitude, longitude);
  } catch (error) {
    console.error('Reverse geocoding error:', error);
    return {
      address: `Lat: ${latitude.toFixed(4)}, Lng: ${longitude.toFixed(4)}`,
      components: {},
    };
  }
};

// Forward geocoding - convert address to coordinates
export const forwardGeocode = async (address: string): Promise<Location | null> => {
  try {
    const response = await fetch(
      `https://api.bigdatacloud.net/data/geocode-client?q=${encodeURIComponent(address)}&localityLanguage=en`,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error('Geocoding request failed');
    }

    const data = await response.json();
    
    if (data && data.latitude && data.longitude) {
      return {
        latitude: data.latitude,
        longitude: data.longitude,
        address: data.locality || data.city || data.countryName || address,
      };
    }
    
    return null;
  } catch (error) {
    console.error('Forward geocoding error:', error);
    return null;
  }
};

// Get current location using browser geolocation
export const getCurrentLocation = (): Promise<Location> => {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !navigator.geolocation) {
      reject(new Error('Geolocation is not supported'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const location: Location = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        };

        // Get address for current location
        try {
          const geocoded = await reverseGeocode(location.latitude, location.longitude);
          location.address = geocoded.address;
        } catch (error) {
          console.warn('Failed to get address for current location:', error);
        }

        resolve(location);
      },
      (error) => {
        reject(new Error(`Geolocation error: ${error.message}`));
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000,
      }
    );
  });
};

// Search for places (limited functionality with free API)
export const searchPlaces = async (query: string): Promise<Array<{ name: string; address: string; location: Location }>> => {
  try {
    const response = await fetch(
      `https://api.bigdatacloud.net/data/geocode-client?q=${encodeURIComponent(query)}&localityLanguage=en&limit=5`,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error('Place search request failed');
    }

    const data = await response.json();
    
    if (data && Array.isArray(data)) {
      return data.map((item: any) => ({
        name: item.locality || item.city || item.countryName || query,
        address: item.locality || item.city || item.countryName || query,
        location: {
          latitude: item.latitude,
          longitude: item.longitude,
          address: item.locality || item.city || item.countryName || query,
        },
      }));
    }
    
    return [];
  } catch (error) {
    console.error('Place search error:', error);
    return [];
  }
};

