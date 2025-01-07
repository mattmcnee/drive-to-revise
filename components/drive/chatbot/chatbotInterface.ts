import axios from "axios";
import { toast } from "react-toastify";
import { getTextEmbeddingAsync } from "@/components/upload/utils";
import { ChatMessage, Question, TextEmbedding } from "@/types/index.types";

// Cosine vector search
const getTopSimilarVectors = (embeddings: TextEmbedding[], target: TextEmbedding, k = 3) => {
  // OpenAI embeddings are normalised so we can use the dot product
  const dotProduct = (a: number[], b: number[]) => a.reduce((sum, ai, i) => sum + ai * b[i], 0);

  // Sort embeddings by similarity to target
  const similarities = embeddings.map(embedding => ({
    embedding,
    similarity: dotProduct(embedding.value, target.value)
  }));
  similarities.sort((a, b) => b.similarity - a.similarity);

  // Return top k embeddings
  return similarities.slice(0, k).map(similarity => similarity.embedding);
};

// Convert question object to text and get embedding from OpenAI
// Then use getTopSimilarVectors to get the top k similar embeddings
export const getTopSimilarEmbeddingsAsync = async (embeddings: TextEmbedding[], question: Question, k = 3) => {
  const text = `${question.question} ${question.answer} ${question.dummy}`;
  const target = await getTextEmbeddingAsync(text);
  const similarEmbeddings = getTopSimilarVectors(embeddings, target, k);
  
  return similarEmbeddings;
};

// This is the first stage of a text response in the chat interface
// The AI is asked to validate whether the user has understood a concept
export const validateUserUnderstandsAsync = async (question : Question, input: string, similarEmbeddings: TextEmbedding[], currentMessages: ChatMessage[]) => {
  const similarTexts = similarEmbeddings.map(embedding => embedding.text);

  // Use the GPT-4o-mini model to validate the user's understanding
  const model = "gpt-4o-mini";
  const temperature = 0.3;
  const max_tokens = 500;

  // Prompt the AI with RAG data and intructions to validate the user's understanding
  const validateInstructions = "You validate whether a user has understood a concept, returning either True or False.";
  const prompt = `The question is "${question.question}"
The user previously answered incorrectly with "${question.dummy}".

Now, the user has either:
- asked for help
- explained why "${question.answer}" is the correct answer
- explained why "${question.dummy}" is the incorrect answer

Their response is:
${input}

They may either explain why the correct answer is correct or why the incorrect answer is incorrect.
Be lenient with spelling and grammar errors.

The following is context for the question:
${similarTexts.join("\n")}

If the explanation is incorrect, return: False
If repeats the correct answer with no further explanation, return: False
If an explanation is lacking, return: False
Only if the explanation is correct, return: True
If the user is asking for help, return: False`;

  const messages = [
    { role: "system", content: validateInstructions },
    { role: "user", content: prompt },
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

    let message = response.data.message;
    const isValid = message.toLowerCase().replace(".", "").includes("true");

    // If the AI says the user hasn't understood: 
    // Use explainConceptAsync to provide a chatbot response
    if (!isValid) {
      message = await explainConceptAsync(question, currentMessages, similarEmbeddings);
      if (message === "") return {valid: true, message: "AI currently unavailable"};
    }

    return {valid: isValid, message: message};
  } catch (error) {
    console.error("Error fetching chat completion:", error);
    toast.error("Failed to fetch questions");
    
    return {valid: true, message: "AI currently unavailable"};
  }
};

// This is the second stage of a text response in the chat interface
// The AI is functioning as a chatbot to explain a concept to the user
export const explainConceptAsync = async (question: Question, currentMessages: ChatMessage[], similarEmbeddings: TextEmbedding[]) => {
  const similarTexts = similarEmbeddings.map(embedding => embedding.text);

  // Pass in the last 5 messages to the AI to provide context
  // Filter out any messages that aren't from the user or assistant
  // Messages just for the interface have role "ui"
  const newMessages = currentMessages
    .filter(message => message.role === "user" || message.role === "assistant")
    .slice(-5);

  // Use the GPT-4o-mini model to explain a concept to the user
  const model = "gpt-4o-mini";
  const temperature = 0.3;
  const max_tokens = 500;

  // Prompt the AI with RAG data and intructions to explain the concept
  const instructions = `You explain a concept to a user in up to three short sentences, separated by newlines. Each sentence must be less than 18 words.

The user wants to know why the answer to "${question.question}" is "${question.answer}" as they incorrectly answered "${question.dummy}".

The user can restart the game (keep driving) by explaining why "${question.answer}" is the correct answer to the question.

The following context may be relevant:
${similarTexts.join("\n")}

If the user asks a question, says something incorrect or asks for help/explanation:
- Use the concept to explain why "${question.answer}" is correct and "${question.dummy}" is incorrect.
- Return up to three short sentences, separated by newlines.
- Prioritise concepts that are in the context provided.
- ONLY at the end of an explanation, remind the user that they can restart the game by explaining why "${question.answer}" is the correct answer.

IF the user asks for general help: explain why "${question.answer}" is correct and "${question.dummy}" is incorrect  

Be concise in your answers. Respond to greetings with an acknowledgement and ask the user what they would like to know.
Do not offer to assist.
Do not remind the user that they can restart the game unless you have explained the correct answer.`;

  const messages = [
    { role: "system", content: instructions },
    ...newMessages,
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

    const explanation = response.data.message;
    
    return explanation;
  } catch (error) {
    console.error("Error fetching chat completion:", error);
    toast.error("Failed to fetch explanation");

    return "";
  }
};