import axiosClient from '../../lib/axiosClient';
import {
  type GetHotelsRequest,
  type GetAllianceRoomDetailRequest,
  type CreatePaymentIntentAllianceRequest,
  type AddBookingToTripRequest,
  type LookupBookingAllianceRequest,
  TripadvisorReviewsRequest,
} from './beHotel.types';

export default {
  getHotels: (data: GetHotelsRequest) =>
    axiosClient.post('api/beHotel/search/parameters', data),
  getAllianceRoomDetail: (data: GetAllianceRoomDetailRequest) =>
    axiosClient.post('api/beHotel/search/detail/alliance', data),
  createPaymentIntentAlliance: (data: CreatePaymentIntentAllianceRequest) =>
    axiosClient.post('/api/behotel/book/createPaymentIntent/alliance', data),
  addBookingToTrip: (data: AddBookingToTripRequest) =>
    axiosClient.post('/api/behotel/addBookingToTrip', data),
  lookupBookingAlliance: (data: LookupBookingAllianceRequest) =>
    axiosClient.post('/api/beHotel/lookupBooking/alliance', data),
  tripadvisorReviews: (data: TripadvisorReviewsRequest) =>
    axiosClient.post('/api/beHotel/tripadvisorReviews', data),
};
