"use client";

import Navbar from "@/components/ui/Navbar";
import styles from "./page.module.scss";
import DatasetUpload from "@/components/upload/DatasetUpload";
import { UploadProvider } from "@/components/upload/UploadProvider";

export default function Demo() {
  return (
    <div className={styles.pageContainer}>
      <Navbar />
      <UploadProvider>
        <DatasetUpload/>
      </UploadProvider>
      
    </div>
  );
}