import React, { useCallback, useMemo } from 'react'
import { Button, Grid } from '@mui/material';
import { useAppSelector, useAppDispatch } from '../../app/hooks';
import { setRankings } from './characterRankingsChoiceSlice';
import PlayerRankingsCard from './PlayerRankingsCard';
import { Entity } from '../player-character-creation/playerCharacterCreationSlice';
import styled from 'styled-components';

const CharacterRankingsChoiceWrapper = styled.div`
    padding-bottom: 50px;
`

type CharacterRankingsChoiceProps = {
    onProceed: (players: Entity[], characters: Entity[], rankingsMatrix: number[][]) => void
}

const CharacterRankingsChoice = ({ onProceed }: CharacterRankingsChoiceProps) => {
    const players = useAppSelector(state => state.characterRankingsChoice.entitiesToRank.players)
    const characters = useAppSelector(state => state.characterRankingsChoice.entitiesToRank.characters)
    const rankings = useAppSelector(state => state.characterRankingsChoice.rankings)

    const characterNameMap = useMemo(() => Object.fromEntries(
      characters.map(character => [character.id, character.name])
    ), [characters])

    const getRankingsByPlayerId = useCallback((playerId: string) => rankings[playerId], [rankings])

    const dispatch = useAppDispatch();
    const setPlayerRankings = useCallback((playerId: string, sortedCharacterIds: string[]) => {
        dispatch(setRankings({ playerId, characterIds: sortedCharacterIds }))
    }, [dispatch])

    const proceedHandler = useCallback(() => {
        const rankingMatrix = players
          .map(player => {
              const rankings = player.id ? getRankingsByPlayerId(player.id) : []
              // convert ordered characters to ranking values for each character
              const rankingValues = Object.fromEntries(
                rankings.map((characterId, index) => [characterId, (index + 1) * 10])
              )
              return characters
                .map(({ id }) => id ? rankingValues[id] : 0)
          })
        onProceed(players, characters, rankingMatrix)
    }, [onProceed, players, characters, getRankingsByPlayerId])

    return <CharacterRankingsChoiceWrapper>
        <h1>Rankings</h1>
        <Grid container spacing={2}>
            {players.map(player =>
              <Grid item xs={6} key={player.id}>
                  <PlayerRankingsCard player={player}
                                      playerRankings={player.id ? getRankingsByPlayerId(player.id) : []}
                                      setPlayerRankings={setPlayerRankings}
                                      characterNameMap={characterNameMap} />
              </Grid>)}
        </Grid>
        <Grid container item xs={12}>
            <Button variant="contained" fullWidth={true}
                    onClick={proceedHandler}>
                Send data to elaborate the results
            </Button>
        </Grid>
    </CharacterRankingsChoiceWrapper>
}

export default CharacterRankingsChoice
