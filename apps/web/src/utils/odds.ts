export const getAdjustmentRatio = (odds: number[]) => {
  const probabilities = odds.map((odd) => 1 / odd);
  const sum = probabilities.reduce((a, b) => a + b, 0);

  return sum / 1;
};

export const getAdjustedProbability = (odds: number, ratio: number) => {
  return 1 / odds / ratio;
};
