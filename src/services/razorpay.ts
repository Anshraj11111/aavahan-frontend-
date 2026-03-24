import api from './api';

export const razorpayService = {
  /**
   * Create Razorpay order
   */
  createOrder: async (amount: number, eventId: string, eventTitle: string) => {
    const response = await api.post('/payments/razorpay/create-order', {
      amount,
      eventId,
      eventTitle,
    });
    return response.data;
  },

  /**
   * Verify Razorpay payment
   */
  verifyPayment: async (
    razorpay_order_id: string,
    razorpay_payment_id: string,
    razorpay_signature: string
  ) => {
    const response = await api.post('/payments/razorpay/verify', {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    });
    return response.data;
  },

  /**
   * Get Razorpay Key ID
   */
  getKeyId: async () => {
    const response = await api.get('/payments/razorpay/key');
    return response.data;
  },
};
