import app from './config';
import { 
  doc, 
  setDoc, 
  getFirestore, 
  Firestore
} from 'firebase/firestore';
const db: Firestore = getFirestore(app);

// Called in useAuth, creates user document on account creation
export const createUserDocument = async (userId: string, username: string): Promise<void> => {
  try {
    const userDoc = {
      usage: {},
      subscription: "standard",
      public: {
        joined: new Date().toISOString(),
        username: username
      }
    };

    await setDoc(doc(db, 'users', userId), userDoc);
    console.log(`User document created with ID: ${userId}`);
  } catch (error) {
    console.error('Error creating user document:', error);
    throw error;
  }
};

