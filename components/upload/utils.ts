import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";

export interface Question {
  answer: string;
  question: string;
  dummy: string;
  source: string;
}

export interface Section {
  index: number;
  text: string;
  embedding: string;
  id: string;
  questions: Question[];
  
}

export const getChunkedDataAsync = async (text: string, chunkSize = 512, chunkOverlap = 128) => {
  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize,
    chunkOverlap,
    separators: ["\n\n", "\n", " ", ""]
  });

  return await splitter.splitText(text);
};