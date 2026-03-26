import type { CsvExportType } from '../types/client';

import type config from 'configs/app';
import dayjs from 'lib/date/dayjs';

import getPrefixByFilter from './getPrefixByFilter';

interface Params {
  type: CsvExportType;
  params: Record<string, string>;
  chainConfig?: typeof config;
}

export default function getFileName({ type, params, chainConfig }: Params): string {
  const chainText = chainConfig?.chain.name ? `${ chainConfig.chain.name.replace(' ', '_').toLowerCase() }` : '';

  if (type === 'token_holders') {
    return [
      chainText,
      'token_holders',
      params.hash,
    ].filter(Boolean).join('_') + '.csv';
  }

  if (type.startsWith('address_')) {
    const dateText = params.from_period && params.to_period ? `from_${ params.from_period }_to_${ params.to_period }` : '';
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
