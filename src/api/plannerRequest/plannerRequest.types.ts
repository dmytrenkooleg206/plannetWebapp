export type CreatePaymentIntentRequest = {
  TripLegId: string;
  PlannerUserId: string;
  CityId: string;
  startDate: string;
  endDate: string;
  numberOfGuests?: number;
  pkg: string;
  usePlannetCash?: boolean;
};
