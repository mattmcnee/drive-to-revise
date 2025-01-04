import { useUploadContext } from "./UploadContext";
import { useAuth } from "@/firebase/useAuth";
import { PrimaryButton } from "@/components/ui/Buttons";
import FileSlider from "@/components/upload/files/FileSlider";

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
      <FileSlider />
    </div>
  );
};

export default DatasetUpload;