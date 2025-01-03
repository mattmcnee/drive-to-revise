import { Vector3, Shape } from "three";

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
  curb: {
    rise: 0.01,
    width: 0.03,
    drop: 0.02
  },
  line: {
    width: 0.01,
    dash: 1,
    gap: 0.8
  },
  gate: {
    height: 0.7,
    width: 0.515,
    pole: 0.03,
    glow: 0.5
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

export const getHexagonShape = (size: number) => {
    const hexagonShape = new Shape();
    for (let i = 0; i < 6; i++) {
      const angle = (i * Math.PI) / 3;
      const x = size * Math.cos(angle);
      const y = size * Math.sin(angle);
      if (i === 0) {
        hexagonShape.moveTo(x, y);
      } else {
        hexagonShape.lineTo(x, y);
      }
    }
    hexagonShape.closePath();

    return hexagonShape;
}