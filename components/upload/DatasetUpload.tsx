import { useUploadContext } from "./UploadContext";
import { useAuth } from "@/firebase/useAuth";
import { PrimaryButton } from "@/components/ui/Buttons";

const DatasetUpload = () => {
  const { state, generateEmbeddings } = useUploadContext();
  const { user, loading } = useAuth();

  if (loading) {
    return (<div>Loading...</div>);
  }

  return (
    <div>
      <PrimaryButton onClick={generateEmbeddings}>Generate Embeddings</PrimaryButton>
      {JSON.stringify(state)}
    </div>
  );
};

export default DatasetUpload;