import React from "react";
import QuestionCard from "./QuestionCard";

import { useUploadContext } from "@/components/upload/UploadContext";
import styles from "./GeneratedQuestions.module.scss";
import { PrimaryButton } from "@/components/ui/Buttons";

const GeneratedQuestions = () => {
  const { state, dispatch, saveToFirestore } = useUploadContext();

  return (
    <div className={styles.embeddingCont}>
      {state.questions.map((item, index) => (
        <QuestionCard
          key={index}
          index={index}
          question={item}
        />
      ))}
      <PrimaryButton onClick={() => saveToFirestore()}>
        Review Questions
      </PrimaryButton>
    </div>
  );
};

export default GeneratedQuestions;
