import axios from "axios";

export const revalidateWebsite = async () => {
  try {
    await axios.post(
      process.env.REVALIDATE_URL || "http://localhost/api/revalidate",
      {
        secret: process.env.REVALIDATE_TOKEN,
      }
    );
    console.log("Website was successfully revalidated.");
    return;
  } catch (error) {
    console.error(error);
    return undefined;
  }
};
