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

import homeIcon from "@/public/icons/home.svg";

import { TextEmbedding } from "../upload/utils";
import { VehicleModel } from "@/components/drive/utils";

import { TertiaryIconButton } from "@/components/ui/Buttons";

import { DatasetDocument } from "@/firebase/firestoreInterface";

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
  startGame: (vehicleType: "default" | VehicleModel) => void;
  dataset: DatasetDocument;
}

const ScenePanel = ({ gameState, startGame, dataset }: ScenePanelProps) => {
  const question = gameState.displayedQuestion || {question: "", left: {text: "", icon: "hexagon"}, right: {text: "", icon: "hexagon"}};

  return (
    <div className={styles.panelContainer}>
      <div className={styles.panelHeader}>
        <div className={styles.panelHeaderIcon}>
            <TertiaryIconButton onClick={() => window.location.href = "/"}>
            <Image src={homeIcon} alt="home" width={24} height={24} />
            </TertiaryIconButton>
        </div>
        <h2 className={styles.panelTitle}>{dataset.metadata.title}</h2>
      </div>
      {!gameState.started ? (
        <div className={styles.welcomePanel}>
          <h3 className={styles.welcomeTitle}>Choose a vehicle speed to start</h3>
        <div className={styles.welcomeOptions}>
        <PrimaryButton onClick={() => startGame("muscle_car")}>Fast</PrimaryButton>
        <PrimaryButton onClick={() => startGame("old_car")}>Medium</PrimaryButton>
        <PrimaryButton onClick={() => startGame("family_car")}>Slow</PrimaryButton>
        </div>
        </div>

      ) : (
      gameState.questionFailed ? (
        <PrimaryButton onClick={() => startGame("default")}>Try again</PrimaryButton>
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
      ))}
    </div>
  );
};

export default ScenePanel;
