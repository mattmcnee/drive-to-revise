import React from "react";
import Image from "next/image";
import styles from "./QuestionCard.module.scss";
import deleteIcon from "@/public/icons/delete.svg";
import { TertiaryIconButton } from "@/components/ui/Buttons";

interface QuestionCardProps {
    index: number;
    question: any;
    deleteQuestionItem: (index: number) => void;
}

const QuestionCard = ({ index, question, deleteQuestionItem } : QuestionCardProps) => {

  return (
    <div className={styles.questionCard}>
      <div className={styles.questionContent}>
        <h3 className={styles.questionHeader}>{question.question}</h3>
        <span>Correct: {question.answer}</span>
        <span>Incorrect: {question.dummy}</span>
      </div>
      <TertiaryIconButton onClick={() => deleteQuestionItem(index)}>
        <Image src={deleteIcon} alt="Delete" />
      </TertiaryIconButton>
    </div>
  );
};

export default QuestionCard;
