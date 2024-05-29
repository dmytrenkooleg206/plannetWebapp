import axiosClient from '../../lib/axiosClient';
import {
  AssignBestItineraryRequest,
  type CreateTripLegRequest,
  type UpdateTripLegCityRequest,
  type UpdateTripLegDatesRequest,
  type UpdateTripLegNumGuestsRequest,
  CreateOnClickBookingPaymentIntent,
  CreateOnClickBookingV4PaymentIntent,
} from './tripLeg.types';

export default {
  addTripLeg: (data: CreateTripLegRequest) =>
    axiosClient.post('api/tripLeg/create', data),
  updateTripLegCity: (data: UpdateTripLegCityRequest) =>
    axiosClient.post('api/tripLeg/update/city', data),
  updateTripLegDates: (data: UpdateTripLegDatesRequest) =>
    axiosClient.post('api/tripLeg/update/dates', data),
  updateTripLegNumGuests: (data: UpdateTripLegNumGuestsRequest) =>
    axiosClient.post('api/tripLeg/update/preferences/numGuests', data),
  assignBestItinerary: (data: AssignBestItineraryRequest) =>
    axiosClient.post('api/tripLeg/assignBestItinerary', data),
  createOneClickAffiliateBookingPaymentIntent: (
    data: CreateOnClickBookingV4PaymentIntent,
  ) =>
    axiosClient.post(
      '/api/tripLeg/v4/oneClickBooking/createPaymentIntent',
      data,
    ),
  createOneClickBookingPaymentIntent: (
    data: CreateOnClickBookingPaymentIntent,
  ) =>
    axiosClient.post('api/tripLeg/oneClickBooking/createPaymentIntent', data),
};
