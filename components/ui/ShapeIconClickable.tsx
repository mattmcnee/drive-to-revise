import React from "react";

import circleIcon from "@/public/circle.svg";
import squareIcon from "@/public/square.svg";
import triangleIcon from "@/public/triangle.svg";
import diamondIcon from "@/public/diamond.svg";
import pentagonIcon from "@/public/pentagon.svg";
import hexagonIcon from "@/public/hexagon.svg";
import Image from "next/image";

import styles from "./ShapeIcon.module.scss";

interface ShapeIconClickableProps {
    shape: string;
    setShape: (shape: string) => void;
    size?: number;
}

const ShapeIconClickable = ({ shape, setShape, size = 24 }: ShapeIconClickableProps) => { // Default size is 50
  const iconMap: { [key: string]: any } = {
    circle: circleIcon,
    square: squareIcon,
    triangle: triangleIcon,
    diamond: diamondIcon,
    pentagon: pentagonIcon,
    hexagon: hexagonIcon,
  };

  const shapes = Object.keys(iconMap);

  const handleClick = () => {
    const currentIndex = shapes.indexOf(shape);
    const nextIndex = (currentIndex + 1) % shapes.length;
    setShape(shapes[nextIndex]);
  };

  const icon = iconMap[shape];

  if (!icon) {
    return null;
  }

  return <Image className={styles.clickableShape} src={icon} alt={`${shape} icon`} width={size} height={size} onClick={handleClick} />;
};

export default ShapeIconClickable;