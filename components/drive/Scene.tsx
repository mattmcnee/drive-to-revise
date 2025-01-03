import React, { useRef, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Sky } from "@react-three/drei";
import { Vector3 } from "three";

import { generateRoadSegment } from "./utils";
import RoadContructor from "./road/RoadContructor";

import { PrimaryButton } from "@/components/ui/Buttons";

import styles from "./Scene.module.scss";

import { RoadData } from "@/components/drive/utils";
import Vehicle from "../Vehicle";

import questions from "./questions.json";

const Scene = () => {
  const liveQuestions = useRef(questions.map(q => ({ ...q, uses: 0 })));
  const [roadData, setRoadData] = useState<RoadData>({
    segments: [],
    lastDirection: new Vector3(),
    passedSegments: 0
  });

  const createInitialSegment = () => {
    const segment = generateRoadSegment();
    setRoadData(prevData => ({
      segments: [...prevData.segments, segment],
      lastDirection: segment.endDirection || new Vector3(),
      passedSegments: 0
    }));
  };

  const addSegment = (hasGates = true) => {
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
        }
      } else {
        questionSegment = newSegment;
      }

      console.log(questionSegment);

      return {
        segments: [...prevData.segments, questionSegment],
        lastDirection: questionSegment.endDirection || new Vector3(),
        passedSegments: prevData.passedSegments
      };
    });
  };

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

  const getNextQuestionData = () => {
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
  };

  // Initialize the road with 3 segments; cleanup when unmounting
  useEffect(() => {
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
  }, []);

  return (
    <div className={styles.sceneContainer}>
      <Canvas className={styles.canvas}>

        <ambientLight intensity={0.1}/>
        <directionalLight position={[5, 10, 7.5]} intensity={0.9} />
        <Sky distance={450000} sunPosition={[100, 10, -100]} inclination={0.9} azimuth={0.65}/>

        <Vehicle roadData={roadData} removePassedSegment={removePassedSegment} addRoadSegment={addSegment} />

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
      </div>
    </div>
  );
};

export default Scene;