import React, { useRef, useEffect } from "react";
import { Vector3, CubicBezierCurve3 } from "three";
import Gate from "@/components/drive/road/Gate";
import { Segment } from "@/components/drive/utils";

interface GateSegmentProps {
  curve: CubicBezierCurve3
  segment: Segment
}

export const GateSegment = ({ curve, segment }: GateSegmentProps) => {
  // Calculate positions along the curve
  const oneThird = curve.getPoint(1 / 3);
  const twoThirds = curve.getPoint(2 / 3);
  const end = curve.getPoint(1);

  // Calculate tangents at each point on the curve
  const tangentOneThird = curve.getTangent(1 / 3).normalize();
  const tangentTwoThirds = curve.getTangent(2 / 3).normalize();
  const tangentEnd = curve.getTangent(1).normalize();

  // Helper function to convert tangent to rotation angles
  const getRotation = (tangent: Vector3): Vector3 => {
    const up = new Vector3(0, 0, 1); // World up vector
    const axis = new Vector3().crossVectors(up, tangent).normalize();
    const angle = Math.acos(up.dot(tangent));
    
    return new Vector3(axis.x, axis.y, axis.z).multiplyScalar(angle);
  };    
  
  const mirrorArray = segment.questions?.map((question) => question.isMirror) || [false, false, false];

  // Render gates at 1/3, 2/3, and end of the curve
  return (
    <group>
      <Gate index={0} isMirror={mirrorArray[0]} position={oneThird} rotation={getRotation(tangentOneThird)} />
      <Gate index={1} isMirror={mirrorArray[1]} position={twoThirds} rotation={getRotation(tangentTwoThirds)} />
      <Gate index={2} isMirror={mirrorArray[2]} position={end} rotation={getRotation(tangentEnd)} />
    </group>
  );
};

