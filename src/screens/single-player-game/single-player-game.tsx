import React, { useState, useEffect, ReactElement } from 'react';
import { SafeAreaView, Dimensions, View } from 'react-native';
import styles from './single-player-game.styles';
import { GradientBackground, Board, Text, Button } from '@components';
import {
  isEmpty,
  BoardState,
  isTerminal,
  getBestMove,
  Cell,
  useSounds,
} from '@utils';

const SCREEN_WIDTH = Dimensions.get('screen').width;

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
  const [gamesCount, setGamesCount] = useState({
    wins: 0,
    draws: 0,
    losses: 0,
  });
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

  const newGame = () => {
    setBoardState([null, null, null, null, null, null, null, null, null]);
    setTurn(Math.random() < 0.5 ? 'HUMAN' : 'BOT');
  };

  useEffect(() => {
    if (gameResult) {
      const winner = getWinner(gameResult.winner);
      if (winner === 'HUMAN') {
        playSound('win');
        setGamesCount({ ...gamesCount, wins: gamesCount.wins + 1 });
      }
      if (winner === 'BOT') {
        playSound('loss');
        setGamesCount({ ...gamesCount, losses: gamesCount.losses + 1 });
      }
      if (winner === 'DRAW') {
        playSound('draw');
        setGamesCount({ ...gamesCount, draws: gamesCount.draws + 1 });
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
        <View>
          <Text style={styles.difficulty}>Difficulty: Hard</Text>
          <View style={styles.results}>
            <View style={styles.resultsBox}>
              <Text style={styles.resultsTitle}>Wins</Text>
              <Text style={styles.resultsCount}>{gamesCount.wins}</Text>
            </View>
            <View style={styles.resultsBox}>
              <Text style={styles.resultsTitle}>Draws</Text>
              <Text style={styles.resultsCount}>{gamesCount.draws}</Text>
            </View>
            <View style={styles.resultsBox}>
              <Text style={styles.resultsTitle}>Losses</Text>
              <Text style={styles.resultsCount}>{gamesCount.losses}</Text>
            </View>
          </View>
        </View>
        <Board
          disabled={Boolean(isTerminal(boardState)) || turn !== 'HUMAN'}
          onCellPressed={(cell) => {
            handleOnCellPressed(cell);
          }}
          state={boardState}
          size={SCREEN_WIDTH - 60}
          gameResult={gameResult}
        />
        {gameResult && (
          <View style={styles.modal}>
            <Text style={styles.modalText}>
              {getWinner(gameResult.winner) === 'HUMAN' && 'You Won'}
              {getWinner(gameResult.winner) === 'BOT' && 'You Lost'}
              {getWinner(gameResult.winner) === 'DRAW' && "It's a Draw"}
            </Text>
            <Button
              onPress={() => {
                newGame();
              }}
              title="Play Again"
            ></Button>
          </View>
        )}
      </SafeAreaView>
    </GradientBackground>
  );
}
