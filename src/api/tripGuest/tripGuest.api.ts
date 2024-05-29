/* eslint-disable import/no-anonymous-default-export */

import type { Guest } from '@/lib/types';
import axiosClient from '@/lib/axiosClient';

export default {
  updateDepartureLocation: (data: any) =>
    axiosClient.post('api/tripGuest/update', data),
  createTripGuests: (tripId: string, arrayOfFriends: Guest[]) =>
    axiosClient.post('api/tripGuest/create', { arrayOfFriends, tripId }),
  deleteTripGuests: (tripGuestId: string) =>
    axiosClient.post('api/tripGuest/delete', { tripGuestId }),
  updateTripGuests: (tripGuestId: string, attrs: any) =>
    axiosClient.post('api/tripGuest/update', { tripGuestId, ...attrs }),
};
