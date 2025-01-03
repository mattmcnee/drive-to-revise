import React, { useMemo } from "react";
import { CubicBezierCurve3 } from "three";
import RoadSegment from "@/components/drive/road/RoadSegment";
import { Segment } from "@/components/drive/utils";
import { CurbSegment } from "./CurbSegment";
import { LineSegment } from "./LineSegment";
import { GateSegment } from "./GateSegment";
import { TreeSegment } from "./TreeSegment";

const RoadContructor = React.memo(({ segments }: { segments: Segment[] }) => {
  return (
    <group>
      {segments.map((segment, index) => {
        const curve = useMemo(() => {
          return new CubicBezierCurve3(
            segment.points[0],
            segment.points[1],
            segment.points[2],
            segment.points[3]
          );
        }, [segment.points]);

        return (
          <React.Fragment key={index}>
            <RoadSegment curve={curve} />
            <CurbSegment curve={curve} isLeft={true} />
            <CurbSegment curve={curve} isLeft={false} />
            <LineSegment curve={curve} />
            <TreeSegment curve={curve} index={index} />
            {segment.hasGates && <GateSegment curve={curve} segment={segment} />}
          </React.Fragment>
        );
      })}
    </group>
  );
});

export default RoadContructor;
