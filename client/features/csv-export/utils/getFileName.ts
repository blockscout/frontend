import type { CsvExportType } from '../types/client';

import type config from 'configs/app';

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
    return `${ chainText }${ type }_${ params.hash }${ filterText }.csv`;
  }

  return 'data.csv';
}
