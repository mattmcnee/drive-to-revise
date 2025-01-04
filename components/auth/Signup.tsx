import React, { useState } from "react";
import { useAuth } from "@/firebase/useAuth";
import { PrimaryButton, ClickableText } from "@/components/ui/Buttons";
import { FormInput } from "@/components/ui/FormComponents";
import { toast } from "react-toastify";

import styles from "./Auth.module.scss";

const SignupPage = () => {
  const { signup, loading, user } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const validateInput = (password: string, confirmPassword: string, username: string, email: string) => {
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      
      return;
    }

    if (username.length < 3 || username.length > 20) {
      toast.error("Username must be between 3 and 20 characters");
      
      return false;
    }

    // No regex validation as some valid emails may not pass the regex
    if (email.length < 3) {
      toast.error("Email must be at least 3 characters");
      
      return false;
    }

    // As per OSWARP: https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html
    if (password.length < 8 || password.length > 64) {
      toast.error("Password must be between 8 and 64 characters");
      
      return false;
    }
    
    return true;
  };

  const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitted(true);

    if (!validateInput(password, confirmPassword, username, email)) {
      return;
    }

    const { status, code } = await signup(email, password, username);
    if (status === "error") {
      const message = "Error creating account";
      toast.error(message);
      setSubmitted(false);
      
      return;
    }

    window.location.href = "/";
  };

  const handleLoginRedirect = () => {
    window.location.href = "/login";
  };

  if (user) {
    window.location.href = "/";
  }

  return (
    <div className={styles.authContainer}>
      <h2>Create an account</h2>
      <form onSubmit={handleSignup} className={styles.signupForm}>
        <FormInput
          name="nickname"
          label="Username"
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="What should we call you?"
          required
          autoComplete="text"
        />
        
        <FormInput
          name="email"
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          required
          autoComplete="new-username"
        />

        <FormInput
          name="password"
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter your password"
          required
          autoComplete="new-password"
        />

        <FormInput
          name="confirm_password"
          label="Confirm Password"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="Enter your password"
          required
          autoComplete="new-password"
        />

        <div className={styles.bottomRow}>
          <PrimaryButton type="submit" disabled={loading || submitted}>
              Sign Up
          </PrimaryButton>
            
          <ClickableText type="button" onClick={handleLoginRedirect} disabled={submitted}>
              Already have an account? <span>Login</span>
          </ClickableText>
        </div>

      </form>
    </div>
  );
};

export default SignupPage;