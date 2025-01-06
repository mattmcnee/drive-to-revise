import { useState, useEffect } from "react";
import app from "./config";
import { createUserDocument } from "./firestoreInterface";
import { 
  getAuth, 
  Auth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  UserCredential, 
  User 
} from "firebase/auth";

export function useAuth() {
  const auth: Auth = getAuth(app);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Listen for auth state changes and set state accordingly
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser: User | null) => {
      setUser(currentUser);
      setLoading(false);
    });

    // Cleanup the listener on component unmount
    return () => unsubscribe();
  }, [auth]);

  // Login user with email and password
  const login = async (email: string, password: string): Promise<{ status: string; code: string }> => {
    try {
      const userCredential: UserCredential = await signInWithEmailAndPassword(auth, email, password);
      setUser(userCredential.user);
      return { status: "success", code: "" };
    } catch (error: any) {
      return { status: "error", code: error.code };
    }
  };

  // Logout user
  const logout = async (): Promise<{ status: string; code: string }> => {
    try {
      await signOut(auth);
      setUser(null);
      return { status: "success", code: "" };
    } catch (error: any) {
      return { status: "error", code: error.code };
    }
  };

  // Signup user with Firebase Auth and create user document in Firestore
  const signup = async (email: string, password: string, username: string): Promise<{ status: string; code: string }> => {
    setLoading(true);
    try {
      const userCredential: UserCredential = await createUserWithEmailAndPassword(auth, email, password);
      // Populates with initial account details
      createUserDocument(userCredential.user.uid, username);
      setUser(userCredential.user);
      return { status: "success", code: "" };
    } catch (error: any) {
      return { status: "error", code: error.code };
    } finally {
      setLoading(false);
    }
  };

  return { 
    user, 
    login, 
    logout, 
    loading, 
    signup 
  };
}
