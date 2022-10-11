import BigNumber from 'bignumber.js';

export default function divideBns(dividend: string | number, divisor: string | number, accuracy?: number) {
  const dividendBn = new BigNumber(dividend);
  const divisorBn = new BigNumber(divisor);
  const result = dividendBn.dividedBy(divisorBn);
  let numResult: string;
  if (accuracy) {
    numResult = result.toFixed(accuracy);
  }
  numResult = result.toFixed();

  return parseFloat(numResult);
}
