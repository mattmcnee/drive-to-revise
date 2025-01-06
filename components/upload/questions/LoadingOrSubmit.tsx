import Loading from '@/components/ui/Loading';
import { PrimaryButton } from '@/components/ui/Buttons';

interface LoadingOrSubmitProps {
    status: string;
    onSubmit: () => void;
}

const LoadingOrSubmit = ({ status, onSubmit }: LoadingOrSubmitProps) => {
  return (
    <div>
      {status === "generating" ? (
        <Loading />
      ) : (
        status === "submitted" ? (
          <PrimaryButton disabled={true} onClick={onSubmit}>Submitted</PrimaryButton>
        ) : (
          <PrimaryButton onClick={onSubmit}>Submit</PrimaryButton>
        )
      )}
    </div>
  )
}

export default LoadingOrSubmit;