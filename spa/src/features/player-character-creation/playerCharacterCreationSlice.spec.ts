import playerCharacterCreationReducer, {
  addCharacter,
  addPlayer,
  PlayerCharacterCreationState, removeCharacter, removePlayer
} from './playerCharacterCreationSlice'

jest.mock('uuid', () => ({
  v4: () => 'mockID'
}))

describe('player character creation reducer', () => {
  const initalState: PlayerCharacterCreationState = {
    players: [],
    characters: []
  }

  it('should handle initial state', () => {
    expect(playerCharacterCreationReducer(undefined, {type: 'unknown'})).toEqual(initalState)
  })

  it('should handle add player', () => {
    const state = playerCharacterCreationReducer(initalState, addPlayer({
      name: 'Giuliano'
    }))

    expect(state.players[0].id).toBe('mockID')
    expect(state.players[0].name).toBe('Giuliano')
  })

  it('should handle add character', () => {
    const state = playerCharacterCreationReducer(initalState, addCharacter({
      name: 'Nuanda Fox',
      description: 'Brave warrior'
    }))

    expect(state.characters[0].id).toBe('mockID')
    expect(state.characters[0].name).toBe('Nuanda Fox')
    expect(state.characters[0].description).toBe('Brave warrior')
  })

  it('should handle remove a player', () => {
    const withPlayersState: PlayerCharacterCreationState = {
      players: [
        { id: 'id1', name: 'Test name 1' },
        { id: 'id2', name: 'Test name 2' },
      ],
      characters: []
    }
    const state = playerCharacterCreationReducer(withPlayersState, removePlayer('id2'))

    expect(state.characters.length).toBe(0)
    expect(state.players.length).toBe(1)
    expect(state.players[0].name).toBe('Test name 1')
  })

  it('should keep the player list unchanged given a non-listed id', () => {
    const withPlayersState: PlayerCharacterCreationState = {
      players: [
        { id: 'id1', name: 'Test name 1' },
        { id: 'id2', name: 'Test name 2' },
      ],
      characters: []
    }
    const state = playerCharacterCreationReducer(withPlayersState, removePlayer('id3'))

    expect(state.characters.length).toBe(0)
    expect(state.players.length).toBe(2)
    expect(state.players[0].name).toBe('Test name 1')
    expect(state.players[1].name).toBe('Test name 2')
  })

  it('should handle remove a character', () => {
    const withCharactersState: PlayerCharacterCreationState = {
      players: [],
      characters: [
        { id: 'id1', name: 'Test name 1', description: '' },
        { id: 'id2', name: 'Test name 2', description: '' },
      ]
    }
    const state = playerCharacterCreationReducer(withCharactersState, removeCharacter('id2'))

    expect(state.players.length).toBe(0)
    expect(state.characters.length).toBe(1)
    expect(state.characters[0].name).toBe('Test name 1')
  })

  it('should keep the character list unchanged given a non-listed id', () => {
    const withCharactersState: PlayerCharacterCreationState = {
      players: [],
      characters: [
        { id: 'id1', name: 'Test name 1', description: '' },
        { id: 'id2', name: 'Test name 2', description: '' },
      ]
    }
    const state = playerCharacterCreationReducer(withCharactersState, removeCharacter('id3'))

    expect(state.players.length).toBe(0)
    expect(state.characters.length).toBe(2)
    expect(state.characters[0].name).toBe('Test name 1')
    expect(state.characters[1].name).toBe('Test name 2')
  })
})
