import getValueWithUnit from 'lib/getValueWithUnit';

export const getBaseFeeValue = (baseFee: string | null) => {
  if (!baseFee) {
    return null;
  }
  const valGwei = getValueWithUnit(baseFee, 'gwei');
  if (valGwei.isGreaterThanOrEqualTo(0.0001)) {
    return valGwei.toFormat(4) + ' Gwei';
  }
  return getValueWithUnit(baseFee, 'wei').toFormat() + ' wei';
};
