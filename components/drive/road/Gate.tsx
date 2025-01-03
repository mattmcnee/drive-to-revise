import React, { useRef, useEffect } from "react";
import { Vector3, Group } from "three";
import { config } from "@/components/drive/utils";
import GateShape from "@/components/drive/road/GateShape";

interface GateProps {
  position: Vector3
  rotation: Vector3
  index: number
  isMirror: boolean
}

const Gate = ({ index, position, rotation, isMirror }: GateProps) => {
  const gateGroup = useRef<Group>(null);

  useEffect(() => {
    if (gateGroup.current) {
      gateGroup.current.position.copy(position);
      gateGroup.current.rotation.set(rotation.x, rotation.y, rotation.z);
    }
  }, [position, rotation]);

  let shapes;
  switch (index) {
  case 0:
    shapes = ["hexagon", "triangle"];
    break;
  case 1:
    shapes = ["square", "circle"];
    break;
  case 2:
    shapes = ["pentagon", "diamond"];
    break;
  default:
    shapes = ["hexagon", "triangle"];
    break;
  }

  if (!isMirror) {
    shapes = shapes.reverse();
  }

  return (
    <group ref={gateGroup}>
      <GateShape position={new Vector3(-0.27, 0.2, 0)} shapeType={shapes[0]} />
      <GateShape position={new Vector3(0.27, 0.2, 0)} shapeType={shapes[1]}/>
    </group>
  );
};

export default Gate;
