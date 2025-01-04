import Image from "next/image";
import styles from "./page.module.css";
import Navbar from "@/components/ui/Navbar";

export default function Home() {
  return (
    <div className={styles.page}>
      <Navbar />
    </div>
  );
}
