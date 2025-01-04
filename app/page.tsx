import Navbar from "@/components/ui/Navbar";
import { getPaginatedDatasets } from "@/firebase/firestoreInterface";
import DatasetCard from "@/components/ui/DatasetCard";
import styles from "./page.module.scss";

import { PrimaryLink } from "@/components/ui/Buttons";
import Link from "next/link";

export default async function Home() {
  const pageSize = 3;
  const docsAfter = "";

  const { datasets, nextAfter } = await getPaginatedDatasets(pageSize, docsAfter);

  return (
    <div>
      <Navbar />
      <div className={styles.pageContainer}>
        <div className={styles.wideContainer}>
          <div className={styles.hero}>
            <span className={styles.heroText}>Get miles ahead with your revision</span>
            <PrimaryLink href={"/upload"}>Upload notes</PrimaryLink>
          </div>



          <h2 className={styles.dataTitle}>What's new today?</h2>
          <ul className={styles.dataRow}>
            {datasets.map((dataset, index) => (
              <li key={dataset.firestoreId}>
                <DatasetCard dataset={dataset} />
              </li>
            ))}
          </ul>

          <h2 className={styles.dataTitle}>Just keep driving...</h2>
          <p>
            And let our AI do the rest. We'll generate questions automatically from your revision notes and create your very own custom game. Answer questions right to keep your speed and keep racking up those miles! Answer questions wrong and our AI will help you every step of the way.
          </p>
          <br/>
          <p>
            How does it work? When you upload your notes, we divide them into sections and generate questions from each section. Then we store a mathematical representation of the meaning of section in our database. When you get an answer wrong, we find the top three most similar sections in meaning and give this to the AI so it can guide you to the right answer.
          </p>
          <br/>
          <p>
            We're open source too so you can find everything on how this works in our <Link href="https://github.com/mattmcnee">GitHub repository</Link>.
          </p>
        </div>
      </div>
    </div>
  );
}
