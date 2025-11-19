import getValueWithUnit from 'lib/getValueWithUnit';
import { currencyUnits } from 'lib/units';

export const getBaseFeeValue = (baseFee: string | null) => {
  if (!baseFee) {
    return null;
  }
  const valGwei = getValueWithUnit(baseFee, 'gwei');
  if (valGwei.isGreaterThanOrEqualTo(0.0001)) {
    return `${ valGwei.toFormat(4) } ${ currencyUnits.gwei }`;
  }
  return `${ getValueWithUnit(baseFee, 'wei').toFormat() } ${ currencyUnits.wei }`;
};
