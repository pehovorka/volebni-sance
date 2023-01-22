import { CurrentOdds as ICurrentOdds } from "@/pages";
import styles from "@/styles/Home.module.css";

interface CurrentOddsProps {
  currentOdds: ICurrentOdds[] | null;
}

export const CurrentOdds = ({ currentOdds }: CurrentOddsProps) => {
  return (
    <section className={styles.currentOdds}>
      {currentOdds &&
        currentOdds.map((candidate) => (
          <div key={candidate.id} className={styles.candidate}>
            <span className={styles.candidateName}>{candidate.id}</span>
            <span className={styles.candidateOdds}>
              {candidate.value.toLocaleString("cs-CZ", {
                maximumFractionDigits: 1,
                style: "percent",
              })}
            </span>
          </div>
        ))}
    </section>
  );
};
