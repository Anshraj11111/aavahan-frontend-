import { apiService } from './api';
import { Announcement, ApiResponse } from '../types';

export const announcementsService = {
  // Get active announcements
  async getActiveAnnouncements(): Promise<ApiResponse<Announcement[]>> {
    return apiService.get<Announcement[]>('/public/announcements');
  },

  // Get announcement by ID
  async getAnnouncementById(id: string): Promise<ApiResponse<Announcement>> {
    return apiService.get<Announcement>(`/public/announcements/${id}`);
  },

  // Get announcements by type
  async getAnnouncementsByType(type: 'info' | 'urgent' | 'update'): Promise<ApiResponse<Announcement[]>> {
    return apiService.get<Announcement[]>(`/public/announcements/type/${type}`);
  },
};

export default announcementsService;