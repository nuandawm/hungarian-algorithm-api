import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import playerCharacterCreationReducer from '../features/player-character-creation/playerCharacterCreationSlice';
import characterRankingsChoiceReducer from '../features/character-rankings-choice/characterRankingsChoiceSlice';

export const store = configureStore({
  reducer: {
    playerCharacterCreation: playerCharacterCreationReducer,
    characterRankingsChoice: characterRankingsChoiceReducer
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
