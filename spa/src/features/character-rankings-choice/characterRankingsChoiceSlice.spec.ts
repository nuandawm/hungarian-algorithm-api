import characterRankingsChoiceReducer, {
  CharacterRankingsState,
  setEntitiesToRank, setRankings
} from './characterRankingsChoiceSlice'

describe('character rankings choice', () => {
  const initialState: CharacterRankingsState = {
    entitiesToRank: {
      players: [],
      characters: []
    },
    rankings: {}
  }

  it('should handle initial state', () => {
    expect(characterRankingsChoiceReducer(undefined, {type: 'unknown'})).toEqual(initialState)
  })

  it('should handle set entities to rank', () => {
    const basicEntitiesToRank = {
      players: [{ id: 'p1', name: 'player 1' }, { id: 'p2', name: 'player 2' }],
      characters: [{ id: 'c1', name: 'character 1' }, { id: 'c2', name: 'character 2' }]
    }
    expect(characterRankingsChoiceReducer(initialState, setEntitiesToRank(basicEntitiesToRank))).toEqual({
      entitiesToRank: basicEntitiesToRank,
      rankings: {
        'p1': ['c1', 'c2'],
        'p2': ['c1', 'c2']
      }
    } as CharacterRankingsState)
  })

  it('should handle set rankings for one of the players', () => {
    const basicEntitiesToRank = {
      players: [{ id: 'p1', name: 'player 1' }, { id: 'p2', name: 'player 2' }],
      characters: [{ id: 'c1', name: 'character 1' }, { id: 'c2', name: 'character 2' }]
    }
    const state = characterRankingsChoiceReducer({
      entitiesToRank: basicEntitiesToRank,
      rankings: {
        'p1': ['c1', 'c2'],
        'p2': ['c1', 'c2']
      }
    }, setRankings({
      playerId: 'p1',
      characterIds: ['c2', 'c1']
    }))

    expect(state.rankings).toEqual({
      'p1': ['c2', 'c1'],
      'p2': ['c1', 'c2']
    })
  })
})
