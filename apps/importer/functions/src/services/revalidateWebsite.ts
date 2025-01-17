import axios from "axios";
import { logger } from "firebase-functions/v1";

export const revalidateWebsite = async () => {
  try {
    await axios.post(
      process.env.REVALIDATE_URL || "http://localhost/api/revalidate",
      {
        secret: process.env.REVALIDATE_TOKEN,
      }
    );
    logger.log("Website was successfully revalidated.");
    return;
  } catch (error) {
    console.error(error);
    return undefined;
  }
};
