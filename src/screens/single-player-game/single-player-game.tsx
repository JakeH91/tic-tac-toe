import React, { useState, ReactElement } from 'react'
import { SafeAreaView } from 'react-native'
import styles from './single-player-game.styles';
import { GradientBackground, Board } from '@components'
import { printFormattedBoard, isEmpty, BoardState, isFull, getAvailableMoves, isTerminal } from '@utils'

export default function Game(): ReactElement {
  const [boardState, setBoardState] = useState<BoardState>([null,null,null,null,null,null,null,null,null])

  const handleOnCellPressed = (cell: number): void => {
    const stateCopy: BoardState = [...boardState];
    if(stateCopy[cell] || isTerminal(stateCopy)) return
    
    stateCopy[cell] = 'x'
    setBoardState(stateCopy)
  }

  return (
    <GradientBackground>
       <SafeAreaView style={styles.container}>
        <Board
          disabled={Boolean(isTerminal(boardState))}
          onCellPressed={cell => {
            handleOnCellPressed(cell)
          }}
          state={boardState} 
          size={300}/>
      </SafeAreaView>
    </GradientBackground>
   
  )
}
