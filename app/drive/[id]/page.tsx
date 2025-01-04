"use client";

import React, { useEffect, useState } from "react";
import Scene from "@/components/drive/Scene";
import { useAuth } from "@/firebase/useAuth";
import { getDatasetDocument, DatasetDocument } from "@/firebase/firestoreInterface";

import { useParams } from "next/navigation";

export default function Page() {
  const params = useParams();
  const id = params?.id as string;

  const { user, loading } = useAuth();
  const [data, setData] = useState<DatasetDocument | null>(null);

  const loadData = async () => {
    const newData = await getDatasetDocument(id);
    setData(newData);
    console.log(newData);
  }

  useEffect(() => {
    if (user && id && !data) {
      loadData();
    }
  }, [user, id, data]);

  if (loading || !data) {
    return (<div>Loading...</div>);
  }

  return (
    <Scene inputData={data} />
  );
}