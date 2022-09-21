import React from 'react';
import { Grid, Container, Button } from '@mui/material';

function App() {
  return (
    <Container maxWidth='md'>
      <Grid container>
        <Grid item xs={12}>
          <h1>Player / Character (Hungarian) selection</h1>
        </Grid>
        <Grid item xs={6}>
          <Button variant='contained'>my first buttonn</Button>
        </Grid>
      </Grid>
    </Container>
  );
}

export default App;
