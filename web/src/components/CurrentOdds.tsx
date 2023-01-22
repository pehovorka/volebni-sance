import styles from "@/styles/Home.module.css";

interface CurrentOddsProps {
  currentValues:
    | {
        date: Date;
        id: string | number;
        value: number;
      }[]
    | undefined;
}

export const CurrentOdds = ({ currentValues }: CurrentOddsProps) => {
  return (
    <section className={styles.currentOdds}>
      {currentValues &&
        currentValues.map((candidate) => (
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
