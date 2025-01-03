import React, { useRef, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { Vector3 } from "three";

import { generateRoadSegment } from "./utils";
import RoadContructor from "./road/RoadContructor";

import styles from "./Scene.module.scss";

type Segment = {
  points: Vector3[];
};

type RoadData = {
  segments: Segment[];
  lastDirection: Vector3;
};

const Scene = () => {
  const [roadData, setRoadData] = useState<RoadData>({
    segments: [],
    lastDirection: new Vector3(),
  });

  const createSegment = (previousEndPoint?: Vector3, previousDirection?: Vector3, lastSegment = false) => {
    const segment = generateRoadSegment(previousEndPoint, previousDirection);
    
    return segment;
  };

  useEffect(() => {
    const firstSegment = createSegment();
    const secondSegment = createSegment(firstSegment.points[3], firstSegment.endDirection);
    const thirdSegment = createSegment(secondSegment.points[3], secondSegment.endDirection, true);
    setRoadData({
      segments: [firstSegment, secondSegment, thirdSegment],
      lastDirection: thirdSegment.endDirection
    });
  }, []);

  return (
    <Canvas className={styles.canvas}>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />

      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color={"orange"} />
      </mesh>

      <RoadContructor segments={roadData.segments} />

      <OrbitControls 
        enableZoom={true}
        enablePan={true}
        enableRotate={true}
        minDistance={2}
        maxDistance={50}
      />
    </Canvas>
  );
};

export default Scene;
