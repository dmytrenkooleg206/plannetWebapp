export type UpdateGuestsRequest = {
  ItineraryEventId: string;
  TripGuestIds: string[];
};

export type CreateItineraryEventRequest = {
  name: string;
  type: string;
  TripLegId: string;
  address: string;
  websiteUrl: string;
  startDateOffset: number;
  endDateOffset: number;
  allianceHotelParams?: any;
  description?: string;
  attendingStatus?: string;
  stayRank?: string;
  tripGuestIdArray?: string[];
  BusinessEntityId?: string;
};

export type UpdateItineraryEventRequest = {
  ItineraryEventId: string;
  name: string;
  address: string;
  websiteUrl: string;
  startDateOffset: number;
  endDateOffset: number;
  BusinessEntityId?: string;
};

export type DeleteItineraryEventRequest = {
  ItineraryEventId: string;
};
