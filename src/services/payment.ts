import { apiService } from './api';
import { ApiResponse } from '../types';

interface PaymentConfig {
  _id: string;
  qrImage: string;
  upiId: string;
  payeeName: string;
  note: string;
  active: boolean;
}

interface UpdatePaymentConfigData {
  upiId?: string;
  payeeName?: string;
  note?: string;
  active?: boolean;
}

export const paymentService = {
  // Get active payment config (public endpoint)
  async getPaymentConfig(): Promise<ApiResponse<{ config: PaymentConfig | null }>> {
    return apiService.get('/public/payment-config');
  },

  // Get payment config (admin endpoint)
  async getAdminPaymentConfig(): Promise<ApiResponse<{ config: PaymentConfig | null }>> {
    return apiService.get('/admin/payment-config');
  },

  // Update payment config (admin endpoint)
  async updatePaymentConfig(configId: string, data: UpdatePaymentConfigData): Promise<ApiResponse<{ config: PaymentConfig }>> {
    return apiService.patch(`/admin/payment-config/${configId}`, data);
  },

  // Create payment config (admin endpoint)
  async createPaymentConfig(data: UpdatePaymentConfigData): Promise<ApiResponse<{ config: PaymentConfig }>> {
    return apiService.post('/admin/payment-config', data);
  },
};

export default paymentService;
