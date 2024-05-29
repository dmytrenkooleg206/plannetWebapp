import { PayloadAction } from '@reduxjs/toolkit';
import { PhoneState } from './phone.type';

export function setCountryCode(
  state: PhoneState,
  action: PayloadAction<string>,
) {
  state.countryCode = action.payload;
}

export function setPhoneNumber(
  state: PhoneState,
  action: PayloadAction<string>,
) {
  state.phoneNumber = action.payload;
}

export function setFormatedPhoneNumber(
  state: PhoneState,
  action: PayloadAction<string>,
) {
  state.formatedPhoneNumber = action.payload;
}
