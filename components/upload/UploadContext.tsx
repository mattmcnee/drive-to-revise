
import React, { createContext, useContext, useReducer, Dispatch } from "react";
import { Section } from "@/components/upload/utils";

export interface UploadData {
    documents: string[];
    embeddings: Section[];
    status: string;
    metadata: {
        iconShape: string;
        username: string;
        title: string;
    };
}

const randomShape = () => {
  const shapes = ["circle", "square", "triangle", "diamond", "pentagon", "hexagon"];
  
  return shapes[Math.floor(Math.random() * shapes.length)];
};

// Initial reducer state
export const initialState: UploadData = {
  documents: [""],
  embeddings: [],
  status: "upload",
  metadata: {
    iconShape: randomShape(),
    username: "user",
    title: ""
  }
};

// All actions that can be dispatched to the reducer
export type UploadAction = 
  { type: "SET_UPLOAD_STATUS"; payload: string };

// Updates the state based on the action dispatched
export const reducer = (data: UploadData, action: UploadAction): UploadData => {
  switch (action.type) {

    // Generate embeddings and questions from the uploaded documents
    case "SET_UPLOAD_STATUS":
      return { ...data, status: action.payload };
    
    default:
      return data;
  }
};

// Create Context
interface UploadContextType {
    state: UploadData;
    dispatch: Dispatch<UploadAction>;
    generateEmbeddings: () => void;
    getNumOfQuestions: () => number;
}

export const UploadContext = createContext<UploadContextType | undefined>(undefined);

// Custom Hook to use the context
export const useUploadContext = () => {
  const context = useContext(UploadContext);
  if (!context) {
    throw new Error("useUploadContext must be used within an UploadProvider");
  }
  
  return context;
};
