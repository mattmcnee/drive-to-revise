import app from "./config";
import { 
  doc, 
  getDoc,
  setDoc, 
  getFirestore, 
  Firestore,
  collection
} from "firebase/firestore";
import { UploadData } from "@/components/upload/UploadContext";

const db: Firestore = getFirestore(app);

interface DatasetQuestion {
  question: string;
  answer: string;
  dummy: string;
  id: string;
}

export interface DatasetDocument {
  questions: DatasetQuestion[];
  embeddings: { name: string; value: string }[];
  metadata: {
    iconShape: string;
    username: string;
    title: string;
    created: string;
  };
  userId: string;
}

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

    await setDoc(doc(db, "users", userId), userDoc);
    console.log(`User document created with ID: ${userId}`);
  } catch (error) {
    console.error("Error creating user document:", error);
    throw error;
  }
};

export const getUsername = async (userId: string): Promise<string> => {
  try {
    const userDoc = doc(db, "users", userId);
    const docSnap = await getDoc(userDoc);

    if (docSnap.exists()) {
      const data = docSnap.data();
      return data.public.username;
    } else {
      console.log("No such document!");
      return "";
    }
  } catch (error) {
    console.error("Error fetching user document:", error);
    return "";
  }
};

// Called in DocumentUpload, creates a new question set document
export const createDatasetDocument = async (userId: string, data: UploadData): Promise<String> => {
  let username = await getUsername(userId);
  if (username == "") {
    console.warn('No username found for user, listing as "anonymous"');
    username = "anonymous";
  }

  const stingifiedEmbeddings = data.embeddings.map((embedding) => {
    embedding.value = JSON.stringify(embedding.value);
    return embedding;
  });

  const docData = {
    questions: data.questions,
    embeddings: stingifiedEmbeddings,
    metadata: {
      iconShape: data.metadata.iconShape,
      username: username,
      title: data.metadata.title || "New Set",
      created: new Date().toISOString(),
    },
    userId
  }

  try {
    const newDocRef = doc(collection(db, "datasets"));
    await setDoc(newDocRef, docData);
    console.log("Question set document created with ID:", newDocRef.id);
    return newDocRef.id;


  } catch (error) {
    console.error("Error creating question set document:", error);
    return "";
  }
};

export const getDatasetDocument = async (docId: string): Promise<DatasetDocument | null> => {
  try {
    const docRef = doc(db, "datasets", docId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return docSnap.data() as DatasetDocument;
    } else {
      console.log("No such document!");
      return null;
    }
  } catch (error) {
    console.error("Error fetching dataset document:", error);
    return null;
  }
}

