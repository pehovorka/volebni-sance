import axios from "axios";
import { logger } from "firebase-functions/v1";
import { xml2json } from "xml-js";
import axiosRetry, { exponentialDelay } from "axios-retry";

import { ResultsResponse } from "../interfaces/volbyCz";

const fetchData = async () => {
  axiosRetry(axios, { retries: 3 });

  try {
    const data = await axios.get("https://www.volby.cz/pls/prez2023/vysledky", {
      responseType: "text",
      timeout: 10000,
    });

    axiosRetry(axios, { retryDelay: exponentialDelay });

    return data;
  } catch (error) {
    logger.error(error);
    return undefined;
  }
};

const parseResults = (data: string) => {
  const results = JSON.parse(
    xml2json(data, { compact: true })
  ) as ResultsResponse;

  return results;
};

export const getResults = async () => {
  try {
    const response = await fetchData();

    if (!response?.data) return;
    return parseResults(response.data);
  } catch (error) {
    logger.error(error);
    return undefined;
  }
};
