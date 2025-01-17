"use client";

import React, { useEffect, useState } from "react";
import Scene from "@/components/drive/Scene";
import { useAuth } from "@/firebase/useAuth";
import { getDatasetDocument } from "@/firebase/firestoreInterface";
import LoadingScreen from "@/components/ui/LoadingScreen";
import { DatasetDocument } from "@/types/index.types";

import { useParams } from "next/navigation";

export default function Page() {
  const params = useParams();
  const id = params?.id as string;

  const { user, loading } = useAuth();
  const [data, setData] = useState<DatasetDocument | null>(null);
  const [dataLoading , setDataloading] = useState(true);

  const loadData = React.useCallback(async () => {
    const newData = await getDatasetDocument(id);
    setData(newData);

    setTimeout(() => {
      setDataloading(false);
    }, 400);
    
  }, [id]);

  useEffect(() => {
    if (user && id && !data) {
      loadData();
    }
  }, [user, id, data, loadData]);

  return (
    <>
      {(loading || !data || dataLoading || !user) && 
      <LoadingScreen loading={(loading || user != null)}/>
      }
      {data &&
      <Scene inputData={data} />
      }
    </>
  );
}