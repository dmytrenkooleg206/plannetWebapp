import API from './itineraryEvent.api';
import {
  type UpdateGuestsRequest,
  type CreateItineraryEventRequest,
  type UpdateItineraryEventRequest,
  type DeleteItineraryEventRequest,
} from './itineraryEvent.types';

export async function updateGuests(data: UpdateGuestsRequest): Promise<any> {
  return new Promise((resolve, reject) => {
    API.updateGuests(data)
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

export async function createItineraryEvent(
  data: CreateItineraryEventRequest,
): Promise<any> {
  return new Promise((resolve, reject) => {
    API.createItineraryEvent(data)
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

export async function updateItineraryEvent(
  data: UpdateItineraryEventRequest,
): Promise<any> {
  return new Promise((resolve, reject) => {
    API.updateItineraryEvent(data)
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

export async function deleteItineraryEvent(
  data: DeleteItineraryEventRequest,
): Promise<any> {
  return new Promise((resolve, reject) => {
    API.deleteItineraryEvent(data)
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
