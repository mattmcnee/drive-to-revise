import React from 'react';
import QuestionCard from './QuestionCard';

import { useUploadContext } from '@/components/upload/UploadContext';
import LoadingOrSubmit from '@/components/upload/questions/LoadingOrSubmit';
import styles from './GeneratedQuestions.module.scss';
import ShapeIconClickable from '@/components/ui/ShapeIconClickable';

const GeneratedQuestions = () => {
  const { state, dispatch , saveToFirestore } = useUploadContext();

  const deleteQuestionItem = (index: number) => {
    dispatch({ type: 'DELETE_QUESTION', payload: index });
  }

  const updateIconShape = (shape: string) => {
    dispatch({ type: 'SET_ICON_SHAPE', payload: shape });
  }

  const updateTitle = (title: string) => {
    dispatch({ type: 'SET_TITLE', payload: title });
  }

  return (
    <div className={styles.embeddingCont}>
      <LoadingOrSubmit status={state.status} onSubmit={() => saveToFirestore()} />
      <div className={styles.uploadHeader}>
        <ShapeIconClickable shape={state.metadata.iconShape} setShape={updateIconShape} size={52}/>
        <input type='text' placeholder='Enter your title' className={styles.uploadTitle} value={state.metadata.title} onChange={(e) => updateTitle(e.target.value)} />
      </div>
      {state.questions.map((item, index) => (
        <QuestionCard
          key={index}
          index={index}
          question={item}
          deleteQuestionItem={deleteQuestionItem}
        />
      ))}
      {state.questions.length >= 6 && (
        <LoadingOrSubmit status={state.status} onSubmit={() => saveToFirestore()} />
      )}
    </div>
  );
};

export default GeneratedQuestions;