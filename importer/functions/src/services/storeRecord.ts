import {
  CollectionName,
  ElectionResultRecord,
  type ElectionRecord,
} from "../interfaces/database";

export const storeRecord = async (
  record: ElectionRecord,
  db: FirebaseFirestore.Firestore
) => {
  db.collection(CollectionName.ElectionRecords).add(record);
};

export const storeElectionResultRecord = async (
  record: ElectionResultRecord,
  db: FirebaseFirestore.Firestore
) => {
  db.collection(CollectionName.ElectionResultRecords).add(record);
};
