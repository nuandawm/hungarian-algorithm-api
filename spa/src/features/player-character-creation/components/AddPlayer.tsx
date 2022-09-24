import React, { ChangeEvent, useState } from 'react';
import { Button, TextField } from '@mui/material';
import { Player } from '../playerCharacterCreationSlice';

const EMPTY_PLAYER: Player = {
  name: ''
}

type AddPlayerProps = {
  onAdd: (player: Player) => void
}

const AddPlayer = ({onAdd}: AddPlayerProps) => {
  const [currentPlayer, setCurrentPlayer] = useState<Player>(EMPTY_PLAYER)

  const nameHandler = ({target}: ChangeEvent<HTMLInputElement>) => {
    setCurrentPlayer(player => ({
      ...player,
      name: target.value
    }))
  }

  const addPlayerClickHandler = () => {
    onAdd(currentPlayer)
    setCurrentPlayer(EMPTY_PLAYER)
  }

  return <>
    <h2>New player info</h2>
    <TextField
      id="name"
      label="Name"
      value={currentPlayer.name}
      onChange={nameHandler}
    />
    <Button variant="contained" onClick={addPlayerClickHandler}>add</Button>
  </>
}

export default AddPlayer
