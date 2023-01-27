import { initializeApp } from "firebase-admin/app";
import * as functions from "firebase-functions";
import {
  CollectionName,
  DataType,
  Election,
  ElectionRecord,
  Service,
} from "./interfaces/database";
import { throwError } from "./services/errors";
import { initializeDB } from "./services/initializeDB";
import { revalidateWebsite } from "./services/revalidateWebsite";
import { storeRecord } from "./services/storeRecord";
import {
  getMatchDetails,
  getSessionId,
  parseMatchDetails,
} from "./services/tipsport";

initializeApp();

export const tipsportFetcher = functions
  .region("europe-west3")
  .runWith({ secrets: ["REVALIDATE_URL", "REVALIDATE_TOKEN"] })
  .pubsub.schedule("*/30 * * * *")
  .timeZone("Europe/Prague")
  .onRun(async () => {
    const db = initializeDB();
    const elections: Election[] = [];

    const electionsRef = await db
      .collection(CollectionName.Elections)
      .where("active", "==", true)
      .get();

    if (electionsRef.empty) {
      throwError("No active elections found.");
      return;
    } else {
      electionsRef.forEach((doc) => {
        const data = doc.data() as Election;
        functions.logger.log("Starting importing elections...", data);
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
      throwError("Session ID could not be retrieved");
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
            throwError("Match details could not be retrieved.");
            return;
          }

          const parsedDetails = parseMatchDetails(matchDetails);
          if (!parsedDetails) {
            throwError("Candidates could not be retrieved.");
            return;
          }

          console.debug("Parsed details", parsedDetails);

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

    await revalidateWebsite();

    functions.logger.info("All records were saved");
  });
