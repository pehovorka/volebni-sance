import axios from "axios";
import { logger } from "firebase-functions/v1";
import type { TipsportMatchResponse } from "../interfaces/tipsport";

export const getSessionId = async () => {
  try {
    const response = await axios.post(
      "https://m.tipsport.cz/rest/common/v1/init-web",
      {
        platform: "MWEB",
        restartSession: false,
      }
    );

    const { headers } = response;

    if (headers["set-cookie"]) {
      const sessionId = headers["set-cookie"].find((cookie) =>
        cookie.includes("JSESSIONID")
      );
      return sessionId;
    }
    return undefined;
  } catch (error) {
    logger.error(error);
    return undefined;
  }
};

export const getMatchDetails = async (matchId: number, sessionId: string) => {
  try {
    const response = await axios.get(
      `https://m.tipsport.cz/rest/offer/v2/matches/${matchId}`,
      {
        headers: {
          cookie: sessionId,
        },
      }
    );
    logger.debug("Received response", response.data);

    return response.data.match as TipsportMatchResponse["match"];
  } catch (error) {
    logger.error(error);
  }
  try {
    const response = await axios.get(
      `https://m.tipsport.cz/rest/offer/v2/live/matches/${matchId}`,
      {
        headers: {
          cookie: sessionId,
        },
      }
    );
    logger.debug("Received fallback response", response.data);

    return response.data.match as TipsportMatchResponse["match"];
  } catch (error) {
    logger.error(error);
  }
  return undefined;
};

export const parseMatchDetails = (
  matchDetails: TipsportMatchResponse["match"]
) => {
  const candidates = matchDetails.eventTables
    .find((eventTable) =>
      eventTable.name.trim().toLowerCase().includes("vítěz")
    )
    ?.boxes[0].cells.map((candidate) => ({
      name: candidate.name,
      odds: candidate.odd,
      active: candidate.active,
      winning: candidate.winning,
      id:
        candidate.oppNumber ?? candidate.name.includes("Pavel")
          ? "90005"
          : "90004",
    }));

  if (!candidates) {
    logger.error("Candidates couldn't be parsed!");
    return undefined;
  }

  const res = {
    name: matchDetails.name ?? matchDetails.nameFull,
    eventId: matchDetails.id,
    candidates: candidates,
  };

  return res;
};
