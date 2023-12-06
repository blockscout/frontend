import type { ResponseData } from 'types/translateApi';

import { TRANSLATE_CLASSIFIED } from './translateClassified';
import { TRANSLATE_RAW } from './translateRaw';

export const TRANSLATE: ResponseData = {
  accountAddress: '0x2b824349b320cfa72f292ab26bf525adb00083ba9fa097141896c3c8c74567cc',
  chain: 'base',
  txTypeVersion: 2,
  rawTransactionData: TRANSLATE_RAW,
  classificationData: TRANSLATE_CLASSIFIED,
};
