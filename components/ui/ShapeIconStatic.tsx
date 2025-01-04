import React from "react";

import circleIcon from "@/public/circle.svg";
import squareIcon from "@/public/square.svg";
import triangleIcon from "@/public/triangle.svg";
import diamondIcon from "@/public/diamond.svg";
import pentagonIcon from "@/public/pentagon.svg";
import hexagonIcon from "@/public/hexagon.svg";
import Image from "next/image";

interface ShapeIconStaticProps {
    shape: string;
    size: number;
}

const ShapeIconStatic = ({ shape, size }: ShapeIconStaticProps) => {
  const iconMap: { [key: string]: any } = {
    circle: circleIcon,
    square: squareIcon,
    triangle: triangleIcon,
    diamond: diamondIcon,
    pentagon: pentagonIcon,
    hexagon: hexagonIcon,
  };

  const icon = iconMap[shape];

  if (!icon) {
    return null;
  }

  return <Image src={icon} alt={`${shape} icon`} width={size} height={size} />;
};

export default ShapeIconStatic;