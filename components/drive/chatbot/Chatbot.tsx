import React, { useEffect, useState, useRef, useCallback } from "react";
import styles from "./Chatbot.module.scss";
import { TertiaryIconButton } from "@/components/ui/Buttons";
import sendIcon from "@/public/icons/send.svg";
import Image from "next/image";
import { validateUserUnderstandsAsync, getTopSimilarEmbeddingsAsync } from "./chatbotInterface";
import { TextEmbedding, Question, VehicleModel, ChatMessage } from "@/types/index.types";

interface ChatbotProps {
  startGame: (vehicleType: "default" | VehicleModel) => void;
  embeddings: TextEmbedding[];
  question: Question;
}

const AssistantMessage = ({ content }: { content: string }) => {
  // AI is prompted to splt the content into multiple lines
  // We use the to create multiple message bubbles
  const splits = content.split("\n").filter(split => split.length > 0);
  
  return (
    <>
      {splits.map((split, idx) => (
        <div key={idx} className={styles.assistant}>{split}</div>
      ))}
    </>
  );
};

const Chatbot = ({startGame, embeddings, question} : ChatbotProps)  => {
  const [questions, setQuestions] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState("");
  const similarEmbeddingsRef = useRef<TextEmbedding[]>([]);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Fetch the text of the top similar embeddings to the question
  const getEmbeddings = useCallback(async () => {
    const newEmbeddings = await getTopSimilarEmbeddingsAsync(embeddings, question);
    similarEmbeddingsRef.current = newEmbeddings;
  }, [embeddings, question]);

  // Initialise the chatbot with intructions for the user
  useEffect(() => {
    setQuestions([
      {role: "ui", content: `Explain why "${question.answer}" is the correct answer to get started again`},
      {role: "ui", content: "Or, ask me for help and I'll explain it from your notes"}
    ]);

    getEmbeddings();
    
  }, [question, getEmbeddings]);

  // Scroll to the bottom of the chat when new messages are added
  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = scrollContainerRef.current.scrollHeight;
    }
  }, [questions]);

  const handleSubmit = async () => {
    if (inputText.length === 0) return;

    // Add the user's question to the chat and clear the input
    const updatedQuestions = [...questions, { role: "user", content: inputText }, { role: "ui", content: "..." }];
    setQuestions(updatedQuestions); 
    setInputText("");
    
    // Use a promise to wait until similarEmbeddings are returned
    if (similarEmbeddingsRef.current.length === 0) {
      await new Promise(resolve => {
        const checkEmbeddings = setInterval(() => {
          if (similarEmbeddingsRef.current.length > 0) {
            clearInterval(checkEmbeddings);
            resolve(null);
          }
        }, 100);
      });
    }

    // If valid, user has understood the question and can return to the game
    // If not valid, message contains a response explaining the concept
    const {valid, message} = await validateUserUnderstandsAsync(question, inputText, similarEmbeddingsRef.current, updatedQuestions);
    const filteredQuestions = updatedQuestions.filter(q => q.content !== "...");
    if (valid) {
      setQuestions([
        ...filteredQuestions,
        { role: "assistant", content: "That's correct" },
        { role: "play", content: "Click this message to continue the game" },
      ]);
    } else {
      setQuestions([
        ...filteredQuestions,
        { role: "assistant", content: message },
      ]);
    }
  };
  
  return (
    <div className={styles.chatbotContainer}>
      <div className={styles.questionHeader}>
        <h3>{question.question}</h3>
      </div>
      <div className={styles.scrollContainer} ref={scrollContainerRef}>
        <div className={styles.questionsContainer}>
          {questions.map((q, index) => (
            q.role === "play" ? (
              <div key={index}>
                <div onClick={() => startGame("default")} className={styles.assistantClickable}>{q.content}</div>
              </div>
            ) : (
              q.role === "ui" || q.role === "assistant" ? (
                <AssistantMessage key={index} content={q.content} />
              ) : (
                <div key={index} className={styles.user}>{q.content}</div>
              )
            )
          ))}
        </div>
      </div>
      <div className={styles.inputContainer}>
        <input 
          type="text" 
          placeholder="Ask me for help" 
          className={styles.input} 
          value={inputText} 
          onChange={(e) => setInputText(e.target.value)} 
          onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
        />
        <TertiaryIconButton onClick={handleSubmit}>
          <Image src={sendIcon} alt="send" width={24} height={24} className={styles.sendIcon}/>
        </TertiaryIconButton>
      </div>
    </div>
  );
};

export default Chatbot;