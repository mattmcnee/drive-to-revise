import React, { useState, useRef, useEffect } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import { Mesh, Vector3, CubicBezierCurve3, ObjectLoader } from "three";
import { RoadData, Segment } from "./drive/utils";

interface VehicleProps {
  roadData: RoadData,
  removePassedSegment: () => void,
  addRoadSegment: () => void,
  accelerate?: boolean,
  checkQuestion: (questionIndex: number, segmentIndex: number, currentOffset: number) => void,
}

const Vehicle = ({
  roadData,
  removePassedSegment,
  addRoadSegment,
  accelerate = false,
  checkQuestion,
}: VehicleProps) => {


  const vehicleRef = useRef<Mesh>(null);
  const [progress, setProgress] = useState(1);
  const [currentSegmentIndex, setCurrentSegmentIndex] = useState(1);
  const lastTime = useRef(performance.now());
  const { camera } = useThree();

  // Manages left and right lane changes
  const roadEdge = 2.7;
  const offsetAcceleration = 0.9;
  const targetOffset = useRef(0);
  const currentOffset = useRef(0);

  // Manages vehicle speed
  const speedAcceleration = 0.3;
  const speedDeceleration = 1.2;
  const targetSpeed = useRef(0);
  const currentSpeed = useRef(0);

  if (accelerate) {
    targetSpeed.current = 8;
  } else {
    targetSpeed.current = 0;
  }

  useEffect(() => {
    const moveVehicleLeft = (isLeft: boolean) => {
      targetOffset.current = isLeft ? -roadEdge : roadEdge;
    };

    // Keyboard via arrows or 'wasd'
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowLeft" || event.key.toLowerCase() === "a") {
        moveVehicleLeft(true);
      } else if (event.key === "ArrowRight" || event.key.toLowerCase() === "d") {
        moveVehicleLeft(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const getLengthPointAndTangent = (segment: Segment) => {
    const curve = new CubicBezierCurve3(
      segment.points[0],
      segment.points[1],
      segment.points[2],
      segment.points[3]
    );

    const length = curve.getLength();
    const point = curve.getPoint(progress);
    const tangent = curve.getTangent(progress).normalize();

    return { length, point, tangent };
  };

  const handleGatesPass = (questionIndex: number, segment: Segment, segmentIndex: number) => {
    checkQuestion(questionIndex, segmentIndex, currentOffset.current);
  };
    
  useFrame(() => {
    if (roadData.segments.length > 0 && vehicleRef.current) {
      currentOffset.current += (targetOffset.current - currentOffset.current) * offsetAcceleration * 0.1;
      if (currentSpeed.current > targetSpeed.current) {
        currentSpeed.current = Math.max(currentSpeed.current - speedDeceleration * 0.1, 0);
      } else {
        currentSpeed.current = Math.min(targetSpeed.current, currentSpeed.current + speedAcceleration * 0.1);
      }
      // How much time has passed
      const currentTime = performance.now();
      const deltaTime = (currentTime - lastTime.current) / 1000;
      lastTime.current = currentTime;

      // Calculate the current position and rotation of the vehicle
      const adjustedSegmentIndex = currentSegmentIndex - roadData.passedSegments;
      const currentSegment = roadData.segments[adjustedSegmentIndex];
      const {length, point, tangent} = getLengthPointAndTangent(currentSegment);

      const offsetVector = new Vector3(-tangent.z, 0, tangent.x).multiplyScalar(currentOffset.current * 0.1);
      point.add(offsetVector);

      // Move to point on curve and rotate to front direction
      vehicleRef.current.position.copy(point);
      vehicleRef.current.rotation.y = Math.atan2(tangent.x, tangent.z);

      // Update camera position and rotation to follow the vehicle if attached
      const offset = new Vector3(0, 0.3, -0.6).applyQuaternion(vehicleRef.current.quaternion);
      camera.position.copy(vehicleRef.current.position.clone().add(offset));
      camera.lookAt(vehicleRef.current.position);

      setProgress((prev) => {
        const newProgress = prev + (currentSpeed.current * deltaTime) / length;
        if (newProgress >= 1) {
          handleGatesPass(2, currentSegment, adjustedSegmentIndex);
          if (adjustedSegmentIndex < roadData.segments.length - 1) {
            setCurrentSegmentIndex(currentSegmentIndex + 1);
            addRoadSegment();
            if (currentSegmentIndex > 0) {
              removePassedSegment();
            }
            
            return 0;
          } else {
            alert("Reached the end of the segment!");
            
            return 1;
          }
        } else {
          if (prev < 1 / 3 && newProgress >= 1 / 3) {
            handleGatesPass(0, currentSegment, adjustedSegmentIndex);
          }
          if (prev < 2 / 3 && newProgress >= 2 / 3) {
            handleGatesPass(1, currentSegment, adjustedSegmentIndex);
          }
        }
        
        return newProgress;
      });
    }
  });

  return (
    <>
      <mesh ref={vehicleRef}  position={[0, 0.1, 0]}>
        <boxGeometry args={[0.3, 0.2, 0.6]} />
        <meshStandardMaterial color="red" />
      </mesh>   
    </>
  );
};

export default Vehicle;