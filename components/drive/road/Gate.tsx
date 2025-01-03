import React, { useRef, useEffect } from "react";
import { Vector3, Group } from "three";
import { config } from "@/components/drive/utils";
import GateShape from "@/components/drive/road/GateShape";

interface GateProps {
    position: Vector3
    rotation: Vector3
}

const Gate = ({ position, rotation }: GateProps) => {
  const gateGroup = useRef<Group>(null);

  useEffect(() => {
    if (gateGroup.current) {
      gateGroup.current.position.copy(position);
      gateGroup.current.rotation.set(rotation.x, rotation.y, rotation.z);
    }
  }, [position, rotation]);

  return (
    <group ref={gateGroup}>
      <GateShape position={new Vector3(-0.27, 0.2, 0)} />
      <GateShape position={new Vector3(0.27, 0.2, 0)} />
    </group>
  );
};

export default Gate;
