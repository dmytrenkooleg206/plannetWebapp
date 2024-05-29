export type TripLegObject = {
  id: string | null;
  startDate?: string;
  endDate?: string;
};

export type CreateTripLegRequest = {
  TripId: string;
  CityId?: string;
  startDate?: string;
  endDate?: string;
  tripLegDates: TripLegObject[];
};

export type UpdateTripLegCityRequest = {
  TripLegId: string;
  CityId: string;
};

export type UpdateTripLegDatesRequest = {
  TripId: string;
  startDate: string;
  endDate: string;
  tripLegDates: TripLegObject[];
};

export type UpdateTripLegNumGuestsRequest = {
  TripLegId: string;
  numAdults: number;
  numKids: number;
};

export type AssignBestItineraryRequest = {
  TripLegId: string;
  budget: string;
};

export type CreateOnClickBookingPaymentIntent = {
  TripLegId: string;
  usePlannetCash: boolean;
  isInsurancePurchased: boolean;
};

export type CreateOnClickBookingV4PaymentIntent = {
  Type: string;
  CustomItineraryTripId: number;
  startDate: string;
  endDate: string;
};