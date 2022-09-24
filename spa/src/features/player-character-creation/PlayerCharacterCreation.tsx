import React from 'react'
import { useAppDispatch, useAppSelector } from '../../app/hooks'
import { addCharacter, addPlayer, removeCharacter, removePlayer, Character, Player } from './playerCharacterCreationSlice'
import { Grid, IconButton, List, ListItem, ListItemButton, ListItemText, Icon, Button, Divider } from '@mui/material';
import styled from 'styled-components';
import AddCharacter from './components/AddCharacter';
import AddPlayer from './components/AddPlayer';

const InfoFormWrapper = styled.div`
    display: flex;
    flex-direction: column;
    row-gap: 10px;
    padding: 5px;
`

const PlayerCharacterCreationWrapper = styled.div`
    padding-bottom: 50px;
`

type PlayerCharacterCreationProps = {
    onProceed: (data: {players: Player[], characters: Character[]}) => void
}

const PlayerCharacterCreation = ({onProceed}: PlayerCharacterCreationProps) => {
    const players = useAppSelector(state => state.playerCharacterCreation.players)
    const characters = useAppSelector(state => state.playerCharacterCreation.characters)
    const dispatch = useAppDispatch()

    const addCharacterHandler = (character: Character) => {
        dispatch(addCharacter(character))
    }

    const removeCharacterHandler = (id: string | undefined) => () => {
        if (id !== undefined) {
            dispatch(removeCharacter(id))
        }
    }

    const addPlayerHandler = (player: Player) => {
        dispatch(addPlayer(player))
    }

    const removePlayerHandler = (id: string | undefined) => () => {
        if (id !== undefined) {
            dispatch(removePlayer(id))
        }
    }

    const canProceed: boolean = players.length > 0 && characters.length > 0 && players.length === characters.length

    const proceedHandler = () => {
        onProceed({ players, characters })
    }

    return <PlayerCharacterCreationWrapper>
        <h1>Add players and characters</h1>
        <Grid container spacing={2}>
            <Grid container item xs={12}>
                <Grid item xs={6}>
                    <InfoFormWrapper>
                        <AddCharacter onAdd={addCharacterHandler}/>
                    </InfoFormWrapper>
                </Grid>
                <Grid item xs={6}>
                    <InfoFormWrapper>
                        <AddPlayer onAdd={addPlayerHandler}/>
                    </InfoFormWrapper>
                </Grid>
            </Grid>
            <Grid item xs={12}>
                <Divider variant="middle" />
            </Grid>
            <Grid container item xs={12}>
                <Grid item xs={6}>
                    <h2>Characters</h2>
                    <List>
                        {characters.map(character => <ListItem key={character.id}
                           secondaryAction={
                               <IconButton edge="end" aria-label="delete"
                                           onClick={removeCharacterHandler(character.id)}>
                                   <Icon>delete</Icon>
                               </IconButton>
                           }
                        >
                            <ListItemButton>
                                <ListItemText primary={character.name}/>
                            </ListItemButton>
                        </ListItem>)}
                    </List>
                </Grid>
                <Grid item xs={6}>
                    <h2>Players</h2>
                    <List>
                        {players.map(player => <ListItem key={player.id}
                             secondaryAction={
                                 <IconButton edge="end" aria-label="delete"
                                             onClick={removePlayerHandler(player.id)}>
                                     <Icon>delete</Icon>
                                 </IconButton>
                             }
                        >
                            <ListItemButton>
                                <ListItemText primary={player.name}/>
                            </ListItemButton>
                        </ListItem>)}
                    </List>
                </Grid>
            </Grid>
            <Grid container item xs={12}>
                <Button variant="contained" fullWidth={true}
                        disabled={!canProceed} aria-disabled={!canProceed}
                        onClick={proceedHandler}>
                    Proceed to rankings selection
                </Button>
            </Grid>
        </Grid>
    </PlayerCharacterCreationWrapper>
}

export default PlayerCharacterCreation
