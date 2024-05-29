import axiosClient from '../../lib/axiosClient';
import { CreatePaymentIntentRequest } from './plannerRequest.types';

export default {
  createPaymentIntent: (data: CreatePaymentIntentRequest) =>
    axiosClient.post('api/plannerRequest/createPaymentIntent', data),
};
