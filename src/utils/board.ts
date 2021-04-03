import { BoardState, Moves, WinningRowOrColumn } from '@utils';
import { BoardResult } from './types';

export const printFormattedBoard = (state: BoardState): void => {
  let formattedString = '';
  state.forEach((cell, index) => {
    formattedString += cell ? ` ${cell} |` : '   |';
    if (index % 3 === 2) {
      formattedString = formattedString.slice(0, -1);
      if (index < 8) {
        formattedString +=
          '\n\u2015\u2015\u2015 \u2015\u2015\u2015 \u2015\u2015\u2015\n';
      }
    }
  });

  console.log(formattedString);
};

export const isEmpty = (state: BoardState): boolean =>
  state.every((cell) => cell === null);

export const isFull = (state: BoardState): boolean =>
  state.every((cell) => cell);

export const getAvailableMoves = (state: BoardState): Moves[] => {
  const moves: Moves[] = [];
  state.forEach((cell, index) => {
    if (cell === null) {
      moves.push(index as Moves);
    }
  });

  return moves;
};

export const isTerminal = (state: BoardState): BoardResult | false => {
  if (isEmpty(state)) return false;

  const winningLines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  for (let i = 0; i < winningLines.length; i++) {
    const line = winningLines[i];
    const [cell1, cell2, cell3] = line;

    if (
      state[cell1] &&
      state[cell1] === state[cell2] &&
      state[cell1] === state[cell3]
    ) {
      const result: BoardResult = {
        winner: state[cell1],
      };
      if (i < 3) {
        result.direction = 'H';
        result.row = (i + 1) as WinningRowOrColumn;
      } else if (i < 6) {
        result.direction = 'V';
        result.column = (i - 2) as WinningRowOrColumn;
      } else {
        result.direction = 'D';
        result.diagonal = i === 6 ? 'MAIN' : 'COUNTER';
      }

      return result;
    }
  }

  if (isFull(state)) {
    return {
      winner: null,
    };
  }

  return false;
};
