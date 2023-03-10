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

import type { InferGetStaticPropsType } from "next";

import styles from "@/styles/Home.module.css";

import { Chart } from "@/components/Chart";
import { CurrentOdds } from "@/components/CurrentOdds";
import { db } from "@/utils/firebase";
import {
  CollectionName,
  ElectionRecord,
} from "../../../importer/functions/src/interfaces/database";
import { getAdjustedProbability, getAdjustmentRatio } from "@/utils/odds";
import { ArrowDown } from "@/components/ArrowDown";
import Link from "next/link";

export type CurrentOdds = InferGetStaticPropsType<
  typeof getStaticProps
>["currentOdds"];

export type ChartData = InferGetStaticPropsType<
  typeof getStaticProps
>["chartData"];

export default function Home({
  chartData,
  currentOdds,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  return (
    <>
      <Head>
        <title>Pavel vs. Babiš — prezident 2023 | Volební šance</title>
        <meta
          name="description"
          content="Kdo bude podle sázkových kanceláří novým prezidentem?"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta
          property="og:image"
          content="https://volebnisance.cz/images/og_image.png"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <section className={styles.section}>
        <h1 className={styles.title}>Pavel vs. Babiš</h1>
        <h2 className={styles.subTitle}>
          Aktuální pravděpodobnost vítězství podle kurzu Tipsportu
        </h2>
        <CurrentOdds currentOdds={currentOdds} />
        <Link href="#chart" scroll={false}>
          <div className={styles.arrowContainer}>
            historický vývoj
            <ArrowDown className={styles.arrow} />
          </div>
        </Link>
      </section>
      <section
        className={`${styles.section} ${styles.chartSection}`}
        id="chart"
      >
        <h2>Historický vývoj pravděpodobnosti vítězství</h2>
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
            new Date(currentOdds.date).toLocaleDateString("cs-CZ", {
              day: "numeric",
              month: "numeric",
              year: "numeric",
              hour: "numeric",
              minute: "numeric",
              timeZone: "Europe/Prague",
            })}
        </div>
      </section>
    </>
  );
}

export async function getStaticProps() {
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

  let chartData;

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
            odds: candidate.odds,
          };
        }),
      };
    });
  }

  const getCurrentOdds = () => {
    const adjustmentRatio = getAdjustmentRatio(
      documents[0].candidates.map((c) => c.odds)
    );
    const babisOdds =
      documents[0].candidates.find((c) => c.id === "90004")?.odds ?? 0;
    const pavelOdds =
      documents[0].candidates.find((c) => c.id === "90005")?.odds ?? 0;

    return {
      date: documents[0].date.toISOString(),
      pavel: {
        name: "Petr Pavel",
        value: getAdjustedProbability(pavelOdds, adjustmentRatio),
        odds: pavelOdds,
      },
      babis: {
        name: "Andrej Babiš",
        value: getAdjustedProbability(babisOdds, adjustmentRatio),
        odds: babisOdds,
      },
      adjustmentRatio: adjustmentRatio,
    };
  };

  const currentOdds = getCurrentOdds();

  return {
    props: {
      chartData,
      currentOdds,
    },
  };
}
