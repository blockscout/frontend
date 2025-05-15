import BigNumber from 'bignumber.js';

import type { Unit } from 'types/unit';

import { WEI, GWEI } from 'toolkit/utils/consts';

export default function getValueWithUnit(value: string | number, unit: Unit = 'wei') {
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
