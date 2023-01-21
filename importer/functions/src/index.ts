import * as functions from "firebase-functions";
import {
  CollectionName,
  DataType,
  Election,
  ElectionRecord,
  Service,
} from "./interfaces/database";
import { throwError } from "./services/errors";
import { initializeDB } from "./services/initializeDb";
import { storeRecord } from "./services/storeRecord";
import {
  getMatchDetails,
  getSessionId,
  parseMatchDetails,
} from "./services/tipsport";

export const tipsportFetcher = functions
  .region("europe-west3")
  .https.onRequest(async (request, response) => {
    const db = initializeDB();
    const elections: Election[] = [];

    const electionsRef = await db
      .collection(CollectionName.Elections)
      .where("active", "==", true)
      .get();

    if (electionsRef.empty) {
      throwError(404, "No active elections found.", response);
      return;
    } else {
      electionsRef.forEach((doc) => {
        const data = doc.data() as Election;
        console.log(data);
        if (
          data.dataSources.some(
            (dataSource) => dataSource.service === Service.Tipsport
          )
        ) {
          elections.push(data);
        }
      });
    }

    const sessionId = await getSessionId();
    if (!sessionId) {
      throwError(500, "Session ID could not be retrieved.", response);
      return;
    }

    for (const election of elections) {
      for (const dataSource of election.dataSources) {
        if (dataSource.service === Service.Tipsport) {
          const matchDetails = await getMatchDetails(
            dataSource.eventId,
            sessionId
          );
          if (!matchDetails) {
            throwError(500, "Match details could not be retrieved.", response);
            return;
          }

          const parsedDetails = parseMatchDetails(matchDetails);
          if (!parsedDetails) {
            throwError(500, "Candidates could not be retrieved.", response);
            return;
          }

          const record: ElectionRecord = {
            date: new Date(),
            service: Service.Tipsport,
            type: DataType.Bets,
            ...parsedDetails,
          };

          storeRecord(record, db);
        }
      }
    }

    functions.logger.info("All records were saved");
    response.json({ success: true });
  });
