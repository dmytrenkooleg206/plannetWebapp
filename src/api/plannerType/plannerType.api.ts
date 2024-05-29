import axiosClient from '../../lib/axiosClient';
import { type CreatePlannerTypeRequest } from './plannerType.types';

export default {
  createPlannerType: (data: CreatePlannerTypeRequest) =>
    axiosClient.post(`api/plannerType/v2/create`, data),
  deletePlannerType: (PlannerTypeId: string) =>
    axiosClient.post(`api/plannerType/delete`, { PlannerTypeId }),
};
