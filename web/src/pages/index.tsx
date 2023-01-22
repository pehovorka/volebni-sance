import Head from "next/head";
import { Serie } from "@nivo/line";
import {
  collection,
  getDocs,
  orderBy,
  query,
  Timestamp,
  where,
} from "firebase/firestore";

import styles from "@/styles/Home.module.css";

import { Chart } from "@/components/Chart";
import { CurrentOdds } from "@/components/CurrentOdds";
import { db } from "@/utils/firebase";
import {
  CollectionName,
  ElectionRecord,
} from "../../../importer/functions/src/interfaces/database";
import { getAdjustedProbability, getAdjustmentRatio } from "@/utils/odds";
import { DatumValue } from "@nivo/core";

export interface CurrentOdds {
  date: DatumValue;
  value: DatumValue;
  id: string | number;
}
interface Props {
  chartData: Serie[] | null;
  currentOdds: CurrentOdds[] | null;
}

export default function Home({ chartData, currentOdds }: Props) {
  return (
    <>
      <Head>
        <title>Pavel vs. Babiš — prezident 2023 | Volební šance</title>
        <meta
          name="description"
          content="Kdo bude podle sázkových kanceláří novým prezidentem?"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <h1 className={styles.title}>Pavel vs. Babiš — prezident 2023</h1>
      <h2 className={styles.subTitle}>
        Aktuální pravděpodobnost vítězství podle sázkových kanceláří
      </h2>

      <CurrentOdds currentOdds={currentOdds} />

      <div className={styles.chart}>
        {chartData ? (
          <Chart data={chartData} />
        ) : (
          "Nepodařilo se načíst data :("
        )}
      </div>

      <div className={styles.source}>
        Zdroj: Tipsport.cz,{" "}
        {currentOdds &&
          new Date(currentOdds[0].date).toLocaleDateString("cs-CZ", {
            day: "numeric",
            month: "numeric",
            year: "numeric",
            hour: "numeric",
            minute: "numeric",
          })}
      </div>
    </>
  );
}

export async function getStaticProps() {
  console.log("Revalidation in progress...");
  const documents: ElectionRecord[] = [];
  const electionRecordsRef = collection(db, CollectionName.ElectionRecords);
  const q = query(
    electionRecordsRef,
    where("eventId", "==", 2878450),
    orderBy("date", "desc")
  );
  const originalDocuments = await getDocs(q);

  originalDocuments.forEach((doc) => {
    const data = doc.data() as Omit<ElectionRecord, "date"> & {
      date: Timestamp;
    };
    documents.push({
      ...data,
      date: data.date.toDate(),
    });
  });

  const candidateIds = documents[0]?.candidates.map((c) => c.id);

  let chartData: Serie[] | null;

  if (!candidateIds) {
    chartData = null;
  } else {
    chartData = candidateIds.map((candidateId) => {
      const name = documents[0].candidates.find(
        (c) => c.id === candidateId
      )?.name;
      if (!name) return { id: "", data: [] };
      return {
        id: name.split(" ").reverse().join(" "),
        data: documents.map((doc) => {
          const adjustmentRatio = getAdjustmentRatio(
            doc.candidates.map((c) => c.odds)
          );
          const candidate = doc.candidates.find((c) => c.id === candidateId)!;
          return {
            x: doc.date.toISOString(),
            y: getAdjustedProbability(candidate.odds, adjustmentRatio),
          };
        }),
      };
    });
  }

  const currentOdds = chartData?.map((serie) => {
    const lastItem = serie.data[0];
    return {
      date: lastItem.x,
      id: serie.id,
      value: lastItem.y,
    };
  });

  return {
    props: {
      chartData,
      currentOdds,
    },
  };
}
