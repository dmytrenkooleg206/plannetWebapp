export type DeleteTripRequest = {
  tripId: string;
};

export type GetDestinationRecommendationsProps = {
  month: string;
  temp: string;
  persona: string;
  latitude: number;
  longitude: number;
  distancePreference: string;
  travelType: string;
};

export type CloneTripItineraryRequest = {
  CustomItineraryTripId: string;
  startDate: string | any;
  endDate: string | any;
  user?: any;
};
