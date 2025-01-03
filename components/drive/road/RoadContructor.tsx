import React from "react";
import { CubicBezierCurve3 } from "three";
import RoadSegment from "@/components/drive/road/RoadSegment";
import { Segment } from "@/components/drive/utils";
import { CurbSegment } from "./CurbSegment";
import { LineSegment } from "./LineSegment";

export const RoadContructor = ({ segments }: { segments: Segment[] }) => {
  console.log(segments);
  
  return (
    <group>
      {segments.map((segment, index) => {
        const curve = new CubicBezierCurve3(
          segment.points[0],
          segment.points[1],
          segment.points[2],
          segment.points[3]
        );

        return (
          <React.Fragment key={index}>
            <RoadSegment curve={curve} />
            <CurbSegment curve={curve} isLeft={true} />
            <CurbSegment curve={curve} isLeft={false} />
            <LineSegment curve={curve} />
          </React.Fragment>
        );
      })}
    </group>
  );
};

export default RoadContructor;