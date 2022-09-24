import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import playerCharacterCreationReduce from '../features/player-character-creation/playerCharacterCreationSlice';

export const store = configureStore({
  reducer: {
    playerCharacterCreation: playerCharacterCreationReduce
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
