import React, { useState, useEffect, ReactElement } from 'react';
import { SafeAreaView } from 'react-native';
import styles from './single-player-game.styles';
import { GradientBackground, Board } from '@components';
import {
  isEmpty,
  BoardState,
  isTerminal,
  getBestMove,
  Cell,
  useSounds,
} from '@utils';

export default function Game(): ReactElement {
  const [boardState, setBoardState] = useState<BoardState>([
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
  ]);
  const [turn, setTurn] = useState<'HUMAN' | 'BOT'>(
    Math.random() < 0.5 ? 'HUMAN' : 'BOT'
  );
  const [isHumanMaximising, setIsHumanMaximising] = useState<boolean>(true);
  const playSound = useSounds();
  const gameResult = isTerminal(boardState);

  const insertCell = (cell: number, symbol: 'x' | 'o'): void => {
    const stateCopy: BoardState = [...boardState];
    if (stateCopy[cell] || isTerminal(stateCopy)) return;

    stateCopy[cell] = symbol;
    setBoardState(stateCopy);
    try {
      symbol === 'x' ? playSound('pop1') : playSound('pop2');
    } catch (error) {
      console.log(error);
    }
  };

  const handleOnCellPressed = (cell: number): void => {
    if (turn !== 'HUMAN') return;
    insertCell(cell, isHumanMaximising ? 'x' : 'o');
    setTurn('BOT');
  };

  const getWinner = (winnerSymbol: Cell): 'HUMAN' | 'BOT' | 'DRAW' => {
    if (winnerSymbol === 'x') {
      return isHumanMaximising ? 'HUMAN' : 'BOT';
    }
    if (winnerSymbol === 'o') {
      return !isHumanMaximising ? 'HUMAN' : 'BOT';
    }

    return 'DRAW';
  };

  useEffect(() => {
    if (gameResult) {
      const winner = getWinner(gameResult.winner);
      if (winner === 'HUMAN') {
        playSound('win');
        alert('You Won!');
      }
      if (winner === 'BOT') {
        playSound('loss');
        alert('You Lost!');
      }
      if (winner === 'DRAW') {
        playSound('draw');
        alert("It's a draw!");
      }
    } else {
      if (turn === 'BOT') {
        if (isEmpty(boardState)) {
          const centreAndCorners = [0, 2, 4, 6, 8];
          const firstMove =
            centreAndCorners[
              Math.floor(Math.random() * centreAndCorners.length)
            ];
          insertCell(firstMove, 'x');
          setIsHumanMaximising(false);
          setTurn('HUMAN');
        } else {
          const best = getBestMove(boardState, !isHumanMaximising, 0, 1);
          insertCell(best, isHumanMaximising ? 'o' : 'x');
          setTurn('HUMAN');
        }
      }
    }
  }, [boardState, turn]);

  return (
    <GradientBackground>
      <SafeAreaView style={styles.container}>
        <Board
          disabled={Boolean(isTerminal(boardState)) || turn !== 'HUMAN'}
          onCellPressed={(cell) => {
            handleOnCellPressed(cell);
          }}
          state={boardState}
          size={300}
          gameResult={gameResult}
        />
      </SafeAreaView>
    </GradientBackground>
  );
}
