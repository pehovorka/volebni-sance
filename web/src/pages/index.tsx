import Head from "next/head";
import Image from "next/image";
import { Inter } from "@next/font/google";
import styles from "@/styles/Home.module.css";
import { db } from "@/utils/firebase";
import { collection, doc, getDocs, Timestamp } from "firebase/firestore";
import {
  CollectionName,
  ElectionRecord,
} from "../../../importer/functions/src/interfaces/database";

const inter = Inter({ subsets: ["latin"] });

interface Props {
  election: ElectionRecord[];
}

export default function Home({ election }: Props) {
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
      <main className={styles.main}>
        <h1 className={styles.title}>Pavel vs. Babiš – prezident 2023</h1>
        <code>
          <pre>{JSON.stringify(election, ",", 2)}</pre>
        </code>
      </main>
    </>
  );
}

export async function getStaticProps() {
  const documents: any[] = [];
  const querySnapshot = await getDocs(
    collection(db, CollectionName.ElectionRecords)
  );
  querySnapshot.forEach((doc) => {
    const data = doc.data() as Omit<ElectionRecord, "date"> & {
      date: Timestamp;
    };
    documents.push({
      ...data,
      date: data.date.toDate().toISOString(),
    });
  });

  return {
    props: {
      election: documents,
    },
    // Next.js will attempt to re-generate the page:
    // - When a request comes in
    // - At most once every 10 seconds
    revalidate: 10, // In seconds
  };
}
