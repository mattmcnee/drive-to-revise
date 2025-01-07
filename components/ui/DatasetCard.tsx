import React from "react";
import ShapeIconStatic from "./ShapeIconStatic";
import styles from "./DatasetCard.module.scss";
import Link from "next/link";

const DatasetCard = ({ dataset }: { dataset: any }) => {
  const displayText = `${dataset.questions.length} Question${dataset.questions.length > 1 ? "s" : ""}`;

  return (
    <Link href={`/drive/${dataset.firestoreId}`}>
      <div className={styles.cardBody}>
        
        <div className={styles.cardRow}>
          <ShapeIconStatic shape={dataset.metadata.iconShape || "hexagon"} size={64} />
          <h3 className={styles.cardTitle}>{dataset.metadata.title || "Title"}</h3>
          
          {/* <div>{JSON.stringify(dataset.embeddings)}</div> */}
        </div>
        <div className={styles.questions}>{displayText}</div>
        <div className={styles.cardUser}>by {dataset.metadata.username || "user"}</div>
      </div>
    </Link>
  );
};

export default DatasetCard;