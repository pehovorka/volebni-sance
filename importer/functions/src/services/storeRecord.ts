import { CollectionName, type ElectionRecord } from "../interfaces/database";

export const storeRecord = async (
  record: ElectionRecord,
  db: FirebaseFirestore.Firestore
) => {
  db.collection(CollectionName.electionRecords).add(record);
};
