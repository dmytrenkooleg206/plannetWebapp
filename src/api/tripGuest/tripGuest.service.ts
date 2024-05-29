import type { Guest } from '@/lib/types';
import API from './tripGuest.api';

export async function updateDepartureLocation(data: any): Promise<any> {
  return new Promise((resolve, reject) => {
    API.updateDepartureLocation(data)
      .then((resp: any) => {
        if (resp.status === 200) {
          resolve(resp?.data);
        }
      })
      .catch((e: any) => {
        reject(e);
      });
  });
}

export async function createTripGuests(
  tripId: string,
  guests: Guest[],
): Promise<any> {
  return new Promise((resolve, reject) => {
    API.createTripGuests(tripId, guests)
      .then((resp: any) => {
        if (resp.status === 200) {
          resolve(resp?.data);
        }
      })
      .catch(reject);
  });
}

export async function deleteTripGuests(tripGuestId: string): Promise<any> {
  return new Promise((resolve, reject) => {
    API.deleteTripGuests(tripGuestId)
      .then((resp: any) => {
        if (resp.status === 200) {
          resolve(resp?.data);
        }
      })
      .catch(reject);
  });
}

export async function updateTripGuests(
  tripGuestId: string,
  attrs: any,
): Promise<any> {
  return new Promise((resolve, reject) => {
    API.updateTripGuests(tripGuestId, attrs)
      .then((resp: any) => {
        if (resp.status === 200) {
          resolve(resp?.data);
        }
      })
      .catch(reject);
  });
}
