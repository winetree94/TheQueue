import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '@legacy/store';

const selectSelf = (state: RootState) => state.history;

const all = createSelector(selectSelf, (state) => state);

export const HistorySelectors = {
  all,
};
