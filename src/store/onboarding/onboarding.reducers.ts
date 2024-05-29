import { PayloadAction } from '@reduxjs/toolkit';
import { OnboardingState } from './onboarding.type';

export function reset(state: OnboardingState) {
  state.CityIds = [];
  state.tripLegStartDates = [];
  state.tripLegEndDates = [];
  state.startDate = '';
  state.endDate = '';
  state.numKids = 0;
  state.numAdults = 0;
  state.budgetThreshold = '';
  state.temp = '';
  state.month = '';
  state.numNightsRange = '';
  state.persona = '';
  state.loaded = false;
  state.audioPlaying = false;
}

export function setCityIds(
  state: OnboardingState,
  action: PayloadAction<number[]>,
) {
  state.CityIds = action.payload;
}

export function setTripLegStartDates(
  state: OnboardingState,
  action: PayloadAction<string[]>,
) {
  state.tripLegStartDates = action.payload;
}

export function setTripLegEndDates(
  state: OnboardingState,
  action: PayloadAction<string[]>,
) {
  state.tripLegEndDates = action.payload;
}

export function setTripStartDate(
  state: OnboardingState,
  action: PayloadAction<string>,
) {
  state.startDate = action.payload;
}

export function setTripEndDate(
  state: OnboardingState,
  action: PayloadAction<string>,
) {
  state.endDate = action.payload;
}

export function setNumKids(
  state: OnboardingState,
  action: PayloadAction<number>,
) {
  state.numKids = action.payload;
}

export function setNumAdults(
  state: OnboardingState,
  action: PayloadAction<number>,
) {
  state.numAdults = action.payload;
}

export function setBudgetThreshold(
  state: OnboardingState,
  action: PayloadAction<string>,
) {
  state.budgetThreshold = action.payload;
}

export function setClimate(
  state: OnboardingState,
  action: PayloadAction<string>,
) {
  state.temp = action.payload;
}

export function setTravelStyle(
  state: OnboardingState,
  action: PayloadAction<string>,
) {
  state.persona = action.payload;
}

export function setTravelType(
  state: OnboardingState,
  action: PayloadAction<string>,
) {
  state.travelType = action.payload;
}

export function setDistancePreference(
  state: OnboardingState,
  action: PayloadAction<string>,
) {
  state.distancePreference = action.payload;
}

export function setNumNightsRange(
  state: OnboardingState,
  action: PayloadAction<string>,
) {
  state.numNightsRange = action.payload;
}
export function setMonth(
  state: OnboardingState,
  action: PayloadAction<string>,
) {
  state.month = action.payload;
}
export function setLoaded(
  state: OnboardingState,
  action: PayloadAction<boolean>,
) {
  state.loaded = action.payload;
}
export function setAudioPlaying(
  state: OnboardingState,
  action: PayloadAction<boolean>,
) {
  state.audioPlaying = action.payload;
}
export function setVideoPlaying(
  state: OnboardingState,
  action: PayloadAction<boolean>,
) {
  state.videoPlaying = action.payload;
}
