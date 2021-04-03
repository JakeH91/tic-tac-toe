import React, { ReactElement } from 'react';
import { View, TouchableOpacity } from 'react-native';
import Text from '../text/text';
import { BoardState, BoardResult } from '@utils';
import BoardLine from './board-line';
import styles from './board.styles';

type BoardProps = {
  state: BoardState;
  size: number;
  onCellPressed?: (index: number) => void;
  disabled?: boolean;
  gameResult?: BoardResult | false;
};

export default function Board({
  state,
  disabled,
  size,
  gameResult,
  onCellPressed,
}: BoardProps): ReactElement {
  return (
    <View
      style={[
        styles.board,
        {
          width: size,
          height: size,
        },
      ]}
    >
      {state.map((cell, index) => {
        return (
          <TouchableOpacity
            onPress={() => onCellPressed && onCellPressed(index)}
            disabled={cell !== null || disabled}
            style={[styles.cell, styles[`cell${index}` as 'cell']]}
            key={`cell-${index}`}
          >
            <Text
              style={[
                styles.cellText,
                {
                  fontSize: size / 7,
                },
              ]}
            >
              {cell}
            </Text>
          </TouchableOpacity>
        );
      })}
      {gameResult && <BoardLine size={size} gameResult={gameResult} />}
    </View>
  );
}
