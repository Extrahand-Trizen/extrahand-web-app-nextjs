/**
 * Addresses API endpoints
 */

import { fetchWithAuth } from '../client';
import { SavedAddress } from '@/types/profile';

export interface AddAddressPayload {
  label: 'Home' | 'Work' | 'Other';
  address: string;
  coordinates: [number, number];
  city?: string;
  state?: string;
  country?: string;
  addressDetails?: {
    doorNo?: string;
    landmark?: string;
    area?: string;
    pinCode?: string;
  };
  name?: string;
  phone?: string;
  isDefault?: boolean;
}

export const addressesApi = {
  /**
   * Get all saved addresses
   */
  async getAddresses(): Promise<SavedAddress[]> {
    const response: any = await fetchWithAuth('profiles/me/addresses');
    
    // Map backend format to frontend format
    return (response.data || []).map((addr: any) => ({
      id: addr._id,
      type: addr.label.toLowerCase() as 'home' | 'work' | 'other',
      label: addr.label,
      name: addr.name || '',
      addressLine1: addr.address,
      addressLine2: addr.addressDetails?.area || '',
      landmark: addr.addressDetails?.landmark,
      city: addr.city || '',
      state: addr.state || '',
      pinCode: addr.addressDetails?.pinCode || '',
      country: addr.country || 'India',
      phone: addr.phone,
      isDefault: addr.isDefault || false,
      isVerified: false,
      coordinates: {
        lat: addr.coordinates[1],
        lng: addr.coordinates[0]
      },
      createdAt: new Date(addr.createdAt)
    }));
  },

  /**
   * Add a new address
   */
  async addAddress(data: Partial<SavedAddress>): Promise<SavedAddress> {
    // Convert frontend format to backend format
    const payload: AddAddressPayload = {
      label: (data.label || 'Home') as 'Home' | 'Work' | 'Other',
      address: data.addressLine1 || '',
      coordinates: data.coordinates 
        ? [data.coordinates.lng, data.coordinates.lat]
        : [0, 0],
      city: data.city,
      state: data.state,
      country: data.country || 'India',
      addressDetails: {
        doorNo: '',
        landmark: data.landmark,
        area: data.addressLine2,
        pinCode: data.pinCode
      },
      name: data.name,
      phone: data.phone,
      isDefault: data.isDefault
    };

    const response: any = await fetchWithAuth('profiles/me/addresses', {
      method: 'POST',
      body: JSON.stringify(payload),
    });

    const addr = response.data;
    return {
      id: addr._id,
      type: addr.label.toLowerCase() as 'home' | 'work' | 'other',
      label: addr.label,
      name: addr.name || '',
      addressLine1: addr.address,
      addressLine2: addr.addressDetails?.area || '',
      landmark: addr.addressDetails?.landmark,
      city: addr.city || '',
      state: addr.state || '',
      pinCode: addr.addressDetails?.pinCode || '',
      country: addr.country || 'India',
      phone: addr.phone,
      isDefault: addr.isDefault || false,
      isVerified: false,
      coordinates: {
        lat: addr.coordinates[1],
        lng: addr.coordinates[0]
      },
      createdAt: new Date(addr.createdAt)
    };
  },

  /**
   * Update an existing address
   */
  async updateAddress(id: string, data: Partial<SavedAddress>): Promise<SavedAddress> {
    // Convert frontend format to backend format
    const payload: Partial<AddAddressPayload> = {};
    
    if (data.label) payload.label = data.label as 'Home' | 'Work' | 'Other';
    if (data.addressLine1) payload.address = data.addressLine1;
    if (data.coordinates) {
      payload.coordinates = [data.coordinates.lng, data.coordinates.lat];
    }
    if (data.city) payload.city = data.city;
    if (data.state) payload.state = data.state;
    if (data.country) payload.country = data.country;
    if (data.addressLine2 || data.landmark || data.pinCode) {
      payload.addressDetails = {
        doorNo: '',
        landmark: data.landmark,
        area: data.addressLine2,
        pinCode: data.pinCode
      };
    }
    if (data.name) payload.name = data.name;
    if (data.phone) payload.phone = data.phone;
    if (data.isDefault !== undefined) payload.isDefault = data.isDefault;

    const response: any = await fetchWithAuth(`profiles/me/addresses/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    });

    const addr = response.data;
    return {
      id: addr._id,
      type: addr.label.toLowerCase() as 'home' | 'work' | 'other',
      label: addr.label,
      name: addr.name || '',
      addressLine1: addr.address,
      addressLine2: addr.addressDetails?.area || '',
      landmark: addr.addressDetails?.landmark,
      city: addr.city || '',
      state: addr.state || '',
      pinCode: addr.addressDetails?.pinCode || '',
      country: addr.country || 'India',
      phone: addr.phone,
      isDefault: addr.isDefault || false,
      isVerified: false,
      coordinates: {
        lat: addr.coordinates[1],
        lng: addr.coordinates[0]
      },
      createdAt: new Date(addr.createdAt)
    };
  },

  /**
   * Delete an address
   */
  async deleteAddress(id: string): Promise<void> {
    await fetchWithAuth(`profiles/me/addresses/${id}`, {
      method: 'DELETE',
    });
  },

  /**
   * Set an address as default
   */
  async setDefaultAddress(id: string): Promise<SavedAddress> {
    const response: any = await fetchWithAuth(`profiles/me/addresses/${id}/default`, {
      method: 'PATCH',
    });

    const addr = response.data;
    return {
      id: addr._id,
      type: addr.label.toLowerCase() as 'home' | 'work' | 'other',
      label: addr.label,
      name: addr.name || '',
      addressLine1: addr.address,
      addressLine2: addr.addressDetails?.area || '',
      landmark: addr.addressDetails?.landmark,
      city: addr.city || '',
      state: addr.state || '',
      pinCode: addr.addressDetails?.pinCode || '',
      country: addr.country || 'India',
      phone: addr.phone,
      isDefault: addr.isDefault || false,
      isVerified: false,
      coordinates: {
        lat: addr.coordinates[1],
        lng: addr.coordinates[0]
      },
      createdAt: new Date(addr.createdAt)
    };
  }
};
