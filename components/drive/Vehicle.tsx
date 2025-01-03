import React, { useState, useRef, useEffect } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import { Mesh, Vector3, CubicBezierCurve3 } from "three";
import { RoadData, Segment, getSidewaysRotation } from "./utils";

interface VehicleProps {
  roadData: RoadData,
  removePassedSegment: () => void,
  addRoadSegment: () => void,
  accelerate?: boolean,
  checkQuestion: (questionIndex: number, segmentIndex: number, currentOffset: number) => void,
  maxSpeed?: number
}

const Vehicle = ({
  roadData,
  removePassedSegment,
  addRoadSegment,
  accelerate = false,
  checkQuestion,
  maxSpeed = 8
}: VehicleProps) => {

  const floorRef = useRef<Mesh>(null);
  const vehicleRef = useRef<Mesh>(null);

  // Tracks position along road
  const [progress, setProgress] = useState(1);
  const [currentSegmentIndex, setCurrentSegmentIndex] = useState(1);
  const lastTime = useRef(performance.now());


  const { camera } = useThree();

  // Manages left and right lane changes
  const roadEdge = 2.7;
  const offsetAcceleration = 0.9;
  const targetOffset = useRef(-roadEdge);
  const currentOffset = useRef(-roadEdge);

  // Manages vehicle speed
  const speedAcceleration = 0.3;
  const speedDeceleration = 1.2;
  const targetSpeed = useRef(0);
  const currentSpeed = useRef(0);

  if (accelerate) {
    targetSpeed.current = maxSpeed;
  } else {
    targetSpeed.current = 0;
  }

  useEffect(() => {
    const moveVehicleLeft = (isLeft: boolean) => {
      if (targetSpeed.current > 0) {
        targetOffset.current = isLeft ? -roadEdge : roadEdge;
      }
    };

    // Keyboard via arrows or 'wasd'
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowLeft" || event.key.toLowerCase() === "a") {
        moveVehicleLeft(true);
      } else if (event.key === "ArrowRight" || event.key.toLowerCase() === "d") {
        moveVehicleLeft(false);
      }
    };

    // Touch events for swiping
    let touchStartX: number | null = null;
        
    const handleTouchStart = (event: TouchEvent) => {
      touchStartX = event.touches[0].clientX;
    };

    const handleTouchEnd = (event: TouchEvent) => {
      if (touchStartX === null) return;

      const touchEndX = event.changedTouches[0].clientX;
      const deltaX = touchEndX - touchStartX;
      touchStartX = null;

      if (deltaX > 50) { // Right swipe
        moveVehicleLeft(false);
      } else if (deltaX < -50) { // Left swipe 
        moveVehicleLeft(true);
      }   
    };
    
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("touchstart", handleTouchStart);
    window.addEventListener("touchend", handleTouchEnd);
    
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchend", handleTouchEnd);
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

      // Move the floor to the vehicle position and rotation
      if (floorRef.current) {
        floorRef.current.position.copy(vehicleRef.current.position.clone().setY(0));
        floorRef.current.rotation.copy(vehicleRef.current.rotation);
        floorRef.current.rotateX(-Math.PI / 2);
        floorRef.current.translateY(-86);
      }

      // Update camera position and rotation to follow the vehicle if attached
      const offset = new Vector3(0, 0.3, -0.6).applyQuaternion(vehicleRef.current.quaternion);
      camera.position.copy(vehicleRef.current.position.clone().add(offset));
      camera.lookAt(vehicleRef.current.position);

      // roadEdge
      const sideways = targetOffset.current - currentOffset.current;
      if (sideways > 0) {
        vehicleRef.current.rotation.y -= getSidewaysRotation(sideways, roadEdge);
      } else if (sideways < 0) {
        vehicleRef.current.rotation.y += getSidewaysRotation(sideways, roadEdge);
      }

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

  const { scene } = useGLTF("/models/muscle_car/scene.gltf");
  const scale = 0.06;

  return (
    <>
      {/* <mesh ref={vehicleRef}  position={[0, 0.1, 0]}>
        <boxGeometry args={[0.3, 0.2, 0.6]} />
        <meshStandardMaterial color="red" />
      </mesh> */}
      
      <primitive ref={vehicleRef} object={scene} position={[0, 0.1, 0]} scale={[scale, scale, scale]} />
           
      <mesh ref={floorRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
        <planeGeometry args={[200, 200]} />
        <meshStandardMaterial color="green" />
      </mesh>
    </>
  );
};

export default Vehicle;