import { initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

export const initializeDB = () => {
  initializeApp();
  return getFirestore();
};
