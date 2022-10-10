import React, { ReactNode, useCallback, useEffect, useMemo, useState } from 'react';
import { Grid, Container, Stepper, Step, StepLabel } from '@mui/material';
import styled from 'styled-components';

import PlayerCharacterCreation from './features/player-character-creation/PlayerCharacterCreation';
import CharacterRankingsChoice from './features/character-rankings-choice/CharacterRankingsChoice';
import HungarianSelectionResults from './features/hungarian-selection-results/HungarianSelectionResults';
import { Character, Entity, Player } from './features/player-character-creation/playerCharacterCreationSlice';
import { setEntitiesToRank } from './features/character-rankings-choice/characterRankingsChoiceSlice';
import { useAppDispatch } from './app/hooks';

enum StepType {
  PLAYER_CHARACTER_CREATION = 0,
  RANKINGS = 1,
  HUNGARIAN_SELECTION = 2
}

const PROCESS_STEPS = [{
  label: 'Add players and characters'
}, {
  label: 'Choose character rankings for each player'
}, {
  label: 'Check auto selection results'
}]

const AppTitleWrapper = styled.h1`
  text-align: left;
`

function App() {
  const steps = useMemo(() => PROCESS_STEPS.map(s => s.label), [])
  const [activeStep, setActiveStep] = useState(StepType.PLAYER_CHARACTER_CREATION)
  const getStepContent = useCallback(
    (contentComponents: ReactNode[]) => contentComponents[activeStep],
    [activeStep]
  );

  const dispatch = useAppDispatch()
  const playerCharacterCreationProceedHandler = useCallback(
    (data: {players: Player[], characters: Character[]}) => {
      setActiveStep(StepType.RANKINGS)
      dispatch(setEntitiesToRank({
        players: data.players.map(({id, name}) => ({ id, name })),
        characters: data.characters.map(({id, name}) => ({ id, name }))
      }))
    },
    [dispatch]
  )

  const characterRankingsChoiceProceedHandler = useCallback((players: Entity[], characters: Entity[], rankingsMatrix: number[][]) => {
    console.log('proceed to result elaboration',
      players, characters, rankingsMatrix)
  }, [])

  useEffect(() => {
    setTimeout(() => {
      playerCharacterCreationProceedHandler({
        players: [
          { id: 'p1', name: 'player 1' },
          { id: 'p2', name: 'player 2' },
          { id: 'p3', name: 'player 3' }
        ],
        characters: [
          { id: 'c1', name: 'character 1', description: '' },
          { id: 'c2', name: 'character 2', description: '' },
          { id: 'c3', name: 'character 3', description: '' }
        ]
      })
    }, 2000)
  }, [playerCharacterCreationProceedHandler]);

  return (
    <Container maxWidth='md'>
      <Grid container>
        <Grid item xs={12}>
          <AppTitleWrapper>Player / Character (Hungarian) selection</AppTitleWrapper>
        </Grid>
        <Grid item xs={12}>
          <Stepper activeStep={activeStep} alternativeLabel>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
        </Grid>
        <Grid item xs={12}>
          {getStepContent([
            <PlayerCharacterCreation onProceed={playerCharacterCreationProceedHandler}/>,
            <CharacterRankingsChoice onProceed={characterRankingsChoiceProceedHandler}/>,
            <HungarianSelectionResults/>
          ])}
        </Grid>
      </Grid>
    </Container>
  );
}

export default App;
