import axiosClient from '../../lib/axiosClient';
import { type CreatePlannerLanguageRequest } from './plannerLanguage.types';

export default {
  createPlannerLanguage: (data: CreatePlannerLanguageRequest) =>
    axiosClient.post(`api/plannerLanguage/create`, data),
  deletePlannerLanguage: (PlannerLanguageId: string) =>
    axiosClient.post(`api/plannerLanguage/delete`, { PlannerLanguageId }),
};
