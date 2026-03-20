import { apiService } from './api';
import { Registration, RegistrationFormData, ApiResponse } from '../types';

export const registrationsService = {
  // Submit new registration
  async submitRegistration(eventId: string, data: RegistrationFormData): Promise<ApiResponse<Registration>> {
    return apiService.post<Registration>(`/registrations/${eventId}`, data);
  },

  // Upload payment screenshot
  async uploadPaymentScreenshot(
    registrationId: string, 
    file: File, 
    transactionId?: string
  ): Promise<ApiResponse<Registration>> {
    const formData = new FormData();
    formData.append('paymentScreenshot', file);
    if (transactionId) {
      formData.append('transactionId', transactionId);
    }

    return apiService.post<Registration>(
      `/registrations/${registrationId}/payment`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
  },

  // Get user registrations
  async getUserRegistrations(): Promise<ApiResponse<Registration[]>> {
    return apiService.get<Registration[]>('/registrations/my');
  },

  // Get registration by ID
  async getRegistrationById(registrationId: string): Promise<ApiResponse<Registration>> {
    return apiService.get<Registration>(`/registrations/${registrationId}`);
  },

  // Search registration by ID or email
  async searchRegistration(query: string, type: 'registration' | 'email'): Promise<ApiResponse<Registration>> {
    return apiService.get<Registration>(`/public/registrations/search?${type}=${encodeURIComponent(query)}`);
  },

  // Download ticket
  async downloadTicket(registrationId: string): Promise<void> {
    return apiService.download(`/registrations/${registrationId}/ticket`, `ticket-${registrationId}.pdf`);
  },

  // Cancel registration
  async cancelRegistration(registrationId: string): Promise<ApiResponse<Registration>> {
    return apiService.patch<Registration>(`/registrations/${registrationId}/cancel`);
  },
};

export default registrationsService;