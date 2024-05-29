import guestAxiosClient from '@/lib/guestAxiosClient';
import axiosClient from '../../lib/axiosClient';
import {
  CloneTripItineraryRequest,
  type DeleteTripRequest,
  type GetDestinationRecommendationsProps,
} from './trip.types';

export default {
  createTripWantsHelp: (data: any) =>
    axiosClient.post('api/trip/v4/create/wantsHelp', data),
  getTripById: (tripId: string) =>
    axiosClient.get(`api/trip/v4/byId/${tripId}`),
  getTripDetailsForGuest: (tripId: string) =>
    guestAxiosClient.get(`api/trip/v4/byId/${tripId}`),
  getTripByIdGuest: (tripId: string) =>
    guestAxiosClient.get(`api/trip/v4/byId/${tripId}`),
  updateTripNameById: (TripId: string, name: string) =>
    axiosClient.post(`api/trip/update/name`, { TripId, name }),
  updateTripPermissionsById: (TripId: string, permissions: any) =>
    axiosClient.post(`api/trip/update/permissions`, { TripId, ...permissions }),
  updateTripDatesById: (TripId: string, dates: any) =>
    axiosClient.post(`api/trip/v2/update`, { TripId, ...dates }),
  deleteTrip: (data: DeleteTripRequest) =>
    axiosClient.post('api/trip/delete', data),
  getDashboard: () => axiosClient.get('api/home/v4/feed'),
  getPlannetHotels: (plannetHotelId: string) =>
    axiosClient.post('api/beHotel/v4/search/detail', {
      PlannetHotelId: plannetHotelId,
    }),
  getPlannetExperiences: (plannetExpId: string) =>
    axiosClient.post('api/beTour/viator/v4/product/details', {
      ViatorProductId: plannetExpId,
    }),
  getDestinationRecommendations: ({
    month,
    temp,
    persona,
    latitude,
    longitude,
    distancePreference,
    travelType,
  }: GetDestinationRecommendationsProps) =>
    axiosClient.get(
      `/api/trip/destinationRecommendations?month=${month}&temp=${temp}&persona=${persona}&latitude=${latitude}&longitude=${longitude}&distancePreference=${distancePreference}&travelType=${travelType}`,
    ),
  cloneItinerary: (data: CloneTripItineraryRequest) =>
    axiosClient.post(`api/trip/clone/itinerary`, data),
};
