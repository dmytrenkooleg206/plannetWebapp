import type { OnboardingState } from './onboarding.type';

export const initialState: OnboardingState = {
  CityIds: [],
  tripLegStartDates: [],
  tripLegEndDates: [],
  startDate: '',
  endDate: '',
  numKids: 0,
  numAdults: 0,
  budgetThreshold: '',
  temp: '',
  month: '',
  numNightsRange: '',
  persona: '',
  travelType: '',
  distancePreference: '',
  loaded: false,
  audioPlaying: false,
  videoPlaying: false
};
