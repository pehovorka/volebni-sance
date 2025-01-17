import { getFirestore } from "firebase-admin/firestore";

export const initializeDB = () => {
  return getFirestore();
};
