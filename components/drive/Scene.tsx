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

const Scene = () => {
  const [roadData, setRoadData] = useState<RoadData>({
    segments: [],
    lastDirection: new Vector3(),
    passedSegments: 0
  });

  const createInitialSegment = () => {
    const segment = generateRoadSegment();
    setRoadData(prevData => ({
      segments: [...prevData.segments, segment],
      lastDirection: segment.endDirection,
      passedSegments: 0
    }));
  };

  const addSegment = () => {
    setRoadData(prevData => {
      const lastSegment = prevData.segments[prevData.segments.length - 1];
      const newSegment = generateRoadSegment(lastSegment.points[3], prevData.lastDirection);
      
      return {
        segments: [...prevData.segments, newSegment],
        lastDirection: newSegment.endDirection,
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

  useEffect(() => {
    createInitialSegment();
    addSegment();
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