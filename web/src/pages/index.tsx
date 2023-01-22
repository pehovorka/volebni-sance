import Head from "next/head";
import Image from "next/image";
import { Montserrat } from "@next/font/google";
import styles from "@/styles/Home.module.css";
import { db } from "@/utils/firebase";
import { collection, doc, getDocs, Timestamp } from "firebase/firestore";
import {
  CollectionName,
  ElectionRecord,
} from "../../../importer/functions/src/interfaces/database";
import { getAdjustedProbability, getAdjustmentRatio } from "@/utils/odds";
import { ResponsiveLine, Serie } from "@nivo/line";

interface Props {
  data: Serie[];
}

export default function Home({ data }: Props) {
  return (
    <>
      <Head>
        <title>Pavel vs. Babiš – prezident 2023 | Volební šance</title>
        <meta
          name="description"
          content="Kdo bude podle sázkových kanceláří novým prezidentem?"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <h1 className={styles.title}>Pavel vs. Babiš – prezident 2023</h1>
      <div className={styles.chart}>
        <ResponsiveLine
          margin={{ top: 50, right: 110, bottom: 70, left: 80 }}
          data={data}
          xScale={{
            format: "%Y-%m-%dT%H:%M:%S.%LZ",
            type: "time",
          }}
          axisBottom={{
            format: "%d.%m. %H:%M",
            legend: "Datum a čas",
            legendOffset: 40,
            legendPosition: "middle",
          }}
          axisLeft={{
            format: ".0%",
            legend: "Pravděpodobnost zvolení",
            legendOffset: -50,
            legendPosition: "middle",
          }}
          yScale={{
            type: "linear",
            min: 0,
            max: 1,
            stacked: false,
          }}
          xFormat="time:%d.%m.%Y %H:%M"
          /* {(date) =>
              new Date(date).toLocaleString("cs-CZ", {
                month: "numeric",
                day: "numeric",
                hour: "numeric",
                minute: "numeric",
              })
            } */
          yFormat=".0%"
          pointSize={10}
          pointColor={{ theme: "background" }}
          pointBorderWidth={2}
          pointBorderColor={{ from: "serieColor" }}
          pointLabelYOffset={-12}
          useMesh={true}
          colors={{ scheme: "category10" }}
          legends={[
            {
              anchor: "top",
              direction: "row",
              justify: false,
              translateX: 0,
              translateY: -30,
              itemsSpacing: 30,
              itemDirection: "left-to-right",
              itemWidth: 80,
              itemHeight: 20,
              itemOpacity: 0.85,
              symbolSize: 12,
              symbolShape: "circle",
              symbolBorderColor: "rgba(0, 0, 0, .5)",
              effects: [
                {
                  on: "hover",
                  style: {
                    itemBackground: "rgba(0, 0, 0, .03)",
                    itemOpacity: 1,
                  },
                },
              ],
            },
          ]}
        />
      </div>
    </>
  );
}

export async function getStaticProps() {
  const documents: ElectionRecord[] = [];
  const querySnapshot = await getDocs(
    collection(db, CollectionName.ElectionRecords)
  );
  querySnapshot.forEach((doc) => {
    const data = doc.data() as Omit<ElectionRecord, "date"> & {
      date: Timestamp;
    };
    documents.push({
      ...data,
      date: data.date.toDate(),
    });
  });

  const candidateIds = documents[0].candidates.map((c) => c.id);

  const result = candidateIds.map((candidateId) => {
    const name = documents[0].candidates.find(
      (c) => c.id === candidateId
    )!.name;
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
  console.log(result);

  return {
    props: {
      data: result,
    },
    revalidate: 60, // In seconds
  };
}
