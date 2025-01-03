import React, { useRef, useEffect } from "react";
import { Mesh, BufferGeometry, CubicBezierCurve3, Vector3, MeshStandardMaterial, Float32BufferAttribute } from "three";
import { config } from "@/components/drive/utils";

interface CurbSegmentProps {
    curve: CubicBezierCurve3
    isLeft: boolean
}

export const CurbSegment = ({ curve, isLeft }: CurbSegmentProps) => {
  const curbRef = useRef<Mesh<BufferGeometry, any> | null>(null);

  useEffect(() => {
    if (!curbRef.current) return;

    const curbGeometry = new BufferGeometry();
    const curbVertices: number[] = [];
    const curbIndices: number[] = [];

    for (let i = 0; i < config.segmentDetail; i++) {
      const t = i / (config.segmentDetail - 1);
      const point = curve.getPoint(t);
      const direction = curve.getTangent(t).normalize();
      const perpendicular = new Vector3(-direction.z, 0, direction.x);
      const sign = isLeft ? 1 : -1;

      const offsetXZ = config.road.width;
      const offsetY = config.road.height;
      const offsetCurbXZ = config.road.width + config.curb.width;
      const offsetCurbY = config.road.height + config.curb.rise;

      // Define the curb points with their respective width and height
      const curbPointsData = [
        { width: offsetXZ, height: offsetY },
        { width: offsetXZ, height: offsetCurbY },
        { width: offsetCurbXZ, height: offsetCurbY },
        { width: offsetCurbXZ, height: offsetCurbY - config.curb.drop }
      ];

      // Map the curb points data to Vector3 objects
      const curbPoints = curbPointsData.map(({ width, height }) => {
        const x = point.x + sign * perpendicular.x * width;
        const y = height;
        const z = point.z + sign * perpendicular.z * width;
        
        return new Vector3(x, y, z);
      });

      curbPoints.forEach(({ x, y, z }) => {
        curbVertices.push(x, y, z);
      });

      if (i < config.segmentDetail - 1) {
        const curbBaseIndex = i * 4;
        curbIndices.push(
          curbBaseIndex, curbBaseIndex + 1, curbBaseIndex + 4,
          curbBaseIndex + 1, curbBaseIndex + 5, curbBaseIndex + 4,
          curbBaseIndex + 1, curbBaseIndex + 2, curbBaseIndex + 5,
          curbBaseIndex + 2, curbBaseIndex + 6, curbBaseIndex + 5,
          curbBaseIndex + 2, curbBaseIndex + 3, curbBaseIndex + 6,
          curbBaseIndex + 3, curbBaseIndex + 7, curbBaseIndex + 6
        );
      }
    }

    curbGeometry.setAttribute("position", new Float32BufferAttribute(curbVertices, 3));
    curbGeometry.setIndex(curbIndices);
    curbGeometry.computeVertexNormals();

    curbRef.current.geometry = curbGeometry;
    curbRef.current.material = new MeshStandardMaterial({
      color: "lightgray",
      side: 2
    });
  }, [curve, isLeft]);

  return <mesh ref={curbRef} />;
};