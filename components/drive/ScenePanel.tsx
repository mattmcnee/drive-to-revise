import React from "react";
import { PrimaryButton } from "@/components/ui/Buttons";
import styles from "./ScenePanel.module.scss";
import { GameState } from "@/components/drive/utils";

interface ScenePanelProps {
  gameState: GameState;
  startGame: () => void;
}

const ScenePanel = ({ gameState, startGame }: ScenePanelProps) => {
  const question = gameState.displayedQuestion || {question: "", left: {text: "", icon: ""}, right: {text: "", icon: ""}};
  
  return (
    <div className={styles.panelContainer}>
      {!gameState.started && (
        <PrimaryButton onClick={startGame}>Start Game</PrimaryButton>
      )}
      <div className={styles.questionContainer}>
        <h3>{question.question}</h3>
        <span>{question.left.text}</span>
        <span>{question.right.text}</span>

      </div>
      {gameState.questionFailed && (
        <PrimaryButton onClick={startGame}>Try Again</PrimaryButton>
      )}
    </div>
  );
};

export default ScenePanel;
