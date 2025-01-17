import app from "./config";
import { 
  doc, 
  getDoc,
  setDoc, 
  getFirestore, 
  Firestore,
  collection,
  QueryConstraint,
  orderBy,
  limit,
  where,
  startAfter,
  query,
  getDocs,
  QueryDocumentSnapshot,
  DocumentData
} from "firebase/firestore";
import { DatasetDocument, UploadData } from "@/types/index.types";

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

    await setDoc(doc(db, "users", userId), userDoc);
    // console.log(`User document created with ID: ${userId}`);
  } catch (error) {
    console.error("Error creating user document:", error);
    throw error;
  }
};

// Called in DocumentUpload, fetches the username of the current user
export const getUsername = async (userId: string): Promise<string> => {
  try {
    const userDoc = doc(db, "users", userId);
    const docSnap = await getDoc(userDoc);

    if (docSnap.exists()) {
      const data = docSnap.data();
      return data.public.username;
    } else {
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

  const docData = {
    questions: data.questions,
    embeddings: data.embeddings,
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
    // console.log("Question set document created with ID:", newDocRef.id);
    return newDocRef.id;


  } catch (error) {
    console.error("Error creating question set document:", error);
    return "";
  }
};

// Gets the permission level of a user
export const getPermissionLevel = async (userId: string): Promise<string> => {
  try {
    const userDoc = doc(db, "users", userId);
    const docSnap = await getDoc(userDoc);

    if (docSnap.exists()) {
      const data = docSnap.data();
      return data.subscription;
    } else {
      return "";
    }
  } catch (error) {
    console.error("Error fetching user document:", error);
    return "";
  }
};

// Fetches a dataset document by ID
export const getDatasetDocument = async (docId: string): Promise<DatasetDocument | null> => {
  try {
    const docRef = doc(db, "datasets", docId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = docSnap.data() as DatasetDocument;
      data.firestoreId = docId;
      return data;
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error fetching dataset document:", error);
    return null;
  }
}

// Paginated list of question set documents, optionally filtered by user ID
// Most recent documents are returned first
export const getPaginatedDatasets = async (pageSize: number, docsAfter?: string, userId?: string) => {
  try {
    const datasetsRef = collection(db, 'datasets');
    const constraints: QueryConstraint[] = [
      orderBy('metadata.created', 'desc'),
      limit(pageSize)
    ];

    // Limit datasets to those created by the current user
    if (userId) {
      constraints.push(where('userId', '==', userId));
    }
    
    // Start after the last document in the previous page
    if (docsAfter) {
      constraints.push(startAfter(docsAfter));
    }

    const queryRef = query(datasetsRef, ...constraints);

    const querySnapshot = await getDocs(queryRef);
    const datasets: DatasetDocument[] = querySnapshot.docs.map((doc: QueryDocumentSnapshot<DocumentData>) => {
      const data = doc.data() as DatasetDocument;
      data.firestoreId = doc.id;
      return data;
    });

    const docs = querySnapshot.docs;
    const nextAfter = docs.length > 0
      ? docs[docs.length - 1].id
      : null;

    return { datasets, nextAfter };
  } catch (error) {
    console.error('Error fetching datasets:', error);
    throw error;
  }
};

