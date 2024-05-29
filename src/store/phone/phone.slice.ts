import { createSlice } from '@reduxjs/toolkit';
import type { PhoneState } from './phone.type';
import { initialState } from './phone.defaults';
import {
  setCountryCode,
  setFormatedPhoneNumber,
  setPhoneNumber,
} from './phone.reducers';

export const phoneSliceName = 'phone';

export const phoneSlice = createSlice({
  name: phoneSliceName,
  initialState,
  reducers: {
    setCountryCode,
    setFormatedPhoneNumber,
    setPhoneNumber,
  },
});

type State<PhoneState> = Record<typeof phoneSliceName, PhoneState>;

export const { reducer, actions } = phoneSlice;
export const selectors = {
  phoneNumber: (state: State<PhoneState>): string =>
    state[phoneSliceName].phoneNumber,
  countryCode: (state: State<PhoneState>): string =>
    state[phoneSliceName].countryCode,
  formatedPhoneNumber: (state: State<PhoneState>): string =>
    state[phoneSliceName].formatedPhoneNumber,
};
