import React, { useRef } from "react";
import { Extrude } from "@react-three/drei";
import { Shape, Vector3, Mesh } from "three";
import { useFrame } from "@react-three/fiber";
import { config, getHexagonShape } from "@/components/drive/utils";

const color = "#F48E20";
const glow = config.gate.glow;

interface GateShapeProps {
    position: Vector3;
    shapeType: string;
}

const GateShape = ({ position, shapeType }: GateShapeProps) => {
  const meshRef = useRef<Mesh>(null);
  const size = 0.08;
    
  // Create a hexagon shape (2D)
  const shape = getHexagonShape(size);

  return (
    <mesh ref={meshRef} position={position}>
      <Extrude 
        args={[shape, { 
          depth: 0.02, 
          bevelEnabled: true,
          bevelSize: 0.02,
          bevelSegments: 5,
          bevelThickness: 0.02
        }]}>
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={glow} />
      </Extrude>
    </mesh>
  );
};

export default GateShape;