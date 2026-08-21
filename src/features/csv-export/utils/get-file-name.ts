// SPDX-License-Identifier: LicenseRef-Blockscout

import type { CsvExportType } from '../types/client';

import type config from 'src/config';
import dayjs from 'src/shared/date-and-time/dayjs';

import getPrefixByFilter from './get-prefix-by-filter';

// filename-safe: no colons or dots, unlike the absolute ISO strings stored in the params
const PERIOD_FILE_NAME_FORMAT = 'YYYY-MM-DD-HH-mm';

interface Params {
  type: CsvExportType;
  params: Record<string, string>;
  chainConfig?: typeof config;
  isLocalTime: boolean;
}

export default function getFileName({ type, params, chainConfig, isLocalTime }: Params): string {
  const chainText = chainConfig?.chain.name ? `${ chainConfig.chain.name.replace(' ', '_').toLowerCase() }` : '';

  if (type === 'token_holders') {
    return [
      chainText,
      'token_holders',
      params.hash,
    ].filter(Boolean).join('_') + '.csv';
  }

  if (type.startsWith('address_')) {
    const formatPeriod = (isoString: string) =>
      (isLocalTime ? dayjs(isoString) : dayjs(isoString).utc()).format(PERIOD_FILE_NAME_FORMAT);
    const dateText = params.from_period && params.to_period ?
      `from_${ formatPeriod(params.from_period) }_to_${ formatPeriod(params.to_period) }${ isLocalTime ? '' : '_UTC' }` :
      '';
    const entityPrefix = getPrefixByFilter(params?.filter_type, params?.filter_value);

    return [
      chainText,
      entityPrefix,
      type,
      params.hash,
      dateText,
    ].filter(Boolean).join('_') + '.csv';
  }

  if (type === 'advanced_filters') {
    return [
      chainText,
      'filtered_txs',
      dayjs().format('YYYY-MM-DD-HH-mm-ss'),
    ].filter(Boolean).join('_') + '.csv';
  }

  return 'data.csv';
}
