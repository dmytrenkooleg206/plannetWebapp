import axiosClient from '../../lib/axiosClient';
import {
  type UpdateGuestsRequest,
  type CreateItineraryEventRequest,
  type UpdateItineraryEventRequest,
  type DeleteItineraryEventRequest,
} from './itineraryEvent.types';

export default {
  updateGuests: (data: UpdateGuestsRequest) =>
    axiosClient.post('api/itineraryEvent/update/guests', data),
  createItineraryEvent: (data: CreateItineraryEventRequest) =>
    axiosClient.post('api/itineraryEvent/create', data),
  updateItineraryEvent: (data: UpdateItineraryEventRequest) =>
    axiosClient.post('api/itineraryEvent/update', data),
  deleteItineraryEvent: (data: DeleteItineraryEventRequest) =>
    axiosClient.post('api/itineraryEvent/delete', data),
};
