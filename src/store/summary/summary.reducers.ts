import { PayloadAction } from '@reduxjs/toolkit';
import { SummaryState } from './summary.type';

export function setSummaryDetails(
  state: SummaryState,
  action: PayloadAction<any[]>,
) {
  state.summaryDetails = action.payload;
}
