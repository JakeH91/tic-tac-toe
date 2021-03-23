import React, { useState, useEffect, ReactElement, useRef } from 'react'
import { SafeAreaView } from 'react-native'
import styles from './single-player-game.styles';
import { GradientBackground, Board } from '@components'
import { isEmpty, BoardState, isTerminal, getBestMove } from '@utils'
import { Audio } from 'expo-av';
import * as Haptics from 'expo-haptics';


export default function Game(): ReactElement {
  const [boardState, setBoardState] = useState<BoardState>([
    null,null,null,
    null,null,null,
    null,null,null
  ]);
  const [turn, setTurn] = useState<"HUMAN" | "BOT">(Math.random() < 0.5 ? "HUMAN" : "BOT")
  const [isHumanMaximising, setIsHumanMaximising] = useState<boolean>(true);
  const pop1SoundRef = useRef<Audio.Sound | null>(null);
  const pop2SoundRef = useRef<Audio.Sound | null>(null);

  const gameResult = isTerminal(boardState);

  const insertCell = (cell: number, symbol: "x" | "o"): void => {
    const stateCopy: BoardState = [...boardState];
    if(stateCopy[cell] || isTerminal(stateCopy)) return;
    
    stateCopy[cell] = symbol
    setBoardState(stateCopy)
    try {
      symbol === 'x' ? pop1SoundRef.current?.replayAsync() : pop1SoundRef.current?.replayAsync();
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
    } catch(error) {
      console.log(error);
    }
  }

  const handleOnCellPressed = (cell: number): void => {
    if (turn !== "HUMAN") return;
    insertCell(cell, isHumanMaximising ? 'x' : "o")
    setTurn("BOT")
  }

  useEffect(() => {
    if (gameResult) {
      // handle game finished
      alert("Game Over")
    } else {
      if (turn === "BOT") {
        if (isEmpty(boardState)) {
          const centreAndCorners = [0, 2, 4, 6, 8];
          const firstMove = centreAndCorners[Math.floor(Math.random() * centreAndCorners.length)];
          insertCell(firstMove, "x");
          setIsHumanMaximising(false);
          setTurn("HUMAN");
        } else {
          const best = getBestMove(boardState, !isHumanMaximising, 0, 1);
          insertCell(best, isHumanMaximising ? "o" : "x");
          setTurn("HUMAN");
        }
      }
    }
  }, [boardState, turn]);

  useEffect(() => {
    // Load sounds
    const pop1SoundObject = new Audio.Sound();
    const pop2SoundObject = new Audio.Sound();
    const loadSounds = async () => {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
      await pop1SoundObject.loadAsync(require("@assets/pop_1.wav"));
      pop1SoundRef.current = pop1SoundObject;

    // eslint-disable-next-line @typescript-eslint/no-var-requires
    await pop2SoundObject.loadAsync(require("@assets/pop_2.wav"));
    pop2SoundRef.current = pop2SoundObject;
    }
    loadSounds();

    return () => {
      // Unload sounds
      pop1SoundObject && pop1SoundObject.unloadAsync();
    }
  }, [])

  return (
    <GradientBackground>
       <SafeAreaView style={styles.container}>
        <Board
          disabled={Boolean(isTerminal(boardState)) || turn !== "HUMAN"}
          onCellPressed={cell => {
            handleOnCellPressed(cell)
          }}
          state={boardState} 
          size={300}/>
      </SafeAreaView>
    </GradientBackground>
   
  )
}
