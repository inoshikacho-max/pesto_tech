
import { initializeApp } from 'firebase/app';
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyAWmnyJmyRB9yW-WTURgTBzewo624drVOk",
  authDomain: "taskmanager-b4eb8.firebaseapp.com",
  projectId: "taskmanager-b4eb8",
  storageBucket: "taskmanager-b4eb8.appspot.com",
  messagingSenderId: "238707294915",
  appId: "1:238707294915:web:bea26ac0bffb7131fb9876",
  measurementId: "G-KXE8NCEVVR"
};

const app = initializeApp(firebaseConfig);

const storage = getStorage(app, "gs://taskmanager-b4eb8.appspot.com");
const storageRef = ref(storage, "/taskfiles");


export const uploadFile = async (file: File):Promise<string | undefined> => {
  let result;
  try {
    const snapshot = await uploadBytes(storageRef, file);
    result = await getDownloadURL(snapshot.ref);
  } catch (error) {
    console.log(error);
  }
  return result
}