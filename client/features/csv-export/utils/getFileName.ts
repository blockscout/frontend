import type { CsvExportType } from '../types/client';

import type config from 'configs/app';
import dayjs from 'lib/date/dayjs';

interface Params {
  type: CsvExportType;
  params: Record<string, string>;
  chainConfig?: typeof config;
}

export default function getFileName({ type, params, chainConfig }: Params): string {
  const chainText = chainConfig?.chain.name ? `${ chainConfig.chain.name.replace(' ', '-').toLowerCase() }_` : '';

  if (type === 'token_holders') {
    return `${ chainText }token_holders_${ params.hash }.csv`;
  }

  if (type.startsWith('address_')) {
    const filterText = params.filter_type && params.filter_value ? `_with_filter_type_${ params.filter_type }_value_${ params.filter_value }` : '';
    const dateText = params.from_period && params.to_period ? `_from_${ params.from_period }_to_${ params.to_period }` : '';
    return `${ chainText }${ type }_${ params.hash }${ dateText }${ filterText }.csv`;
  }

  if (type === 'advanced_filters') {
    return `${ chainText }filtered-txs-${ dayjs().format('YYYY-MM-DD-HH-mm-ss') }.csv`;
  }

  return 'data.csv';
}
