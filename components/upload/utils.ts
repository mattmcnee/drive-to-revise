import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import axios from "axios";
import { toast } from "react-toastify";
import { Question, TextEmbedding } from "@/types/index.types";

const questionGenerationInstructions = "You generate questions with an answer and a dummy (incorrect) answer. Your output MUST ALWAYS be a JSON array.";
const questionGenerationPrompt = `Output UP TO four questions designed to teach the provided content. Return fewer than four if there is insufficient content or [] if no relevant questions can be generated.
DO NOT rely on references to anything in the provided text. The questions must be answerable without the text.
Dummy answers must be INCORRECT for the question or statement. Consider more general contexts. They MUST be INCORRECT in ALL contexts.
Half of the questions must be Format A and half of them must be Format B.

Format A:
{
  "question": (question related to the concept in the content),
  "answer": (short answer)
  "dummy": (INCORRECT but plausible answer; INCORRECT in ALL contexts)
}

Format B:
{
  "question": (DESCRIBE the keyterm in a statement based on the content. DO NOT use ANY of the words of the keyterm.),
  "answer": (keyterm)
  "dummy": (INCORRECT but plausible keyterm; INCORRECT in ALL contexts)
}

Answers MUST BE less than 5 words and MUST BE less than 5 mathematical symbols. Questions should be longer but must be less than 12 words.
 
Here is the target content:\n\n`;

// Randomly generated new ID
const generateNewId = (length = 20) => {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    result += characters[randomIndex];
  }
  
  return result;
};

// Split document using langchain recursive text splitter
export const getChunkedDataAsync = async (text: string, chunkSize = 512, chunkOverlap = 128) => {
  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize,
    chunkOverlap,
    separators: ["\n\n", "\n", " ", ""]
  });

  return await splitter.splitText(text);
};

// Create batches of chunks for processing
export const getBatchedChunks = (chunks: string[], batchSize = 8) => {
  const batchedChunks = [];
  for (let i = 0; i < chunks.length; i += batchSize) {
    batchedChunks.push(chunks.slice(i, i + batchSize));
  }

  return batchedChunks;
};

// Fetch text embedding for a chunk
export const getTextEmbeddingAsync = async (chunk: string) => {
  try {
    const response = await axios.post(
      "/api/getEmbedding",
      { inputText: chunk },
      {
        headers: {
          "Content-Type": "application/json"
        }
      }
    );
    
    return {
      text: chunk,
      value: response.data.embedding
    };
  } catch (error) {
    toast.error("Failed to fetch embedding");
    console.error("Error fetching embedding for chunk:", error);
    
    return {
      text: chunk,
      value: null
    };
  }
};

// Validate a question object
const isValidQuestion = (question: any): question is Question =>
  typeof question.answer === "string" &&
  typeof question.question === "string" &&
  typeof question.dummy === "string" &&
  (question.id === undefined || typeof question.id === "string");

// Returns any valid questions for a valid array or [] otherwise
const getValidQuestions = (questions: any[]): Question[] => {
  if (Array.isArray(questions)) {
    return questions.filter(isValidQuestion);
  } else {
    return [];
  }
};

// Fetch generated questions for a chunk
export const getGeneratedQuestionAsync = async (text: string) => {
  const model = "gpt-4o-mini";
  const temperature = 0.3;
  const max_tokens = 500;

  const messages = [
    { role: "system", content: questionGenerationInstructions },
    { role: "user", content: `${questionGenerationPrompt} ${text}` },
  ];

  try {
    const response = await axios.post(
      "/api/getChatCompletion",
      { model, temperature, max_tokens, messages },
      {
        headers: {
          "Content-Type": "application/json"
        }
      }
    );

    // Parse JSON questions and validate them
    const message = response.data.message;
    const questions = JSON.parse(message.replace(/^```(?:json)?\n|\n```$/g, "").trim());
    const validQuestions = getValidQuestions(questions);

    validQuestions.forEach((question: Question) => {
      question.id = generateNewId();
    });

    return validQuestions;
  } catch (error) {
    console.error("Error fetching chat completion:", error);
    toast.error("Failed to fetch questions");
    
    return [];
  }
};

// Process a batch of chunks
// Handle both text embeddings and generated questions
export const getQuestionsAndEmbeddingsAsync = async (batch: string[]) => {
  const embeddings: TextEmbedding[] = [];
  const questions: Question[] = [];

  const promises = batch.map(async (item) => {
    const [embedding, generatedQuestions] = await Promise.all([
      getTextEmbeddingAsync(item),
      getGeneratedQuestionAsync(item)
    ]);

    embeddings.push(embedding);
    questions.push(...generatedQuestions);
  });

  await Promise.all(promises);

  return { embeddings, questions };
};