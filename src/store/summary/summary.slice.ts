import { createSlice } from '@reduxjs/toolkit';
import type { SummaryState } from './summary.type';
import { initialState } from './summary.defaults';
import { setSummaryDetails } from './summary.reducers';

export const summarySliceName = 'summary';

export const onboardingSlice = createSlice({
  name: summarySliceName,
  initialState,
  reducers: {
    setSummaryDetails,
  },
});

type State<SummaryState> = Record<typeof summarySliceName, SummaryState>;

export const { reducer, actions } = onboardingSlice;
export const selectors = {
  summaryDetails: (state: State<SummaryState>): any =>
    state[summarySliceName].summaryDetails,
};
