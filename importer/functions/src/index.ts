import * as functions from "firebase-functions";
import { DataType, ElectionRecord, Service } from "./interfaces/database";
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

    const sessionId = await getSessionId();
    if (!sessionId) {
      throwError(500, "Session ID could not be retrieved.", response);
      return;
    }

    const matchDetails = await getMatchDetails(2878450, sessionId);
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

    functions.logger.info("Match details retrieved", matchDetails);
    response.json(record);
  });
