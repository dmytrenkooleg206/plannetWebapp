import axiosClient from '../../lib/axiosClient';
import {
  SendContactBusinessMessageReqeust,
  SendContactMessageReqeust,
  SendVerificationCodeRequest,
  VerifyPhoneNumberRequest,
} from './auth.types';

export default {
  sendVerificationCode: (data: SendVerificationCodeRequest) =>
    axiosClient.post('api/auth/sendVerificationCode', data),
  verifyPhoneNumber: (data: VerifyPhoneNumberRequest) =>
    axiosClient.post('api/auth/verifyPhoneNumber', data),
  sendContactMessage: (data: SendContactMessageReqeust) =>
    axiosClient.post('api/auth/contact', data),
  sendContactBusinessMessage: (data: SendContactBusinessMessageReqeust) =>
    axiosClient.post('api/auth/contact/business', data),
};
