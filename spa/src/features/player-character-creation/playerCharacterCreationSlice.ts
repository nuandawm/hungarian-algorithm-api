import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { v4 as uuid } from 'uuid';

export interface Entity {
  id?: string;
  name: string;
}

export interface Character extends Entity {
  description: string;
  profileImage?: string;
}

export interface Player extends Entity {

}

export interface PlayerCharacterCreationState {
  characters: Character[];
  players: Player[];
}

const initialState: PlayerCharacterCreationState = {
  characters: [],
  players: []
}

const playerCharacterCreationSlice = createSlice({
  name: 'playerCharacterCreation',
  initialState,
  reducers: {
    addPlayer: (state, action: PayloadAction<Player>) => {
      state.players.push({
        ...action.payload,
        id: uuid()
      })
    },
    removePlayer: (state, action: PayloadAction<string>) => {
      const index = state.players.findIndex(player => player.id === action.payload)
      if (index >= 0) {
        state.players.splice(index, 1)
      }
    },
    addCharacter: (state, action: PayloadAction<Character>) => {
      state.characters.push({
        ...action.payload,
        id: uuid()
      })
    },
    removeCharacter: (state, action: PayloadAction<string>) => {
      const index = state.characters.findIndex(character => character.id === action.payload)
      if (index >= 0) {
        state.characters.splice(index, 1)
      }
    }
  }
})

export const { addPlayer, removePlayer, addCharacter, removeCharacter } = playerCharacterCreationSlice.actions
export default playerCharacterCreationSlice.reducer;
