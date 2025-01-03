import React, { useRef, useEffect } from "react";
import { Vector3, Group, CubicBezierCurve3 } from "three";
import { config } from "@/components/drive/utils";
import { useGLTF } from "@react-three/drei";

interface TreeSegmentProps {
    curve: CubicBezierCurve3;
    index: number;
}

export const TreeSegment = ({ curve, index }: TreeSegmentProps) => {
  const treesRef = useRef<Group | null>(null);
  const { scene } = useGLTF("/models/simple_tree/scene.gltf");

  useEffect(() => {
    if (!treesRef.current) return;

    // Default to 50 trees and clear existing trees
    const treeCount = config.tree.count || 50;
    const treeGroup = treesRef.current;
    treeGroup.clear();

    // Generate trees along the curve
    for (let i = 0; i < treeCount; i++) {
      const t = i / treeCount;
      const positionOnCurve = curve.getPoint(t);
      const direction = curve.getTangent(t).normalize();
      const perpendicular = new Vector3(-direction.z, 0, direction.x);

      // Use Math.random() for random values
      const offsetDistance =
        Math.random() * (config.tree.maxOffset - config.tree.minOffset) + config.tree.minOffset;
      const offsetMultiplier = Math.random() > 0.5 ? 1 : -1;
      const offset = perpendicular.clone().multiplyScalar(offsetDistance * offsetMultiplier);
      const treePosition = new Vector3().addVectors(positionOnCurve, offset);

      // Random rotation and height based on config
      const scale = Math.random() * (config.tree.maxHeight - config.tree.minHeight) + config.tree.minHeight;
      const rotation = Math.random() * Math.PI * 2;

      // Clone the imported tree model, apply properties and add to the group
      const treeInstance = scene.clone();
      treeInstance.scale.setScalar(scale);
      treeInstance.position.set(treePosition.x, treePosition.y, treePosition.z);
      treeInstance.rotation.y = rotation;
      treeGroup.add(treeInstance);

    }
  }, [curve, index, scene]);

  return <group ref={treesRef} />;
};


