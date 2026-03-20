import { apiService } from './api';
import { FestInfo, HomepageStats, PaymentConfig, ApiResponse } from '../types';

export const generalService = {
  // Get fest information
  async getFestInfo(): Promise<ApiResponse<FestInfo>> {
    return apiService.get<FestInfo>('/public/fest-info');
  },

  // Get homepage statistics
  async getHomepageStats(): Promise<ApiResponse<HomepageStats>> {
    return apiService.get<HomepageStats>('/public/stats');
  },

  // Get payment configuration
  async getPaymentConfig(): Promise<ApiResponse<PaymentConfig>> {
    return apiService.get<PaymentConfig>('/public/payment-config');
  },

  // Contact form submission
  async submitContactForm(data: {
    name: string;
    email: string;
    phone?: string;
    subject: string;
    message: string;
  }): Promise<ApiResponse<{ success: boolean }>> {
    return apiService.post<{ success: boolean }>('/public/contact', data);
  },

  // Newsletter subscription
  async subscribeNewsletter(email: string): Promise<ApiResponse<{ success: boolean }>> {
    return apiService.post<{ success: boolean }>('/public/newsletter/subscribe', { email });
  },

  // Health check
  async healthCheck(): Promise<ApiResponse<{ status: string; timestamp: string }>> {
    return apiService.get<{ status: string; timestamp: string }>('/health');
  },
};

export default generalService;