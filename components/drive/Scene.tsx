import React, { useRef, useState, useEffect, useCallback, use } from "react";
import { Canvas } from "@react-three/fiber";
import { Sky } from "@react-three/drei";
import { Vector3 } from "three";
import RoadContructor from "./road/RoadContructor";
import { DatasetDocument, RoadData, GameState, VehicleModel } from "@/types/index.types";

import styles from "./Scene.module.scss";

import { 
  generateRoadSegment, 
  getNextQuestion, 
  getNextSegmentsFirstQuestion,
} from "@/components/drive/utils";
import Vehicle from "@/components/drive/vehicle/Vehicle";
import ScenePanel from "@/components/drive/ScenePanel";

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

  const vehicleTypes: VehicleModel[] = ["muscle_car", "family_car", "old_car"];
  const randomVehicleType = vehicleTypes[Math.floor(Math.random() * vehicleTypes.length)];


  const [gameState, setGameState] = useState<GameState>(
    {
      started: false,
      questionFailed: null,
      displayedQuestion: null,
      accelerateVehicle: false,
      vehicleType: randomVehicleType,
      maxSpeed: 4
    }
  );

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

  const startGame = (vehicleType: "default" | VehicleModel = "family_car") => {
    if (vehicleType === "default") {
      vehicleType = gameState.vehicleType;
    }

    let maxSpeed;
    switch (vehicleType) {
    case "family_car":
      maxSpeed = 4;
      break;
    case "old_car":
      maxSpeed = 8.2;
      break;
    case "muscle_car":
      maxSpeed = 12.4;
      break;
    default:
      maxSpeed = 4;
      break;
    }

    setGameState(prevGameState => ({
      ...prevGameState,
      started: true,
      questionFailed: null,
      accelerateVehicle: true,
      vehicleType: vehicleType,
      maxSpeed: maxSpeed
    }));
  };

  const checkQuestion = (questionIndex: number, segmentIndex: number, currentOffset: number) => {
    const segment = roadData.segments[segmentIndex];

    if (!segment.hasGates || !segment.questions) {
      const nextQuestionUi = getNextSegmentsFirstQuestion(segmentIndex, roadData);
      if (nextQuestionUi){
        setGameState(prevGameState => ({
          ...prevGameState,
          displayedQuestion: nextQuestionUi
        }));
      }
      
      return;
    }

    const nextQuestionUi = getNextQuestion(questionIndex, segmentIndex, roadData);
    if (nextQuestionUi){
      setGameState(prevGameState => ({
        ...prevGameState,
        displayedQuestion: nextQuestionUi
      }));
    }

    const answerLeft = segment.questions[questionIndex].answerLeft;

    if (answerLeft && currentOffset < -0.2 || !answerLeft && currentOffset > 0.2) {
    } else {
      setGameState(prevGameState => ({
        ...prevGameState,
        accelerateVehicle: false,
        questionFailed: segment.questions?.[questionIndex] || null
      }));
    }
  };

  // Initialize the road with 3 segments; cleanup when unmounting
  useEffect(() => {
    if (!inputData || inputData.questions.length <= 0) return;

    liveQuestions.current = inputData.questions.map(q => ({
      uses: 0,
      answer: q.answer,
      dummy: q.dummy,
      question: q.question,
      id: q.id
    }));

    createInitialSegment();
    addSegment(false);
    addSegment();

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
          started={gameState.started}
          maxSpeed={gameState.maxSpeed}
          type={gameState.vehicleType}
        />

        <RoadContructor segments={roadData.segments} />
      </Canvas>

      <div className={styles.sceneOverlay}>
        <ScenePanel gameState={gameState} startGame={startGame} dataset={inputData} />
      </div>
    </div>
  );
};

export default Scene;