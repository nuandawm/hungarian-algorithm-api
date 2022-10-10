import React, { useCallback } from 'react';
import { Card, CardContent, Icon, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import { DragDropContext, Draggable, Droppable, DropResult } from 'react-beautiful-dnd';
import { Player } from '../player-character-creation/playerCharacterCreationSlice';

type PlayerRankingsCardProps = {
  player: Player,
  playerRankings: string[],
  setPlayerRankings: (playerId: string, sortedCharacterIds: string[]) => void
  characterNameMap: {[key: string]: string}
}

const PlayerRankingsCard = ({ player, playerRankings, setPlayerRankings, characterNameMap }: PlayerRankingsCardProps) => {

  const onDragEndHandler = useCallback((result: DropResult) => {
    if (player.id !== undefined && result.destination !== undefined) {
      const from = result.source.index
      const to = result.destination.index
      const rankingToMove = playerRankings.at(from);
      const filteredRankings = playerRankings.filter((_, index) => index !== from)
      const characterIds = rankingToMove !== undefined ?[
        ...filteredRankings.slice(0, to),
        rankingToMove,
        ...filteredRankings.slice(to)
      ] : playerRankings
      setPlayerRankings(player.id, characterIds)
    }
  }, [setPlayerRankings, player.id, playerRankings])

  return <Card>
    <CardContent>
      {player.name}
      <DragDropContext onDragEnd={onDragEndHandler}>
        <Droppable droppableId={`drop-${player.id}`}>
          {provided =>
            <List ref={provided.innerRef}
                  {...provided.droppableProps}
            >
              {playerRankings
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
}

export default PlayerRankingsCard
