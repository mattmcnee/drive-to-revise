import React, { useState, useRef, useEffect } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import styles from "./FileSlider.module.scss";
import DocumentEditor from "./FileEditor";

import { toast } from "react-toastify";
import { useUploadContext } from "@/components/upload/UploadContext";
import { PrimaryButton } from "@/components/ui/Buttons";
import { LeftButton, RightButton } from "./SliderButtons";

const FileSlider = () => {
  const sliderRef = useRef<Slider>(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const { state, dispatch, generateEmbeddings } = useUploadContext();
  const documents = state.documents;

  const settings = {
    dots: false,
    infinite: documents.length > 1, 
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    beforeChange: (currentSlide: number, nextSlide: number) => setCurrentSlide(nextSlide),
  };

  const addItem = () => {
    dispatch({ type: "ADD_DOCUMENT", payload: "" });
    setTimeout(() => {
      if (sliderRef.current) {
        sliderRef.current.slickGoTo(documents.length);
      }
    }, 0);
  };

  // New function to handle document text updates

  const handlePrevious = () => {
    if (sliderRef.current) {
      sliderRef.current.slickPrev();
    }
  };

  const handleNext = () => {
    if (sliderRef.current) {
      sliderRef.current.slickNext();
    }
  };

  const handleSubmit = () => {
    // Filter out empty documents
    const validDocuments = documents.filter(text => text.trim() !== "");
    if (validDocuments.length === 0) {
      toast.warn("No documents with text to submit");
      
      return;
    }
    toast.success(`${validDocuments.length} document${validDocuments.length !== 1 ? "s" : ""} submitted`);
    generateEmbeddings();
  };

  return (
    <div className={styles.embeddingCont}>
      <div className={styles.pageTitle}>
                💡 Separate your documents into paragraphs to help the AI understand it
      </div>
      <div className={styles.sliderOuter}>
        <div className={styles.sliderSideButton}>
          <LeftButton handlePrevious={handlePrevious} handleNext={handleNext} addItem={addItem} currentSlide={currentSlide} documentsLength={documents.length} />
        </div>
        <div className={styles.sliderInner}>
          <Slider ref={sliderRef} {...settings}>
            {documents.map((item, index) => (
              <div key={index} className={styles.sliderItem}>
                <div className={styles.sliderItemContent}>
                  <DocumentEditor 
                    index={index}
                  />
                </div>
              </div>
            ))}
          </Slider>
        </div>
        <div className={styles.sliderSideButton}>
          <RightButton handlePrevious={handlePrevious} handleNext={handleNext} addItem={addItem} currentSlide={currentSlide} documentsLength={documents.length} />
        </div>
      </div>
      <div className={styles.sliderBottomButtons}>
        <LeftButton handlePrevious={handlePrevious} handleNext={handleNext} addItem={addItem} currentSlide={currentSlide} documentsLength={documents.length} />
        <RightButton handlePrevious={handlePrevious} handleNext={handleNext} addItem={addItem} currentSlide={currentSlide} documentsLength={documents.length} />
      </div>
      <div className={styles.submitOptions}>
        <PrimaryButton onClick={handleSubmit}>Submit</PrimaryButton>
        <span className={styles.documentCount}>
          {documents.length} Documents
        </span>
      </div>
    </div>
  );
};

export default FileSlider;