import * as v from 'valibot';

import useApiQuery from 'lib/api/useApiQuery';
import { SOLIDITY_SCAN_REPORT } from 'stubs/contract';

import { SolidityScanSchema } from './schema';

interface Params {
  hash: string;
}

export default function useFetchReport({ hash }: Params) {
  return useApiQuery('contract_solidity_scan_report', {
    pathParams: { hash },
    queryOptions: {
      select: (response) => {
        const parsedResponse = v.safeParse(SolidityScanSchema, response);

        if (!parsedResponse.success) {
          throw Error('Invalid response schema');
        }

        return parsedResponse.output;
      },
      enabled: Boolean(hash),
      placeholderData: SOLIDITY_SCAN_REPORT,
      retry: 0,
    },
  });
}
