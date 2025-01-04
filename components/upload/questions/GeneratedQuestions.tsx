import React from "react";
import QuestionCard from "./QuestionCard";

import { useUploadContext } from "@/components/upload/UploadContext";
import styles from "./GeneratedQuestions.module.scss";

const GeneratedQuestions = () => {
  const { state, dispatch } = useUploadContext();

  return (
    <div className={styles.embeddingCont}>
      {state.questions.map((item, index) => (
        <QuestionCard
          key={index}
          index={index}
          question={item}
        />
      ))}
    </div>
  );
};

export default GeneratedQuestions;
