import { Vector3 } from "three";

// Questions as stored in Firestore
export interface DatasetQuestion {
  question: string;
  answer: string;
  dummy: string;
  id: string;
}

// Text embeddings as stored in Firestore
export interface TextEmbedding {
  text: string;
  value: number[];
}

// Dataset as stored in Firestore
export interface DatasetDocument {
  questions: DatasetQuestion[];
  embeddings: TextEmbedding[];
  metadata: {
    iconShape: string;
    username: string;
    title: string;
    created: string;
  };
  userId: string;
  firestoreId?: string;
}

// Data as managed by the upload context
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

// Question as used in the game
export type Question = {
  dummy: string;
  answer: string;
  id?: string;
  question: string;
  isMirror?: boolean;
  answerLeft?: boolean;
};

// Question as displayed in the UI
export type QuestionUi = {
  question: string;
  left: { icon: string; text: string };
  right: { icon: string; text: string };
};

// Segment of the game road
export type Segment = {
  points: Vector3[];
  endDirection?: Vector3;
  hasGates?: boolean;
  questions?: Question[];
};

// All data related to the road
export type RoadData = {
  segments: Segment[];
  lastDirection: Vector3;
  passedSegments: number;
};

// All data related to the game state
export type GameState = {
  started: boolean;
  questionFailed: Question | null;
  displayedQuestion: QuestionUi | null;
  accelerateVehicle: boolean;
  vehicleType: VehicleModel;
  maxSpeed: number;
}

// Allowed vehicle types
export type VehicleModel = "family_car" | "old_car" | "muscle_car";

// An OpenAI style chat message 
export type ChatMessage = { role: string; content: string };