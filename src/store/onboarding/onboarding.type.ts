export type OnboardingState = {
  CityIds: number[];
  tripLegStartDates: string[];
  tripLegEndDates: string[];
  startDate: string;
  endDate: string;
  numKids: number;
  numAdults: number;
  budgetThreshold: string;
  temp: string;
  numNightsRange: string;
  month: string;
  persona: string;
  travelType: string;
  distancePreference: string;
  loaded: boolean;
  audioPlaying: boolean;
  videoPlaying: boolean;
};
