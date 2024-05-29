import API from './trip.api';
import {
  CloneTripItineraryRequest,
  type DeleteTripRequest,
  type GetDestinationRecommendationsProps,
} from './trip.types';

export async function createTripWantsHelp(data: any): Promise<any> {
  return new Promise((resolve, reject) => {
    API.createTripWantsHelp(data)
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

export async function getTripById(tripId: string): Promise<any> {
  return new Promise((resolve, reject) => {
    API.getTripById(tripId)
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

export async function getGuestTripById(
  tripId: string,
  filter: string,
): Promise<any> {
  return new Promise((resolve, reject) => {
    if (filter !== '') {
      tripId = `${tripId}/${filter}`;
    }
    API.getTripDetailsForGuest(tripId)
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

export async function getTripByIdGuest(tripId: string): Promise<any> {
  return new Promise((resolve, reject) => {
    API.getTripByIdGuest(tripId)
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

export async function updateTripNameById(
  tripId: string,
  tripName: string,
): Promise<any> {
  return new Promise((resolve, reject) => {
    API.updateTripNameById(tripId, tripName)
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

export async function updateTripPermissionsById(
  tripId: string,
  permissions: any,
): Promise<any> {
  return new Promise((resolve, reject) => {
    API.updateTripPermissionsById(tripId, permissions)
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

export async function updateTripDatesById(
  tripId: string,
  dates: any,
): Promise<any> {
  return new Promise((resolve, reject) => {
    API.updateTripDatesById(tripId, dates)
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

export async function deleteTrip(data: DeleteTripRequest): Promise<any> {
  return new Promise((resolve, reject) => {
    API.deleteTrip(data)
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

export async function getDestinationRecommendations(
  params: GetDestinationRecommendationsProps,
): Promise<any> {
  return new Promise((resolve, reject) => {
    API.getDestinationRecommendations(params)
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

export async function getUserTrips(): Promise<any> {
  return new Promise((resolve, reject) => {
    API.getDashboard()
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

export async function cloneItinerary(
  data: CloneTripItineraryRequest,
): Promise<any> {
  return new Promise((resolve, reject) => {
    API.cloneItinerary(data)
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

export async function getGuestPlannetHotels(hotelId: string): Promise<any> {
  return new Promise((resolve, reject) => {
    API.getPlannetHotels(hotelId)
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

export async function getGuestPlannetExperience(expId: string): Promise<any> {
  return new Promise((resolve, reject) => {
    API.getPlannetExperiences(expId)
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
