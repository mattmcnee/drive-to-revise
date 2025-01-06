import React, { useEffect, useState, useRef, useCallback } from "react";
import styles from "./Chatbot.module.scss";
import { TertiaryIconButton } from "@/components/ui/Buttons";
import { TextEmbedding } from "@/components/upload/utils";
import { Question, VehicleModel } from "../utils";
import sendIcon from "@/public/icons/send.svg";
import Image from "next/image";
import { validateUserUnderstandsAsync, getTopSimilarEmbeddingsAsync } from "./chatbotInterface";

interface ChatbotProps {
  startGame: (vehicleType: "default" | VehicleModel) => void;
  embeddings: TextEmbedding[];
  question: Question;
}

const AssistantMessage = ({ content }: { content: string }) => {
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
  const [questions, setQuestions] = useState<{ role: string; content: string }[]>([]);
  const [inputText, setInputText] = useState("");
  const similarEmbeddingsRef = useRef<TextEmbedding[]>([]);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const logEmbeddings = useCallback(async () => {
    const newEmbeddings = await getTopSimilarEmbeddingsAsync(embeddings, question);
    similarEmbeddingsRef.current = newEmbeddings;
  }, [embeddings, question]);

  useEffect(() => {
    setQuestions([
      {role: "ui", content: `Explain why "${question.answer}" is the correct answer to get started again`},
      {role: "ui", content: "Or, ask me for help and I'll explain it from your notes"}
    ]);

    logEmbeddings();
    
  }, [question, logEmbeddings]);

  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = scrollContainerRef.current.scrollHeight;
    }
  }, [questions]);

  const handleSubmit = async () => {
    if (inputText.length === 0) return;

    const updatedQuestions = [...questions, { role: "user", content: inputText }, { role: "ui", content: "..." }];
    setQuestions(updatedQuestions); 
    setInputText("");
    
    // Use a promise that resolves when similarEmbeddings are returned
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

    const {valid, message} = await validateUserUnderstandsAsync(question, inputText, similarEmbeddingsRef.current, updatedQuestions);
    const filteredQuestions = updatedQuestions.filter(q => q.content !== "...");
    if (valid) {
      setQuestions([
        ...filteredQuestions,
        { role: "assistant", content: "That's correct" },
        { role: "play", content: "That's correct" },
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
                <div onClick={() => startGame("default")} className={styles.assistantClickable}>Click this message to continue the game</div>
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