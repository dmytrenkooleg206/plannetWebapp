import { PayloadAction } from '@reduxjs/toolkit';
import { UserState } from './user.type';

export function setUser(state: UserState, action: PayloadAction<any>) {
  state.user = action.payload;
}
