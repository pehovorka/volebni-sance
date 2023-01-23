import { CurrentOdds as ICurrentOdds } from "@/pages";
import styles from "@/styles/Home.module.css";
import Image from "next/image";

interface CurrentOddsProps {
  currentOdds: ICurrentOdds | null;
}

export const CurrentOdds = ({ currentOdds }: CurrentOddsProps) => {
  if (!currentOdds) return <></>;
  return (
    <section className={styles.currentOdds}>
      <div className={styles.candidate}>
        <Image
          src={"/images/petr_pavel.png"}
          alt={currentOdds.pavel.name}
          width={196}
          height={300}
          className={styles.candidateImage}
        />
        <div
          className={styles.candidateDetails}
          style={{ alignItems: "flex-end", marginLeft: "-2rem" }}
        >
          <span className={styles.candidateOdds}>
            {currentOdds.pavel.value.toLocaleString("cs-CZ", {
              maximumFractionDigits: 1,
              style: "percent",
            })}
          </span>
          <h3 className={styles.candidateName}>{currentOdds.pavel.name}</h3>
        </div>
      </div>
      <div className={styles.candidate}>
        <div
          className={styles.candidateDetails}
          style={{ marginRight: "-2rem" }}
        >
          <span className={styles.candidateOdds}>
            {currentOdds.babis.value.toLocaleString("cs-CZ", {
              maximumFractionDigits: 1,
              style: "percent",
            })}
          </span>
          <h3 className={styles.candidateName}>{currentOdds.babis.name}</h3>
        </div>
        <Image
          src={"/images/andrej_babis.png"}
          alt={currentOdds.babis.name}
          width={193}
          height={300}
          className={styles.candidateImage}
        />
      </div>
    </section>
  );
};
