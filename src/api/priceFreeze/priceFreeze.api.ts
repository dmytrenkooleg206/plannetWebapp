import axiosClient from '@/lib/axiosClient';
export default {
  createPaymentIntent: (data: any) =>
    axiosClient.post('api/priceFreeze/createPaymentIntent', data),
  createPaymentIntentV4: (data: any) =>
    axiosClient.post('api/priceFreeze/v4/createPaymentIntent', data),
};
