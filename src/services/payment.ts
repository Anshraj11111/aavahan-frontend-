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

export const paymentService = {
  // Get active payment config (public endpoint)
  async getPaymentConfig(): Promise<ApiResponse<{ config: PaymentConfig | null }>> {
    return apiService.get('/public/payment-config');
  },
};

export default paymentService;
