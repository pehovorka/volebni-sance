import { logger } from "firebase-functions/v1";

export const throwError = (message: string) => {
  logger.error(message);
};
