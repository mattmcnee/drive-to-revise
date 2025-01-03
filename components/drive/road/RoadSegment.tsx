import React, { useRef, useEffect } from "react";
import { Line } from "@react-three/drei";
import { CubicBezierCurve3, Vector3 } from "three";

interface RoadSegmentProps {
  curve: CubicBezierCurve3;
}

const RoadSegment = ({ curve }: RoadSegmentProps) => {
  const points: Vector3[] = [];

  // Generate points along the curve
  for (let i = 0; i <= 100; i++) {
    const t = i / 100;
    points.push(curve.getPoint(t));
  }

  return (
    <Line
      points={points}
      color="grey"
      lineWidth={1}
    />
  );
};

export default RoadSegment;
