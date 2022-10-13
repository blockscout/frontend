import BigNumber from 'bignumber.js';

import { WEI, GWEI } from 'lib/consts';

export default function getValueWithUnit(value: string | number, unit: 'wei' | 'gwei' | 'ether' = 'wei') {
  let unitBn: BigNumber.Value;
  switch (unit) {
    case 'wei':
      unitBn = WEI;
      break;
    case 'gwei':
      unitBn = GWEI;
      break;
    default:
      unitBn = new BigNumber(1);
  }

  const valueBn = new BigNumber(value);
  const valueCurr = valueBn.dividedBy(unitBn);
  return valueCurr;
}
