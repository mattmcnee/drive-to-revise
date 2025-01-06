
import React, { createContext, useContext, useReducer, Dispatch } from 'react';
import { Section, TextEmbedding, Question } from "@/components/upload/utils";

export interface UploadData {
  documents: string[];
  embeddings: TextEmbedding[];
  questions: Question[];
  status: string;
  metadata: {
      iconShape: string;
      username: string;
      title: string;
  };
}

const randomShape = () => {
  const shapes = ['circle', 'square', 'triangle', 'diamond', 'pentagon', 'hexagon'];
  return shapes[Math.floor(Math.random() * shapes.length)];
};

// Initial reducer state
export const initialState: UploadData = {
  documents: [""],
  embeddings: [],
  questions: [],
  status: "upload",
  metadata: {
    iconShape: randomShape(),
    username: "user",
    title: ""
  }
};

// All actions that can be dispatched to the reducer
export type UploadAction = 
  { type: "ADD_DOCUMENT"; payload: string }
| { type: "SET_DOCUMENT_TEXT"; payload: { index: number; text: string } }
| { type: "SET_UPLOAD_STATUS"; payload: string }
| { type: "ADD_EMBEDDINGS"; payload: TextEmbedding[] }
| { type: "ADD_QUESTIONS"; payload: Question[] }
| { type: "DELETE_QUESTION"; payload: number }
| { type: 'SET_ICON_SHAPE'; payload: string }
| { type: 'SET_TITLE'; payload: string };

// Updates the state based on the action dispatched
export const reducer = (data: UploadData, action: UploadAction): UploadData => {
  switch (action.type) {

  // Add a new document to the .documents array
  case "ADD_DOCUMENT": 
    return { ...data, documents: [...data.documents, action.payload] };

    // Update the text of a document at a specific index
  case "SET_DOCUMENT_TEXT":
    const updatedDocuments = data.documents.map((doc, index) =>
      index === action.payload.index ? action.payload.text : doc
    );
    
    return { ...data, documents: updatedDocuments };

    // Generate embeddings and questions from the uploaded documents
  case "SET_UPLOAD_STATUS":
    return { ...data, status: action.payload };

  
  // Delete a question from the .questions array
  case "DELETE_QUESTION":
    const updatedQuestions = data.questions.filter((_, idx) => idx !== action.payload);
    return { ...data, questions: updatedQuestions };

    // Add embeddings to the .embeddings array
  case "ADD_EMBEDDINGS":
    return { ...data, embeddings: [...data.embeddings, ...action.payload] };

    // Add questions to the .questions array
  case "ADD_QUESTIONS":
    return { ...data, questions: [...data.questions, ...action.payload] };

    case 'SET_ICON_SHAPE':
      return { ...data, metadata: { ...data.metadata, iconShape: action.payload } };
  
    case 'SET_TITLE':
      return { ...data, metadata: { ...data.metadata, title: action.payload } };
  
    
  default:
    return data;
  }
};

// Create Context
interface UploadContextType {
    state: UploadData;
    dispatch: Dispatch<UploadAction>;
    generateEmbeddings: () => void;
    saveToFirestore: () => void;
}

export const UploadContext = createContext<UploadContextType | undefined>(undefined);

// Custom Hook to use the context
export const useUploadContext = () => {
  const context = useContext(UploadContext);
  if (!context) {
    throw new Error('useUploadContext must be used within an UploadProvider');
  }
  return context;
};