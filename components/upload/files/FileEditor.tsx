import React from "react";
import styles from "./FileEditor.module.scss";
import { toast } from "react-toastify";

import deleteIcon from "@/public/icons/delete.svg";
import uploadIcon from "@/public/icons/export.svg";

import { useUploadContext } from "../UploadContext";
import { TertiaryButton } from "@/components/ui/Buttons";

import Image from "next/image";

interface FileEditorProps {
    index: number;
}

const FileEditor = ({ index }: FileEditorProps) => {
  const DOCX_TYPE = "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
  const TXT_TYPE = "text/plain";
  const MAX_LENGTH = 12000;

  const { state, dispatch } = useUploadContext();

  const value = state.documents[index];

  const handleTextChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    updateTextValue(event.target.value);
  };

  const updateTextValue = (text: string) => {
    // Limit text length to MAX_LENGTH characters
    if (text.length < MAX_LENGTH) {
      dispatch({ type: "SET_DOCUMENT_TEXT", payload: { index, text } });
    } else {
      dispatch({ type: "SET_DOCUMENT_TEXT", payload: { index, text: text.substring(0, MAX_LENGTH) } });
      toast.warning(`Document too long; cropped to first ${MAX_LENGTH} characters`);
    }
  };

  const handleFileChange = (event: Event) => {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      const reader = new FileReader();
      if (file.type === TXT_TYPE) {
        // Handle `.txt` file
        reader.onload = (e) => {
          const text = e.target?.result as string;
          updateTextValue(text);
        };
        reader.readAsText(file);
      } else {
        toast.error(`File type ${file.type} unsupported`);
        console.warn("Unsupported file type:", file.type);
      }
    }
  };

  const handleUpload = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".txt, .docx";
    input.onchange = handleFileChange;
    input.click();
  };

  return (
    <div className={styles.uploadContainer}>
      <div className={styles.topRow}>
        <TertiaryButton onClick={handleUpload}>
          <Image src={uploadIcon} alt="Uplaod" />
        </TertiaryButton>
        <h3 className={styles.sliderTitle}>Document {index + 1}</h3>
        <TertiaryButton onClick={() => updateTextValue("")}>
          <Image src={deleteIcon} alt="Delete" />
        </TertiaryButton>
      </div>
      
      <textarea 
        value={value} 
        onChange={handleTextChange} 
        placeholder="Enter text here..."
        maxLength={MAX_LENGTH}
        className={styles.textarea}
      />
    </div>
  );
};

export default FileEditor;
