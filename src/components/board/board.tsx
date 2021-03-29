import React, { ReactElement } from "react";
import { View, TouchableOpacity } from "react-native";
import Text from "../text/text";
import { BoardState, BoardResult } from "@utils";
import BoardLine from "./board-line";

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
      style={{
        width: size,
        height: size,
        backgroundColor: "green",
        flexDirection: "row",
        flexWrap: "wrap",
      }}
    >
      {state.map((cell, index) => {
        return (
          <TouchableOpacity
            onPress={() => onCellPressed && onCellPressed(index)}
            disabled={cell !== null || disabled}
            style={{
              width: "33.33333%",
              height: "33.33333%",
              backgroundColor: "white",
              borderWidth: 1,
              alignItems: "center",
              justifyContent: "center",
            }}
            key={`cell-${index}`}
          >
            <Text
              style={{
                fontSize: size / 8,
              }}
            >
              {cell}
            </Text>
          </TouchableOpacity>
        );
      })}
      {true && (
        <BoardLine
          size={size}
          gameResult={{ winner: "o", diagonal: "MAIN", direction: "D" }}
        />
      )}
    </View>
  );
}
