import { logger, type Response } from "firebase-functions/v1";

export const throwError = (
  status: number,
  message: string,
  response: Response
) => {
  logger.error(message);
  response.status(status);
  response.json({ error: message });
};
