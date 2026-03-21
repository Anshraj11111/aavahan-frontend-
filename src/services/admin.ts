import { apiService } from './api';
import { Registration, ApiResponse } from '../types';

export const adminService = {
  // Get all registrations (admin only)
  async getAllRegistrations(filters?: {
    eventId?: string;
    status?: string;
    paymentStatus?: string;
    page?: number;
    limit?: number;
  }): Promise<ApiResponse<Registration[]>> {
    const params = new URLSearchParams();
    if (filters?.eventId) params.append('eventId', filters.eventId);
    if (filters?.status) params.append('status', filters.status);
    if (filters?.paymentStatus) params.append('paymentStatus', filters.paymentStatus);
    if (filters?.page) params.append('page', String(filters.page));
    if (filters?.limit) params.append('limit', String(filters.limit));
    
    return apiService.get<Registration[]>(`/admin/registrations?${params.toString()}`);
  },

  // Get single registration by ID (admin only)
  async getRegistrationById(registrationId: string): Promise<ApiResponse<Registration>> {
    return apiService.get<Registration>(`/admin/registrations/${registrationId}`);
  },

  // Approve registration (admin only)
  async approveRegistration(registrationId: string): Promise<ApiResponse<Registration>> {
    return apiService.patch<Registration>(`/admin/registrations/${registrationId}/approve`);
  },

  // Reject registration (admin only)
  async rejectRegistration(registrationId: string, reason?: string): Promise<ApiResponse<Registration>> {
    return apiService.patch<Registration>(`/admin/registrations/${registrationId}/reject`, { reason });
  },

  // Edit registration (admin only)
  async editRegistration(registrationId: string, updates: Partial<Registration>): Promise<ApiResponse<Registration>> {
    return apiService.patch<Registration>(`/admin/registrations/${registrationId}/edit`, updates);
  },

  // Cancel registration (admin only)
  async cancelRegistration(registrationId: string): Promise<ApiResponse<Registration>> {
    return apiService.patch<Registration>(`/admin/registrations/${registrationId}/cancel`);
  },
};

export default adminService;
