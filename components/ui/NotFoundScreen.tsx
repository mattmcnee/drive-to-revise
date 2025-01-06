import styles from "./NotFoundScreen.module.scss";
import Link from "next/link";


const LoadingScreen = () => {
  return (
    <div className={styles.notFoundScreen}>
      <h1>404: Page not found</h1>
      <h3><Link href={"/"}>Try our homepage</Link></h3>
    </div>
  );
};

export default LoadingScreen;