import React, { useRef, useEffect } from "react";
import {
  Mesh,
  BufferGeometry,
  CubicBezierCurve3,
  Vector3,
  MeshStandardMaterial,
  Float32BufferAttribute,
} from "three";

import { config } from "@/components/drive/utils";

interface LineSegmentProps {
    curve: CubicBezierCurve3;
}

// A series of rectangular segments positioned along the curve
export const LineSegment = ({ curve }: LineSegmentProps) => {
  const lineRef = useRef<Mesh<BufferGeometry> | null>(null);

  useEffect(() => {
    if (!lineRef.current) return;

    // Create a new geometry to hold the line segments
    const lineGeometry = new BufferGeometry();
    const lineVertices: number[] = [];
    const indices: number[] = [];

    // Dash sizing configuration
    const dashLength = config.line.dash;
    const gapLength = config.line.gap;
    const totalLength = curve.getLength();
    const segmentCount = Math.ceil(totalLength / (dashLength + gapLength));
    const lineWidth = config.line.width;

    let vertexIndex = 0; 

    for (let i = 0; i < segmentCount; i++) {
      // Calculate start and end points of the dash as a percentage along the curve
      const dashStart = (i * (dashLength + gapLength)) / totalLength;
      const dashEnd = Math.min((i * (dashLength + gapLength) + dashLength) / totalLength, 1);

      // Stop if we've exceeded the curve length
      if (dashStart >= 1) break;

      // Get actual 3D points for the start and end of this dash
      const startPoint = curve.getPointAt(dashStart);
      const endPoint = curve.getPointAt(dashEnd);

      // Calculate perpendicular vector to create width of the line
      const direction = curve.getTangentAt(dashStart).normalize();
      const perpendicular = new Vector3(-direction.z, 0, direction.x);

      // Calculate offsets for the width of the line
      const offsetX = perpendicular.x * lineWidth;
      const offsetY = config.road.height + 0.001;
      const offsetZ = perpendicular.z * lineWidth;

      // Add 4 vertices to create a rectangle for this dash segment          
      lineVertices.push(
        startPoint.x + offsetX, startPoint.y + offsetY, startPoint.z + offsetZ,
        startPoint.x - offsetX, startPoint.y + offsetY, startPoint.z - offsetZ,
        endPoint.x + offsetX, endPoint.y + offsetY, endPoint.z + offsetZ,
        endPoint.x - offsetX, endPoint.y + offsetY, endPoint.z - offsetZ
      );

      // Define two trinagles based on the 4 rectangle vertices
      indices.push(
        vertexIndex, vertexIndex + 1, vertexIndex + 2,
        vertexIndex + 1, vertexIndex + 3, vertexIndex + 2
      );

      // Increment the vertex index by 4 (as we added 4 vertices for this dash)
      vertexIndex += 4;
    }

    // Set up the geometry with vertices and faces
    lineGeometry.setAttribute("position", new Float32BufferAttribute(lineVertices, 3));
    lineGeometry.setIndex(indices);
    lineGeometry.computeVertexNormals();

    // Apply the geometry to the mesh and set up material
    lineRef.current.geometry = lineGeometry;
    lineRef.current.material = new MeshStandardMaterial({
      color: "white",
      emissive: "white",
      emissiveIntensity: 1,
      side: 2,
    });
  }, [curve]);

  return <mesh ref={lineRef} />;
};
