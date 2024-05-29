import { HYDRATE, createWrapper } from 'next-redux-wrapper';
import {
  AnyAction,
  combineReducers,
  configureStore,
  CombinedState,
  Reducer,
} from '@reduxjs/toolkit';

import { userSliceName, reducer as userReducer } from './user/user.slice';

import {
  onboardingSliceName,
  reducer as onboardingSliceReducer,
} from './onboarding/onboarding.slice';

import { phoneSliceName, reducer as phoneReducer } from './phone/phone.slice';
import { summarySliceName, reducer as summaryReducer } from './summary/summary.slice';

import { UserState } from './user/user.type';
import { OnboardingState } from './onboarding/onboarding.type';
import { PhoneState } from './phone/phone.type';
import { SummaryState } from './summary/summary.type';

export type AppState = {
  user: UserState;
  onboarding: OnboardingState;
  phone: PhoneState;
  summary: SummaryState;
};

const combinedReducer = combineReducers({
  [userSliceName]: userReducer,
  [onboardingSliceName]: onboardingSliceReducer,
  [phoneSliceName]: phoneReducer,
  [summarySliceName]: summaryReducer,
});

const reducer: Reducer<CombinedState<AppState>, AnyAction> = (
  state: CombinedState<AppState> | undefined,
  action: AnyAction,
) => {
  if (action.type === HYDRATE) {
    const nextState = {
      ...state,
      ...action.payload,
    } as CombinedState<AppState>;
    return nextState;
  }
  return combinedReducer(state, action);
};

const makeStore = () =>
  configureStore({
    reducer,
    devTools: process.env.NODE_ENV !== 'production',
  });

export const wrapper = createWrapper(makeStore);

export default wrapper;
