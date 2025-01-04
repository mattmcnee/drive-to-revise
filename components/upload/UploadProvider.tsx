import React, { useReducer } from "react";
import { toast } from "react-toastify";
import { reducer, initialState, UploadContext } from "./UploadContext";
import { useAuth } from "@/firebase/useAuth";
import { getChunkedDataAsync, getBatchedChunks, getQuestionsAndEmbeddingsAsync } from "@/components/upload/utils";
import { createDatasetDocument } from "@/firebase/firestoreInterface";

// Provider Component
interface UploadProviderProps {
    children: React.ReactNode;
}

export const UploadProvider = ({ children }: UploadProviderProps) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { user } = useAuth();

  const generateEmbeddings = async () => {
    dispatch({ type: "SET_UPLOAD_STATUS", payload: "generating" });

    const documents = state.documents.filter(text => text.trim() !== "");

    if (documents.length === 0) {
      toast.warn("No documents with text to submit");
      dispatch({ type: "SET_UPLOAD_STATUS", payload: "upload" });
      
      return;
    }

    
    // Process each document individually
    for (let i = 0; i < documents.length; i++) {
      const document = documents[i];

      // Split the document into chunks
      const chunks = await getChunkedDataAsync(document);

      // Split these chunks into batches for concurrent processing
      const batchSize = 4;
      const batchedChunks = getBatchedChunks(chunks, batchSize);

      // Process each batch
      for (let j = 0; j < batchedChunks.length; j++) {
        const { questions, embeddings } = await getQuestionsAndEmbeddingsAsync(batchedChunks[j]);
        dispatch({ type: "ADD_EMBEDDINGS", payload: embeddings });
        dispatch({ type: "ADD_QUESTIONS", payload: questions });
      }
    }

    dispatch({ type: "SET_UPLOAD_STATUS", payload: "review" });
  };

  const saveToFirestore = async () => {
    if (!user) {
      toast.error("You must be logged in to save a dataset");
      
      return;
    }

    dispatch({ type: "SET_UPLOAD_STATUS", payload: "submitted" });
    const setId = await createDatasetDocument(user.uid, state);
    window.location.href = `/drive/${setId}`;
  };

  return (
    <UploadContext.Provider value={{ state, dispatch, generateEmbeddings, saveToFirestore }}>
      {children}
    </UploadContext.Provider>
  );
};