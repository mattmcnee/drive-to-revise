import { Vector3 } from "three";

export type Segment = {
  points: Vector3[];
  endDirection?: Vector3;
};

export type RoadData = {
  segments: Segment[];
  lastDirection: Vector3;
  passedSegments: number;
};

export const config = {
  road: {
    width: 0.5,
    height: 0.001
  },
  segmentDetail: 200
};

export function generateRoadSegment(previousEndPoint?: Vector3, previousDirection?: Vector3) {
  const controlPoints: Vector3[] = [];
  const startPoint = previousEndPoint || new Vector3(0, 0, 0);
  const prevDir = previousDirection || new Vector3(0, 0, -1);

  let currentDirection = prevDir.clone();
  controlPoints.push(startPoint.clone());

  // First two control points are based on the previous segment's direction for C2 continuity
  controlPoints.push(startPoint.clone().add(currentDirection.clone().multiplyScalar(2)));

  // Add randomness to the tangent for curve generation
  const randomOffset = (Math.random() - 0.5) * Math.PI * 0.5; // Offset for randomness
  const curveDirection = currentDirection.clone().applyAxisAngle(new Vector3(0, 1, 0), randomOffset).normalize();

  // Calculate the endpoint with a random distance along the curve
  const randomDistance = Math.random() * 2 + 8;
  const endPoint = controlPoints[1].clone().add(curveDirection.multiplyScalar(randomDistance));
  controlPoints.push(endPoint);

  // Final control point ensuring a smooth curve
  const lastDirection = curveDirection.clone().applyAxisAngle(new Vector3(0, 1, 0), randomOffset);
  controlPoints.push(endPoint.clone().add(lastDirection.multiplyScalar(3)));

  return {
    points: controlPoints,
    endDirection: lastDirection
  };
}