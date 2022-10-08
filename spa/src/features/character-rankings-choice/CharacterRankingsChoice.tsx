import React, { useCallback, useMemo } from 'react'
import { Card, CardContent, Grid, Icon, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import { DragDropContext, Draggable, Droppable, DropResult } from 'react-beautiful-dnd';
import { useAppSelector, useAppDispatch } from '../../app/hooks';
import { setRankings } from './characterRankingsChoiceSlice';

const CharacterRankingsChoice = () => {
    const players = useAppSelector(state => state.characterRankingsChoice.entitiesToRank.players)
    const characters = useAppSelector(state => state.characterRankingsChoice.entitiesToRank.characters)
    const rankings = useAppSelector(state => state.characterRankingsChoice.rankings)

    const characterNameMap = useMemo(() => Object.fromEntries(
      characters.map(character => [character.id, character.name])
    ), [characters])

    const getRankingsByPlayerId = useCallback((playerId: string) => rankings[playerId], [rankings])

    const dispatch = useAppDispatch();
    const moveItemInList = useCallback((result: DropResult) => {
        if (result.destination !== undefined) {
            const playerId = result.destination.droppableId.replace('drop-', '')
            const from = result.source.index
            const to = result.destination.index
            const playerRankings = getRankingsByPlayerId(playerId)
            const rankingToMove = playerRankings.at(from);
            const filteredRankings = playerRankings.filter((_, index) => index !== from)
            const characterIds = rankingToMove !== undefined ?[
                ...filteredRankings.slice(0, to),
                rankingToMove,
                ...filteredRankings.slice(to)
            ] : playerRankings
            dispatch(setRankings({ playerId, characterIds }))
        }
    }, [getRankingsByPlayerId])

    return <div>
        <h1>Rankings</h1>
        <Grid container spacing={2}>
            {players.map(player =>
              <Grid item xs={6} key={player.id}>
                  <Card>
                      <CardContent>
                          {player.name}
                          <DragDropContext onDragEnd={moveItemInList}>
                              <Droppable droppableId={`drop-${player.id}`}>
                                  {provided =>
                                      <List ref={provided.innerRef}
                                            {...provided.droppableProps}
                                      >
                                          {player.id && getRankingsByPlayerId(player.id)
                                            .map(ranking => ({id: ranking, value: ranking}))
                                            .map((ranking, index) => (
                                            <Draggable key={ranking.id} draggableId={`drag-${ranking.id}`} index={index}>
                                                {provided => (
                                                  <ListItem
                                                            {...provided.draggableProps}
                                                            ref={provided.innerRef}>
                                                      <ListItemIcon
                                                        {...provided.dragHandleProps}>
                                                          <Icon>drag_indicator</Icon>
                                                      </ListItemIcon>
                                                      <ListItemText>
                                                          {characterNameMap[ranking.value]}
                                                      </ListItemText>
                                                  </ListItem>
                                                )}
                                            </Draggable>
                                          ))}
                                          {provided.placeholder}
                                      </List>
                                  }
                              </Droppable>
                          </DragDropContext>
                      </CardContent>
                  </Card>
              </Grid>)}
        </Grid>
    </div>
}

export default CharacterRankingsChoice
