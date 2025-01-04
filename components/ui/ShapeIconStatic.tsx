import React from "react";

import circleIcon from "@/public/icons/shapes/circle.svg";
import squareIcon from "@/public/icons/shapes/square.svg";
import triangleIcon from "@/public/icons/shapes/triangle.svg";
import diamondIcon from "@/public/icons/shapes/diamond.svg";
import pentagonIcon from "@/public/icons/shapes/pentagon.svg";
import hexagonIcon from "@/public/icons/shapes/hexagon.svg";
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