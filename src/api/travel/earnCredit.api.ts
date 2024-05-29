import axiosClient from '../../lib/axiosClient';
import { CreateItenaryForEarnTravelCredit } from './earnCredit.types';

export default {
  createPlannerItinerary: (data: CreateItenaryForEarnTravelCredit) =>
    axiosClient.post('api/trip/create/planner/itinerary', data),
};
