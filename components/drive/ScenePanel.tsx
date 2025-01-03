import React from "react";
import { PrimaryButton } from "@/components/ui/Buttons";
import styles from "./ScenePanel.module.scss";
import { GameState } from "@/components/drive/utils";

interface ScenePanelProps {
  gameState: GameState;
  startGame: () => void;
}

const ScenePanel = ({ gameState, startGame }: ScenePanelProps) => {
  return (
    <div className={styles.panelContainer}>
      {!gameState.started && (
        <PrimaryButton onClick={startGame}>Start Game</PrimaryButton>
      )}
    </div>
  );
};

export default ScenePanel;
