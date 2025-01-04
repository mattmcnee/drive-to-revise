import React from "react";
import styles from "./Loading.module.scss";

const Loading = ({ active = true }) => {
  return (
    <div className={styles.loadingScreen}>
      <div className={styles.loader}></div>
      <div className={`${styles.loadingText} no-select`}>Loading...</div>
    </div>
  );
};

export default Loading;