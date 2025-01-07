import React, { useRef } from "react";
import { Extrude } from "@react-three/drei";
import { Vector3, Mesh } from "three";
import { 
  config, 
  getHexagonShape, 
  getCircleShape, 
  getDiamondShape,
  getSquareShape,
  getTriangleShape,
  getPentagonShape
} from "@/components/drive/utils";

interface GateShapeProps {
    position: Vector3;
    shapeType: string;
}

const GateShape = ({ position, shapeType }: GateShapeProps) => {
  const meshRef = useRef<Mesh>(null);
  const glow = config.gate.glow;

  let shape, color, size;
  let offset = 0;
  switch (shapeType) {
  case "hexagon":
    size = 0.08;
    color = "#F48E20";
    shape = getHexagonShape(size);
    break;
  case "circle":
    size = 0.07;
    color = "#43F420";
    shape = getCircleShape(size);
    break;
  case "diamond":
    size = 0.08;
    color = "#F4F420";
    shape = getDiamondShape(size);
    break;
  case "square":
    size = 0.06;
    color = "#F42020";
    shape = getSquareShape(size);
    break;
  case "triangle":
    size = 0.085;
    offset = -0.02;
    color = "#2E20F4";
    shape = getTriangleShape(size);
    break;
  case "pentagon":
    size = 0.08;
    color = "#9820F4";
    shape = getPentagonShape(size);
    break;
  default:
    size = 0.08;
    color = "#F48E20";
    shape = getHexagonShape(size);
    break;
  }
    
  return (
    <mesh ref={meshRef} position={[position.x, position.y + offset, position.z]}>
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