import { useUploadContext } from "./UploadContext";
import { useAuth } from "@/firebase/useAuth";
import FileSlider from "@/components/upload/files/FileSlider";
import GeneratedQuestions from "@/components/upload/questions/GeneratedQuestions";

const DatasetUpload = () => {
  const { state, generateEmbeddings } = useUploadContext();
  const { user, loading } = useAuth();

  if (loading) {
    return (<div>Loading...</div>);
  }

  if (state.status === "generating" || state.status === "review" || state.status === "submitted") {
    return (<GeneratedQuestions />);
  } else {
    return (<FileSlider />);
  }
};

export default DatasetUpload;