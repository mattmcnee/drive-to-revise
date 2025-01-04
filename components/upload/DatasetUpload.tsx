import { useUploadContext } from "./UploadContext";
import { useAuth } from "@/firebase/useAuth";
import FileSlider from "@/components/upload/files/FileSlider";

const DatasetUpload = () => {
  const { state, generateEmbeddings } = useUploadContext();
  const { user, loading } = useAuth();

  if (loading) {
    return (<div>Loading...</div>);
  }

  return (
    <div>
      {/* {JSON.stringify(state)} */}
      <FileSlider />
    </div>
  );
};

export default DatasetUpload;