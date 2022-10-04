import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Entity {
  id?: string;
  name: string;
}

export interface EntitiesToRank {
  characters: Entity[],
  players: Entity[]
}

export interface CharacterRankingsState {
  entitiesToRank: EntitiesToRank,
  rankings: {
    [key: string]: string[]
  }
}

const initialState: CharacterRankingsState = {
  entitiesToRank: {
    characters: [],
    players: []
  },
  rankings: {}
}

const characterRankingsChoiceSlice = createSlice({
  name: 'characterRankingsChoice',
  initialState,
  reducers: {
    setEntitiesToRank: (state, action: PayloadAction<EntitiesToRank>) => {
      const { players, characters } = action.payload
      state.entitiesToRank = action.payload
      // reset rankings
      state.rankings = Object.fromEntries(players.map(({id}) => {
        return [id, characters.map(({id}) => id)]
      }))
    },
    setRankings: (state, action: PayloadAction<{ playerId: string, characterIds: string[] }>) => {
      const {playerId, characterIds} = action.payload
      state.rankings[playerId] = characterIds
    },
  }
})

export const { setRankings, setEntitiesToRank } = characterRankingsChoiceSlice.actions

export default characterRankingsChoiceSlice.reducer
