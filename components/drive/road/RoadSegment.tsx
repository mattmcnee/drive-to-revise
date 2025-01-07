import React, { useRef, useEffect } from "react";
import { CubicBezierCurve3, Vector3, Mesh, BufferGeometry, MeshStandardMaterial, Float32BufferAttribute } from "three";
import { config } from "@/components/drive/utils";

interface RoadSegmentProps {
  curve: CubicBezierCurve3;
}

const RoadSegment = ({ curve }: RoadSegmentProps) => {
  const roadRef = useRef<Mesh<BufferGeometry> | null>(null);

  useEffect(() => {
    if (!roadRef.current) return;

    // Create a new geometry to hold the road segment
    const roadGeometry = new BufferGeometry();
    const roadVertices: number[] = [];
    const indices: number[] = [];

    for (let i = 0; i < config.segmentDetail; i++) {
      const t = i / (config.segmentDetail - 1);
      const point = curve.getPoint(t);
      const direction = curve.getTangent(t).normalize();
      const perpendicular = new Vector3(-direction.z, 0, direction.x);

      // Define the road offsets
      const offsetX = perpendicular.x * config.road.width;
      const offsetY = config.road.height;
      const offsetZ = perpendicular.z * config.road.width;
         
      // Add 2 vertices to create a rectangle for this road segment
      roadVertices.push(
        point.x + offsetX, point.y + offsetY, point.z + offsetZ,
        point.x - offsetX, point.y + offsetY, point.z - offsetZ
      );

      if (i < config.segmentDetail - 1) {
        const baseIndex = i * 2;
        indices.push(
          baseIndex, baseIndex + 1, baseIndex + 2,
          baseIndex + 1, baseIndex + 3, baseIndex + 2
        );
      }
    }

    // Set the road geometry attributes and compute normals
    roadGeometry.setAttribute("position", new Float32BufferAttribute(roadVertices, 3));
    roadGeometry.setIndex(indices);
    roadGeometry.computeVertexNormals();

    roadRef.current.geometry = roadGeometry;
    roadRef.current.material = new MeshStandardMaterial({
      color: "gray",
      side: 2
    });
  }, [curve]);

  return <mesh ref={roadRef} />;
};

export default RoadSegment;
