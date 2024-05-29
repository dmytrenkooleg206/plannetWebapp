export type GetHotelsRequest = {
  latitude: string;
  longitude: string;
  startDate: string;
  endDate: string;
  sortBy: string;
  numRooms: number;
  numAdultsPerRoom: number;
  source?: string;
  numResults?: number;
  page?: number;
  isParsedRooms?: boolean;
  minNightlyRateUsdCents?: number;
  maxNightlyRateUsdCents?: number;
  starsArr?: number[];
  hotelName?: string;
};

export type GetAllianceRoomDetailRequest = {
  numAdultsPerRoom: number;
  numRooms: number;
  startDate: string;
  endDate: string;
  alliancePropertyId: string;
  ratePlanCode: string;
  roomCode: string;
  gateway: string;
};

export type CreatePaymentIntentAllianceRequest = {
  numRooms: number;
  numAdultsPerRoom: number;
  childAges: number[];
  startDate: string;
  endDate: string;
  alliancePropertyId: string;
  ratePlanCode: string;
  roomCode: string;
  gateway: string;
  title?: string;
  firstName: string;
  lastName: string;
  countryCode: string;
  phoneNumber: string;
  email: string;
  specialRequests?: string;
  address: any;
  usePlannetCash?: boolean;
};

export type AddBookingToTripRequest = {
  AmadeusHotelBookingId?: string;
  AllianceHotelBookingId: string;
  CityId?: string;
  TripLegId?: string;
  ItineraryEventId?: string;
};

export type LookupBookingAllianceRequest = {
  AllianceHoldBookingId: string;
};

export type TripadvisorReviewsRequest = {
  latitude: string;
  longitude: string;
  hotelName: string;
  plannetHotelId: string;
  tripAdvisorLocationId: null | string;
};
