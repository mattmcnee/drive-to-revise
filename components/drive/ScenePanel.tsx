import React from "react";
import { PrimaryButton } from "@/components/ui/Buttons";
import styles from "./ScenePanel.module.scss";
import { GameState } from "@/components/drive/utils";
import Image from "next/image";

import circleIcon from "@/public/icons/shapes/circle.svg";
import squareIcon from "@/public/icons/shapes/square.svg";
import triangleIcon from "@/public/icons/shapes/triangle.svg";
import diamondIcon from "@/public/icons/shapes/diamond.svg";
import pentagonIcon from "@/public/icons/shapes/pentagon.svg";
import hexagonIcon from "@/public/icons/shapes/hexagon.svg";

const iconMap: { [key: string]: string } = {
  circle: circleIcon,
  square: squareIcon,
  triangle: triangleIcon,
  diamond: diamondIcon,
  pentagon: pentagonIcon,
  hexagon: hexagonIcon,
};

interface ScenePanelProps {
  gameState: GameState;
  startGame: () => void;
}

const ScenePanel = ({ gameState, startGame }: ScenePanelProps) => {
  const question = gameState.displayedQuestion || {question: "", left: {text: "", icon: "hexagon"}, right: {text: "", icon: "hexagon"}};
  
  return (
    <div className={styles.panelContainer}>
      {!gameState.started && (
        <PrimaryButton onClick={startGame}>Start Game</PrimaryButton>
      )}
      {gameState.questionFailed ? (
        <div className={styles.questionHeader}>
          <h3>Wrong Answer</h3>
          <PrimaryButton onClick={startGame}>Try Again</PrimaryButton>
        </div>
      ) : (
        <div className={styles.questionContainer}>
          <div className={styles.questionHeader}>{question.question}</div>
          <div className={styles.questionAnswers}>
            <div className={styles.answerBox}>
              <Image src={iconMap[question.left.icon]} alt={question.left.icon} width={24} height={24} />
              <span className={styles.answerText}>{question.left.text}</span>
            </div>
            <div className={styles.answerBox}>
              <Image src={iconMap[question.right.icon]} alt={question.right.icon} width={24} height={24} />
              <span className={styles.answerText}>{question.right.text}</span>
            </div>
          </div>

        </div>
      )}
    </div>
  );
};

export default ScenePanel;
