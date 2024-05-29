import { createSlice } from '@reduxjs/toolkit';
import type { OnboardingState } from './onboarding.type';
import { initialState } from './onboarding.defaults';
import {
  setCityIds,
  setTripStartDate,
  setTripEndDate,
  setTripLegStartDates,
  setTripLegEndDates,
  setNumAdults,
  setNumKids,
  setBudgetThreshold,
  setClimate,
  setNumNightsRange,
  setMonth,
  reset,
  setTravelStyle,
  setTravelType,
  setDistancePreference,
  setLoaded,
  setAudioPlaying,
  setVideoPlaying
} from './onboarding.reducers';

export const onboardingSliceName = 'onboarding';

export const onboardingSlice = createSlice({
  name: onboardingSliceName,
  initialState,
  reducers: {
    setCityIds,
    setTripStartDate,
    setTripEndDate,
    setTripLegEndDates,
    setTripLegStartDates,
    setNumAdults,
    setNumKids,
    setBudgetThreshold,
    setClimate,
    setTravelStyle,
    setTravelType,
    setNumNightsRange,
    setMonth,
    reset,
    setDistancePreference,
    setLoaded,
    setAudioPlaying,
    setVideoPlaying
  },
});

type State<OnboardingState> = Record<
  typeof onboardingSliceName,
  OnboardingState
>;

export const { reducer, actions } = onboardingSlice;
export const selectors = {
  onboarding: (state: State<OnboardingState>): OnboardingState =>
    state[onboardingSliceName],
  CityIds: (state: State<OnboardingState>): number[] =>
    state[onboardingSliceName].CityIds,
  startDate: (state: State<OnboardingState>): string =>
    state[onboardingSliceName].startDate,
  endDate: (state: State<OnboardingState>): string =>
    state[onboardingSliceName].endDate,
  tripLegStartDates: (state: State<OnboardingState>): string[] =>
    state[onboardingSliceName].tripLegStartDates,
  tripLegEndDates: (state: State<OnboardingState>): string[] =>
    state[onboardingSliceName].tripLegEndDates,
  numKids: (state: State<OnboardingState>): number =>
    state[onboardingSliceName].numKids,
  numAdults: (state: State<OnboardingState>): number =>
    state[onboardingSliceName].numAdults,
  budgetThreshold: (state: State<OnboardingState>): string =>
    state[onboardingSliceName].budgetThreshold,
  climate: (state: State<OnboardingState>): string =>
    state[onboardingSliceName].temp,
  numNightsRange: (state: State<OnboardingState>): string =>
    state[onboardingSliceName].numNightsRange,
  month: (state: State<OnboardingState>): string =>
    state[onboardingSliceName].month,
  persona: (state: State<OnboardingState>): string =>
    state[onboardingSliceName].persona,
  travelType: (state: State<OnboardingState>): string =>
    state[onboardingSliceName].travelType,
  distancePreference: (state: State<OnboardingState>): string =>
    state[onboardingSliceName].distancePreference,
  loaded: (state: State<OnboardingState>): boolean =>
      state[onboardingSliceName].loaded,
  videoPlaying: (state: State<OnboardingState>): boolean =>
      state[onboardingSliceName].videoPlaying,
  audioPlaying: (state: State<OnboardingState>): boolean =>
      state[onboardingSliceName].audioPlaying,
};
