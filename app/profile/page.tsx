"use client";
import React, { useEffect, useState } from "react";
import Navbar from "@/components/ui/Navbar";
import { useAuth } from "@/firebase/useAuth";
import { getPaginatedDatasets, getUsername } from "@/firebase/firestoreInterface";
import { DatasetDocument } from "@/types/index.types";
import DatasetCard from "@/components/ui/DatasetCard";
import styles from "./page.module.scss";

const ProfilePage = () => {
  const { user, loading } = useAuth();
  const [datasets, setDatasets] = useState<DatasetDocument[]>([]);
  const [username, setUsername] = useState<string | null>(null);

  if (!loading && !user) {
    window.location.href = "/login";
  }

  useEffect(() => {
    if (user) {
      getPaginatedDatasets(9, "", user.uid).then((newDatasets) => {
        setDatasets(newDatasets.datasets);
      });

      getUsername(user.uid).then((newUsername) => {
        setUsername(newUsername);
      });
    }
  }, [user, loading]);

  return (
    <div>
      <Navbar />
      <div className={styles.profilePage}>
        <h2 className={styles.pageTitle}>Welcome back {username}</h2>
        <h3 className={styles.pageSubtitle}>Your datasets:</h3>
        <ul className={styles.datasetList}>
          {datasets.map((dataset, index) => (
            <li key={dataset.firestoreId}>
              <DatasetCard dataset={dataset} />
            </li>
          ))}
        </ul>
      </div>
    </div>

  );
};

export default ProfilePage;