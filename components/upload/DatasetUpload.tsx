import { useUploadContext } from "./UploadContext";
import { useAuth } from "@/firebase/useAuth";
import FileSlider from "@/components/upload/files/FileSlider";
import GeneratedQuestions from "@/components/upload/questions/GeneratedQuestions";
import LoadingScreen from "@/components/ui/LoadingScreen";

const DatasetUpload = () => {
  const { state, generateEmbeddings } = useUploadContext();
  const { user, loading } = useAuth();

  return (
    <>
    {(loading || !user) &&
      <LoadingScreen loading={(loading || user != null)}/>
    }
    {(state.status === "generating" || state.status === "review" || state.status === "submitted") ? (
      <GeneratedQuestions />
    ): (
      <FileSlider />
    )}
    </>
  );
};

export default DatasetUpload;