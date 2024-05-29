import API from './beHotel.api';
import {
  type GetHotelsRequest,
  type GetAllianceRoomDetailRequest,
  type CreatePaymentIntentAllianceRequest,
  type AddBookingToTripRequest,
  type LookupBookingAllianceRequest,
  TripadvisorReviewsRequest,
} from './beHotel.types';

export async function getHotels(data: GetHotelsRequest): Promise<any> {
  return new Promise((resolve, reject) => {
    API.getHotels(data)
      .then((resp: any) => {
        if (resp.status === 200) {
          const { hotels, numHotels } = resp.data;
          resolve({ newHotels: hotels, numHotels });
        }
      })
      .catch((e: any) => {
        reject(e);
      });
  });
}

export async function getAllianceRoomDetail(
  data: GetAllianceRoomDetailRequest,
): Promise<any> {
  return new Promise((resolve, reject) => {
    API.getAllianceRoomDetail(data)
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

export async function createPaymentIntentAlliance(
  data: CreatePaymentIntentAllianceRequest,
): Promise<any> {
  return new Promise((resolve, reject) => {
    API.createPaymentIntentAlliance(data)
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

export async function addBookingToTrip(
  data: AddBookingToTripRequest,
): Promise<any> {
  return new Promise((resolve, reject) => {
    API.addBookingToTrip(data)
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

export async function lookupBookingAlliance(
  data: LookupBookingAllianceRequest,
): Promise<any> {
  return new Promise((resolve, reject) => {
    API.lookupBookingAlliance(data)
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
export async function tripadvisorReviews(
  data: TripadvisorReviewsRequest,
): Promise<any> {
  return new Promise((resolve, reject) => {
    API.tripadvisorReviews(data)
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
