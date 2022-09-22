import React, { useMemo, useState } from 'react';
import { Grid, Container, Stepper, Step, StepLabel } from '@mui/material';
import styled from 'styled-components';
import PlayerCharacterCreation from './features/player-character-creation/PlayerCharacterCreation';
import CharacterRankingsChoice from './features/player-character-creation/CharacterRankingsChoice';
import HungarianSelectionResults from './features/player-character-creation/HungarianSelectionResults';

enum StepType {
  PLAYER_CHARACTER_CREATION = 0,
  RANKINGS = 1,
  HUNGARIAN_SELECTION = 2
}

const PROCESS_STEPS = [{
  label: 'Add players and characters',
  ContainerComponent: PlayerCharacterCreation
}, {
  label: 'Choose character rankings for each player',
  ContainerComponent: CharacterRankingsChoice
}, {
  label: 'Check auto selection results',
  ContainerComponent: HungarianSelectionResults
}]

const AppTitleWrapper = styled.h1`
  text-align: left;
`

function App() {
  const steps = useMemo(() => PROCESS_STEPS.map(s => s.label), [])

  const [activeStep, setActiveStep] = useState(StepType.PLAYER_CHARACTER_CREATION)

  const StepContent = useMemo(() => PROCESS_STEPS[activeStep].ContainerComponent, [activeStep])

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
          <StepContent/>
        </Grid>
      </Grid>
    </Container>
  );
}

export default App;
