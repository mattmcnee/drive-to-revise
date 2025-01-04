import Image from "next/image";
import backIcon from "@/public/icons/back.svg";
import forwardIcon from "@/public/icons/forward.svg";
import addIcon from "@/public/icons/add-white.svg";
import { PrimaryIconButton, SecondaryIconButton } from "@/components/ui/Buttons";


interface ButtonProps {
    handlePrevious: () => void;
    handleNext: () => void;
    addItem: () => void;
    currentSlide: number;
    documentsLength: number;
}

export const LeftButton = ({ handlePrevious }: ButtonProps) => (
  <SecondaryIconButton onClick={handlePrevious}>
    <Image src={backIcon} alt="Previous"/>
  </SecondaryIconButton>
);

export const RightButton = ({ handleNext, addItem, currentSlide, documentsLength }: ButtonProps) => (
  (currentSlide === documentsLength - 1 && documentsLength < 12) ? (
    <PrimaryIconButton onClick={addItem}>
      <Image src={addIcon} alt="Add" />
    </PrimaryIconButton>
  ) : (
    <SecondaryIconButton onClick={handleNext}>
      <Image src={forwardIcon} alt="Next" />
    </SecondaryIconButton>
  )
);