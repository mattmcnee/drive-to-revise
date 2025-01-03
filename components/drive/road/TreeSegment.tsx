import React, { useRef, useEffect } from "react";
import { Vector3, Group, CubicBezierCurve3 } from "three";
import { config } from "@/components/drive/utils";
import { useGLTF } from "@react-three/drei";
import seedrandom from "seedrandom";

interface TreeSegmentProps {
    curve: CubicBezierCurve3;
    index: number;
}

export const TreeSegment = ({ curve, index }: TreeSegmentProps) => {
  const treesRef = useRef<Group | null>(null);
  const { scene } = useGLTF("/models/simple_tree/scene.gltf");

  useEffect(() => {
    if (!treesRef.current) return;

    // Random seed from the last two digits of point 0's x value
    // We do this so that an update to segments doesn't change the trees
    const seed = parseInt(curve.getPoint(0).x.toFixed(2).slice(-2));
    const rng = seedrandom(seed.toString());

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

      // Use seeded random to generate position
      const offsetDistance =
                rng() * (config.tree.maxOffset - config.tree.minOffset) + config.tree.minOffset;
      const offsetMultiplier = rng() > 0.5 ? 1 : -1;
      const offset = perpendicular.clone().multiplyScalar(offsetDistance * offsetMultiplier);
      const treePosition = new Vector3().addVectors(positionOnCurve, offset);

      // Seeded random rotation and height based on config
      const scale = rng() * (config.tree.maxHeight - config.tree.minHeight) + config.tree.minHeight;
      const rotation = rng() * Math.PI * 2;

      // Clone the imported tree model, apply properties and add to the group
      const treeInstance = scene.clone();
      treeInstance.scale.setScalar(scale);
      treeInstance.position.set(treePosition.x, treePosition.y, treePosition.z);
      treeInstance.rotation.y = rotation;
      treeGroup.add(treeInstance);

      // These trees are rendering for the first time
      if (index === 2) {
        treeInstance.scale.setScalar(0);

        // Grow new trees over 8 seconds
        const growAnimation = () => {
          const startTime = performance.now();
          const duration = 8000;

          const animate = (time: number) => {
            const elapsed = time - startTime;
            const progress = Math.min(elapsed / duration, 1);
            treeInstance.scale.setScalar(scale * progress);
            if (progress < 1) {
              requestAnimationFrame(animate);
            }
          };
          requestAnimationFrame(animate);
        };
        growAnimation();
      }
    }
  }, [curve, index, scene]);

  return <group ref={treesRef} />;
};


