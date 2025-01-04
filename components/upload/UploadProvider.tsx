import React, { useReducer } from "react";
import { toast } from "react-toastify";
import { reducer, initialState, UploadContext } from "./UploadContext";
import { useAuth } from "@/firebase/useAuth";
import { getChunkedDataAsync, getBatchedChunks, getQuestionsAndEmbeddingsAsync } from "@/components/upload/utils";

// Provider Component
interface UploadProviderProps {
    children: React.ReactNode;
}

export const UploadProvider = ({ children }: UploadProviderProps) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { user } = useAuth();

  const getNumOfQuestions = () => {
    let count = 0;
    state.embeddings.forEach(item => {
      count += item.questions.length;
    });
    
    return count;
  };

  const generateEmbeddings = async () => {
    dispatch({ type: "SET_UPLOAD_STATUS", payload: "generating" });

    const documents = state.documents.filter(text => text.trim() !== "");

    if (documents.length === 0) {
      toast.warn("No documents with text to submit");
      dispatch({ type: "SET_UPLOAD_STATUS", payload: "upload" });
      return;
    }

    const batchSize = 4;
    for (let i = 0; i < documents.length; i++) {
      const document = documents[i];

      const chunks = await getChunkedDataAsync(document);

      const batchedChunks = getBatchedChunks(chunks, batchSize);

      for (let j = 0; j < batchedChunks.length; j++) {
        const { questions, embeddings } = await getQuestionsAndEmbeddingsAsync(batchedChunks[j]);
        console.log(questions);
        console.log(embeddings);
        // dispatch({ type: "ADD_EMBEDDINGS", payload: embeddings });
        // dispatch({ type: "ADD_QUESTIONS", payload: questions });
      }



      console.log(batchedChunks);
    }


    setTimeout(() => {
      dispatch({ type: "SET_UPLOAD_STATUS", payload: "review" });
    }, 1000);
  };

  return (
    <UploadContext.Provider value={{ state, dispatch, generateEmbeddings, getNumOfQuestions }}>
      {children}
    </UploadContext.Provider>
  );
};