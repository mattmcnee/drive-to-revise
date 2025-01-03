import { Vector3, Shape } from "three";

export type Question = {
  dummy: string;
  answer: string;
  id: number;
  question: string;
  isMirror: boolean;
  answerLeft: boolean;
};

export type Segment = {
  points: Vector3[];
  endDirection?: Vector3;
  hasGates?: boolean;
  questions?: Question[];
};

export type RoadData = {
  segments: Segment[];
  lastDirection: Vector3;
  passedSegments: number;
};

export type GameState = {
  started: boolean;
  questionFailed: Question | null;
  displayedQuestion: Question | null;
  accelerateVehicle: boolean;
}

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

export const generateRoadSegment = (previousEndPoint?: Vector3, previousDirection?: Vector3, hasGates = false): Segment => {
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
    endDirection: lastDirection,
    hasGates: hasGates,
    questions: []
  };
};

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
};

export const getCircleShape = (size: number) => {
  const circleShape = new Shape();
  circleShape.moveTo(0, -size);
  circleShape.absarc(0, 0, size, -Math.PI / 2, Math.PI * 1.5, false);

  return circleShape;
};

export const getDiamondShape = (size: number) => {
  const diamondShape = new Shape();
  diamondShape.moveTo(0, size);
  diamondShape.lineTo(size / 1.5, 0);
  diamondShape.lineTo(0, -size);
  diamondShape.lineTo(-size / 1.5, 0);
  diamondShape.closePath();

  return diamondShape;
};

export const getPentagonShape = (size: number) => {
  const pentagonShape = new Shape();
  for (let i = 0; i < 5; i++) {
    const angle = ((i * 2 * Math.PI) / 5) - Math.PI / 2 - Math.PI;
    const x = size * Math.cos(angle);
    const y = size * Math.sin(angle);
    if (i === 0) {
      pentagonShape.moveTo(x, y);
    } else {
      pentagonShape.lineTo(x, y);
    }
  }
  pentagonShape.closePath();

  return pentagonShape;
};

export const getSquareShape = (size: number) => {
  const squareShape = new Shape();
  squareShape.moveTo(-size, -size);
  squareShape.lineTo(size, -size);
  squareShape.lineTo(size, size);
  squareShape.lineTo(-size, size);
  squareShape.closePath();

  return squareShape;
};

export const getTriangleShape = (size: number) => {
  const triangleShape = new Shape();
  for (let i = 0; i < 3; i++) {
    const angle = (i * (2 * Math.PI)) / 3 + (Math.PI / 6) + Math.PI;
    const x = size * Math.cos(angle);
    const y = size * Math.sin(angle);
    if (i === 0) {
      triangleShape.moveTo(x, y);
    } else {
      triangleShape.lineTo(x, y);
    }
  }
  triangleShape.closePath();

  return triangleShape;
};



