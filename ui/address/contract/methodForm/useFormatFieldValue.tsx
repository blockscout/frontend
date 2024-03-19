import React from 'react';

import type { SmartContractMethodArgType } from 'types/api/contract';

import type { MatchInt } from './useArgTypeMatchInt';

interface Params {
  argType: SmartContractMethodArgType;
  argTypeMatchInt: MatchInt | null;
}

export default function useFormatFieldValue({ argType, argTypeMatchInt }: Params) {

  return React.useCallback((value: string | undefined) => {
    if (!value) {
      return;
    }

    if (argTypeMatchInt) {
      const formattedString = value.replace(/\s/g, '');
      return parseInt(formattedString);
    }

    if (argType === 'bool') {
      const formattedValue = value.toLowerCase();

      switch (formattedValue) {
        case 'true': {
          return true;
        }

        case 'false':{
          return false;
        }

        default:
          return value;
      }
    }

    return value;
  }, [ argType, argTypeMatchInt ]);
}
