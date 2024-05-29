import { createSlice } from '@reduxjs/toolkit';
import type { UserState } from './user.type';
import { initialState } from './user.defaults';
import { setUser } from './user.reducers';

export const userSliceName = 'user';

export const userSlice = createSlice({
  name: userSliceName,
  initialState,
  reducers: {
    setUser,
  },
});

type State<UserState> = Record<typeof userSliceName, UserState>;

export const { reducer, actions } = userSlice;
export const selectors = {
  user: (state: State<UserState>): any => state[userSliceName].user,
};
