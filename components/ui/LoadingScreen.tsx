import { PrimaryButton, TertiaryButton } from "./Buttons";
import Loading from "./Loading";
import styles from "./LoadingScreen.module.scss";

interface LoadingScreenProps {
    loading: boolean;
}

const LoadingScreen = ({ loading }: LoadingScreenProps) => {
  return (
    <div className={styles.loadingScreen}>
      {loading ? (
        <Loading />
      ) : (
        <div className={styles.signin}>
          <TertiaryButton onClick={() => window.location.href = "/signup"}>
                        Sign up
          </TertiaryButton>

          <span className={styles.or}>or</span>

          <PrimaryButton onClick={() => window.location.href = "/login"}>
                        Login
          </PrimaryButton>

        </div>
      )}
    </div>
  );
};

export default LoadingScreen;