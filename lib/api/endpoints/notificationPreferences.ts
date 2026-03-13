/**
 * Notification Preferences API endpoints
 * Matches extrahand-user-service routes/notificationPreferences.ts
 */

import { fetchWithAuth } from '../client';
import type { NotificationSettingsState, FrequencySettings, CommunicationChannel } from '@/types/consent';

export interface NotificationPreferencesResponse {
  success: boolean;
  data: any;
}

export interface UpdateNotificationPreferencesPayload {
  push: NotificationSettingsState['push'];
  email: NotificationSettingsState['email'];
  sms: NotificationSettingsState['sms'];
  preferredChannel: CommunicationChannel;
  frequency: FrequencySettings;
}

export const notificationPreferencesApi = {
  /**
   * Get current notification preferences
   * GET /api/v1/notification-preferences
   */
  async getPreferences(): Promise<NotificationPreferencesResponse> {
    return fetchWithAuth('notification-preferences');
  },

  /**
   * Update notification preferences
   * PUT /api/v1/notification-preferences
   */
  async updatePreferences(
    payload: UpdateNotificationPreferencesPayload
  ): Promise<NotificationPreferencesResponse> {
    return fetchWithAuth('notification-preferences', {
      method: 'PUT',
      body: JSON.stringify(payload),
    });
  },
};
