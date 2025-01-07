import { Vector3, Shape, Matrix4 } from "three";
import { RoadData, Segment, Question } from "@/types/index.types";

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
  tree:{
    maxOffset: 50,
    minOffset: 2,
    maxHeight: 0.7,
    minHeight: 0.3,
    maxRadius: 0.1,
    minRadius: 0.05,
    count: 100
  },
  segmentDetail: 200
};

// Generate a new road segment with random curves
export const generateRoadSegment = (previousEndPoint?: Vector3, previousDirection?: Vector3, hasGates = false): Segment => {
  const controlPoints: Vector3[] = [];

  // Start point is the previous end point or origin
  // Start direction is the previous direction or negative z-axis
  const startPoint = previousEndPoint || new Vector3(0, 0, 0);
  const prevDir = previousDirection || new Vector3(0, 0, -1);

  // First two control points are based on the previous segment's direction for C2 continuity
  let currentDirection = prevDir.clone();
  controlPoints.push(startPoint.clone());
  controlPoints.push(startPoint.clone().add(currentDirection.clone().multiplyScalar(2)));

  // Add randomness to the tangent for curve generation
  const randomOffset = (Math.random() - 0.5) * Math.PI * 0.5;
  const curveDirection = currentDirection.clone().applyAxisAngle(new Vector3(0, 1, 0), randomOffset).normalize();

  // Third control point is the second control point with a random offset
  const randomDistance = Math.random() * 2 + 8;
  const thirdControlPoint = controlPoints[1].clone().add(curveDirection.multiplyScalar(randomDistance));
  controlPoints.push(thirdControlPoint);

  // Last control point is the third control point with a random offset direction
  const lastDirection = curveDirection.clone().applyAxisAngle(new Vector3(0, 1, 0), randomOffset);
  controlPoints.push(thirdControlPoint.clone().add(lastDirection.multiplyScalar(3)));

  // Include the last direction in the return so the next segment can use it
  return {
    points: controlPoints,
    endDirection: lastDirection,
    hasGates: hasGates,
    questions: []
  };
};

// Create a QuestionUi object from a Question object
export const createQuestionUI = (currentQuestion: Question, questionIndex: number) => {
  const newQuestion = {
    question: currentQuestion.question,
    left: { icon: "", text: "" },
    right: { icon: "", text: "" }
  };

  // Set left and right text based on the answerLeft property
  if (currentQuestion.answerLeft) {
    newQuestion.left.text = currentQuestion.answer;
    newQuestion.right.text = currentQuestion.dummy;
  } else {
    newQuestion.left.text = currentQuestion.dummy;
    newQuestion.right.text = currentQuestion.answer;
  }

  // Define icon sets for each question
  const iconSets = [
    { normal: ["hexagon", "triangle"], mirror: ["triangle", "hexagon"] },
    { normal: ["square", "circle"], mirror: ["circle", "square"] },
    { normal: ["pentagon", "diamond"], mirror: ["diamond", "pentagon"] },
  ];

  // Set icons based isMirror property
  if (questionIndex >= 0 && questionIndex < iconSets.length) {
    const icons = currentQuestion.isMirror
      ? iconSets[questionIndex].mirror
      : iconSets[questionIndex].normal;
    newQuestion.left.icon = icons[0];
    newQuestion.right.icon = icons[1];
  }

  return newQuestion;
};

// Keep going to the next segment until a segment with questions is found
// Then return the first question in that segment
export const getNextSegmentsFirstQuestion = (segmentIndex: number, roadData: RoadData) => {
  if (segmentIndex + 1 < roadData.segments.length) {
    const nextSegment = roadData.segments[segmentIndex + 1];
    if (!nextSegment.hasGates) {
      getNextSegmentsFirstQuestion(segmentIndex + 1, roadData);
    }
    if (nextSegment.questions) {
      const nextQuestion = nextSegment.questions[0];
      if (nextQuestion) {
        return createQuestionUI(nextQuestion, 0);
      }
    }
  }
  
  return null;
};

// Gets the next question to display
// Either the next in the current segment or the first question in the next segment
export const getNextQuestion = (questionIndex: number, segmentIndex: number, roadData: RoadData) => {
  const currentQuestions = roadData.segments[segmentIndex].questions;
  if (currentQuestions && questionIndex + 1 < currentQuestions.length) {
    const nextQuestion = currentQuestions[questionIndex + 1];
    if (nextQuestion) {
      return createQuestionUI(nextQuestion, questionIndex + 1);
    }
  } else {
    return getNextSegmentsFirstQuestion(segmentIndex, roadData);
  }
};

// Set rotation based on vehicle offset from the center of the road
// The closer to the center, the more rotation is applied
export const getSidewaysRotation = (sideways: number, roadEdge: number) => { 
  let scale = 0;
  if (Math.abs(sideways) <= roadEdge) {
    scale = 0.05 * (Math.abs(sideways) / roadEdge);
  } else if (Math.abs(sideways) <= 2 * roadEdge) {
    scale = 0.05 * (1 - (Math.abs(sideways) - roadEdge) / roadEdge);
  }

  return scale;
};

// To standardise the transformations of all models
// We can combine matrices into a single matrix
// These are the matrices for the muscle_car model

//     [1,  0,   0, 0]      [1, 0, 0, 0]      [0.06, 0, 0, 0]
//     [0,  1,   0, 0]      [0, 1, 0, 0]      [0, 0.06, 0, 0]
// T = [0,  0,   1, 0]  R = [0, 0, 1, 0]  S = [0, 0, 0.06, 0] 
//     [0, 0.08, 0, 1]      [0, 0, 0, 1]      [0,  0,  0,  1]

//             [0.06, 0, 0, 0]
//             [0, 0.06, 0, 0]
// T * R * S = [0, 0, 0.06, 0]
//             [0, 0.08, 0, 1]

export const getModelMatrix = ( modelType:string ): Matrix4 => {
  let rotationMatrix, scaleMatrix, translationMatrix;

  if (modelType === "muscle_car") {
    // Translate by 0, rotate 0deg, and scale by 0.06
    translationMatrix = new Matrix4().makeTranslation(0, 0.08, 0);
    rotationMatrix = new Matrix4().makeRotationY(0);
    scaleMatrix = new Matrix4().makeScale(0.06, 0.06, 0.06);

  } else if (modelType === "old_car") {
    // Translate Y by 0.02, rotate -90deg, and scale by 0.06
    translationMatrix = new Matrix4().makeTranslation(0, 0.1, 0);
    rotationMatrix = new Matrix4().makeRotationY(-Math.PI / 2);
    scaleMatrix = new Matrix4().makeScale(0.06, 0.06, 0.06);

  } else if (modelType === "family_car") {
    // Translate Y by -0.07 and Z by -0.1, rotate 0deg, and scale by 0.11
    translationMatrix = new Matrix4().makeTranslation(0, 0.01, -0.1);
    rotationMatrix = new Matrix4().makeRotationY(0);
    scaleMatrix = new Matrix4().makeScale(0.13, 0.13, 0.13);

  } else {
    // Default to identity matrix
    translationMatrix = new Matrix4();
    rotationMatrix = new Matrix4();
    scaleMatrix = new Matrix4();

  }

  return translationMatrix.multiply(rotationMatrix).multiply(scaleMatrix);
};

// Hexagon path for GateShape component
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

// Circle path for GateShape component
export const getCircleShape = (size: number) => {
  const circleShape = new Shape();
  circleShape.moveTo(0, -size);
  circleShape.absarc(0, 0, size, -Math.PI / 2, Math.PI * 1.5, false);

  return circleShape;
};

// Diamond path for GateShape component
export const getDiamondShape = (size: number) => {
  const diamondShape = new Shape();
  diamondShape.moveTo(0, size);
  diamondShape.lineTo(size / 1.5, 0);
  diamondShape.lineTo(0, -size);
  diamondShape.lineTo(-size / 1.5, 0);
  diamondShape.closePath();

  return diamondShape;
};

// Pentagon path for GateShape component
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

// Square path for GateShape component
export const getSquareShape = (size: number) => {
  const squareShape = new Shape();
  squareShape.moveTo(-size, -size);
  squareShape.lineTo(size, -size);
  squareShape.lineTo(size, size);
  squareShape.lineTo(-size, size);
  squareShape.closePath();

  return squareShape;
};

// Triangle path for GateShape component
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



