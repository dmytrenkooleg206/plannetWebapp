import axiosClient from '../../lib/axiosClient';
import { type PlannetMonthlyTextSignUpRequest } from './plannetMonthlyText.types';

export default {
  plannetMonthlyTextSignUp: (data: PlannetMonthlyTextSignUpRequest) =>
    axiosClient.post(`api/user/v4/plannetMonthlyText/signUp`, data),
};
