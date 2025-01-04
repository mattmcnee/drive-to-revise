import React, { useRef, useState, useEffect, useCallback, use } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Sky } from "@react-three/drei";
import { Vector3 } from "three";
import RoadContructor from "./road/RoadContructor";

import { PrimaryButton } from "@/components/ui/Buttons";
import { DatasetDocument } from "@/firebase/firestoreInterface";

import styles from "./Scene.module.scss";

import { RoadData, GameState, generateRoadSegment, getNextQuestion, getNextSegmentsFirstQuestion } from "@/components/drive/utils";
import Vehicle from "./Vehicle";
import ScenePanel from "./ScenePanel";

import questions from "./questions.json";

interface SceneProps {
  inputData: DatasetDocument;
}

interface LiveQuestion {
  question: string;
  answer: string;
  dummy: string;
  uses: number;
  id: string;
}

const Scene = ({ inputData }: SceneProps) => {
  const liveQuestions = useRef<LiveQuestion[]>([]);
  const [roadData, setRoadData] = useState<RoadData>({
    segments: [],
    lastDirection: new Vector3(),
    passedSegments: 0
  });

  const [gameState, setGameState] = useState<GameState>(
    {
      started: false,
      questionFailed: null,
      displayedQuestion: null,
      accelerateVehicle: false
    }
  );

  console.log("Render Scene");

  const createInitialSegment = () => {
    const segment = generateRoadSegment();
    setRoadData(prevData => ({
      segments: [...prevData.segments, segment],
      lastDirection: segment.endDirection || new Vector3(),
      passedSegments: 0
    }));
  };

  const getNextQuestionData = useCallback(() => {
    const minUses = Math.min(...liveQuestions.current.map(q => q.uses));
    const candidates = liveQuestions.current.filter(q => q.uses === minUses);
    const randomIndex = Math.floor(Math.random() * candidates.length);
    const selectedQuestion = candidates[randomIndex];

    liveQuestions.current = liveQuestions.current.map(q =>
      q.id === selectedQuestion.id ? { ...q, uses: q.uses + 1 } : q
    );

    return {
      ...selectedQuestion,
      isMirror: Math.random() > 0.5,
      answerLeft: Math.random() > 0.5
    };
  }, []);

  const addSegment = useCallback((hasGates = true) => {
    setRoadData(prevData => {
      const lastSegment = prevData.segments[prevData.segments.length - 1];
      let questions;

      const newSegment = generateRoadSegment(lastSegment.points[3], prevData.lastDirection, hasGates);
      let questionSegment;

      if (hasGates) {
        questions = Array.from({ length: 3 }, () => getNextQuestionData());
        questionSegment = {
          ...newSegment,
          questions
        };
      } else {
        questionSegment = newSegment;
      }

      return {
        segments: [...prevData.segments, questionSegment],
        lastDirection: questionSegment.endDirection || new Vector3(),
        passedSegments: prevData.passedSegments
      };
    });
  }, [getNextQuestionData]);

  const removePassedSegment = () => {
    setRoadData((prevData) => {
      const newSegments = prevData.segments.slice(1);
      
      return {
        segments: newSegments,
        lastDirection: prevData.lastDirection,
        passedSegments: prevData.passedSegments + 1
      };
    });
  };

  const startGame = () => {
    setGameState(prevGameState => ({
      ...prevGameState,
      started: true,
      questionFailed: null,
      accelerateVehicle: true
    }));
  };

  const checkQuestion = (questionIndex: number, segmentIndex: number, currentOffset: number) => {
    const segment = roadData.segments[segmentIndex];

    if (!segment.hasGates || !segment.questions) {
      const nextQuestionUi = getNextSegmentsFirstQuestion(segmentIndex, roadData);
      console.log("Next question UI", nextQuestionUi);
      if (nextQuestionUi){
        setGameState(prevGameState => ({
          ...prevGameState,
          displayedQuestion: nextQuestionUi
        }));
      }
      
      return;
    }

    const nextQuestionUi = getNextQuestion(questionIndex, segmentIndex, roadData);
    console.log("Next question UI", nextQuestionUi);
    if (nextQuestionUi){
      setGameState(prevGameState => ({
        ...prevGameState,
        displayedQuestion: nextQuestionUi
      }));
    }

    const answerLeft = segment.questions[questionIndex].answerLeft;

    if (answerLeft && currentOffset < -0.2 || !answerLeft && currentOffset > 0.2) {
      console.log("Correct answer");
    } else {
      setGameState(prevGameState => ({
        ...prevGameState,
        accelerateVehicle: false,
        questionFailed: segment.questions?.[questionIndex] || null
      }));
      console.log("Incorrect answer");
    }
  };

  // Initialize the road with 3 segments; cleanup when unmounting
  useEffect(() => {
    if (inputData.questions.length > 0) {
      liveQuestions.current = inputData.questions.map(q => ({
        uses: 0,
        answer: q.answer,
        dummy: q.dummy,
        question: q.question,
        id: q.id
      }));
    }

    createInitialSegment();
    addSegment(false);
    addSegment();

    console.log("Road Data", inputData);



    return () => {
      setRoadData({
        segments: [],
        lastDirection: new Vector3(),
        passedSegments: 0
      });
    };
  }, [addSegment, inputData]);

  return (
    <div className={styles.sceneContainer}>
      <Canvas className={styles.canvas}>

        <ambientLight intensity={0.1}/>
        <directionalLight position={[5, 10, 7.5]} intensity={0.9} />
        <Sky distance={450000} sunPosition={[100, 10, -100]} inclination={0.9} azimuth={0.65}/>

        <Vehicle 
          roadData={roadData} 
          removePassedSegment={removePassedSegment} 
          addRoadSegment={addSegment} 
          accelerate={gameState.accelerateVehicle}
          checkQuestion={checkQuestion}
        />

        <RoadContructor segments={roadData.segments} />

        <OrbitControls 
          enableZoom={true}
          enablePan={true}
          enableRotate={true}
          minDistance={2}
          maxDistance={50}
        />
      </Canvas>

      <div className={styles.sceneOverlay}>
        <ScenePanel gameState={gameState} startGame={startGame} />
      </div>
    </div>
  );
};

export default Scene;