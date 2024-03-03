import type { SmartContractMethodArgType } from 'types/api/contract';

import { INT_REGEXP, getIntBoundaries } from './utils';

interface Params {
  argType: SmartContractMethodArgType;
}

export interface MatchInt {
  isUnsigned: boolean;
  power: string;
  min: number;
  max: number;
}

export default function useArgTypeMatchInt({ argType }: Params): MatchInt | null {
  const match = argType.match(INT_REGEXP);
  if (!match) {
    return null;
  }

  const [ , isUnsigned, power = '256' ] = match;
  const [ min, max ] = getIntBoundaries(Number(power), Boolean(isUnsigned));

  return { isUnsigned: Boolean(isUnsigned), power, min, max };
}
