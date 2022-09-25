import React, { ChangeEvent, useState } from 'react';
import { Button, TextField } from '@mui/material';
import { Character } from '../playerCharacterCreationSlice';

const EMPTY_CHARACTER: Character = {
  name: '',
  description: ''
};

type AddCharacterProps = {
  onAdd: (character: Character) => void
}

const AddCharacter = ({onAdd}: AddCharacterProps) => {
  const [currentCharacter, setCurrentCharacter] = useState<Character>(EMPTY_CHARACTER)

  const nameHandler = ({target}: ChangeEvent<HTMLInputElement>) => setCurrentCharacter(character => ({
    ...character,
    name: target.value
  }))

  const descriptionHandler = ({target}: ChangeEvent<HTMLInputElement>) => setCurrentCharacter(character => ({
    ...character,
    description: target.value
  }))

  const addCharacterClickHandler = () => {
    onAdd(currentCharacter)
    setCurrentCharacter(EMPTY_CHARACTER)
  }

  const canAdd = currentCharacter.name !== '' && currentCharacter.description !== ''

  return <>
    <h2>New character info</h2>
    <TextField
      id="name"
      label="Name"
      onChange={nameHandler}
      value={currentCharacter.name}
    />
    <TextField
      id="description"
      label="Description"
      onChange={descriptionHandler}
      value={currentCharacter.description}
    />
    <Button variant="contained" onClick={addCharacterClickHandler}
            disabled={!canAdd}>add</Button>
  </>
}

export default AddCharacter
