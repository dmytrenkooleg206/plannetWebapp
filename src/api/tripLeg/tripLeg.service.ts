import API from './tripLeg.api';
import {
  AssignBestItineraryRequest,
  CreateOnClickBookingPaymentIntent,
  CreateOnClickBookingV4PaymentIntent,
  type CreateTripLegRequest,
  type UpdateTripLegCityRequest,
  type UpdateTripLegDatesRequest,
  type UpdateTripLegNumGuestsRequest,
} from './tripLeg.types';


export async function addTripLeg(data: CreateTripLegRequest): Promise<any> {
  return new Promise((resolve, reject) => {
    API.addTripLeg(data)
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

export async function updateTripLegCity(
  data: UpdateTripLegCityRequest,
): Promise<any> {
  return new Promise((resolve, reject) => {
    API.updateTripLegCity(data)
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

export async function updateTripLegDates(
  data: UpdateTripLegDatesRequest,
): Promise<any> {
  return new Promise((resolve, reject) => {
    API.updateTripLegDates(data)
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

export async function updateTripLegNumGuests(
  data: UpdateTripLegNumGuestsRequest,
): Promise<any> {
  return new Promise((resolve, reject) => {
    API.updateTripLegNumGuests(data)
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

export async function assignBestItinerary(
  data: AssignBestItineraryRequest,
): Promise<any> {
  return new Promise((resolve, reject) => {
    API.assignBestItinerary(data)
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

export async function createOneClickBookingPaymentIntent(
  data: CreateOnClickBookingPaymentIntent,
): Promise<any> {
  return new Promise((resolve, reject) => {
    API.createOneClickBookingPaymentIntent(data)
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

export async function createOneClickAffiliateBookingPaymentIntent(
  data: CreateOnClickBookingV4PaymentIntent,
): Promise<any> {
  return new Promise((resolve, reject) => {
    API.createOneClickAffiliateBookingPaymentIntent(data)
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
