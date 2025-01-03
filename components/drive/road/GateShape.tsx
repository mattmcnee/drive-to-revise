import React, { useRef } from "react";
import { Extrude } from "@react-three/drei";
import { Shape, Vector3, Mesh } from "three";
import { useFrame } from "@react-three/fiber";
import { config } from "@/components/drive/utils";

const color = "#F48E20";
const glow = config.gate.glow;

interface HexagonProps {
    position: Vector3;
}

const GateShape = ({ position }: HexagonProps) => {
  const meshRef = useRef<Mesh>(null);
  const size = 0.08;
    
  // Create a hexagon shape (2D)
  const hexagonShape = new Shape();
  for (let i = 0; i < 6; i++) {
    const angle = (i * Math.PI) / 3;
    const x = size * Math.cos(angle);
    const y = size * Math.sin(angle);
    if (i === 0) {
      hexagonShape.moveTo(x, y);
    } else {
      hexagonShape.lineTo(x, y);
    }
  }
  hexagonShape.closePath();

  return (
    <mesh ref={meshRef} position={position}>
      <Extrude 
        args={[hexagonShape, { 
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