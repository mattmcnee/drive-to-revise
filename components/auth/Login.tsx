import React, { useState, useEffect } from "react";
import { useAuth } from "@/firebase/useAuth";
import { PrimaryButton, ClickableText } from "@/components/ui/Buttons";
import { FormInput } from "@/components/ui/FormComponents";
import { toast } from "react-toastify";

import styles from "./Auth.module.scss";

const Login = () => {
  const { login, loading, user } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitted(true);
  
    const { status, code } = await login(email, password);
    if (status === "error") {
      const message = code === "auth/invalid-credential" ? "Invalid username or password" : "An error occurred";
      toast.error(message);
      setSubmitted(false);
      
      return;
    }

    window.location.href = "/";
  };

  const handleSignUp = () => {
    window.location.href = "/signup";
  };

  if (user) {
    window.location.href = "/";
  }

  return (
    <div className={styles.authContainer}>
      <h2>Login to your account</h2>
      <form onSubmit={handleLogin} className={styles.signupForm}>
        <FormInput
          name="email"
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          required
          autoComplete="username"
        />

        <FormInput
          name="password"
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter your password"
          required
          autoComplete="current-password"
        />

        <div className={styles.bottomRow}>
          <PrimaryButton type="submit" disabled={loading || submitted}>
              Login
          </PrimaryButton>

          <ClickableText type="button" onClick={handleSignUp} disabled={submitted}>
              Don&apos;t have an account? <span>Sign Up</span>
          </ClickableText>
        </div>
      </form>
    </div>
  );
};

export default Login;