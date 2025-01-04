import React, { useReducer } from "react";
import { toast } from "react-toastify";
import { reducer, initialState, UploadContext } from "./UploadContext";
import { useAuth } from "@/firebase/useAuth";

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