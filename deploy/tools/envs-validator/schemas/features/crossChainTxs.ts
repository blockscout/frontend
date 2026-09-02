import * as yup from 'yup';
import { replaceQuotes } from 'src/config/utils/envs';
import { urlTest } from '../../utils';

export const crossChainTxsSchema = yup
  .object()
  .shape({
    NEXT_PUBLIC_CROSS_CHAIN_TXS_ENABLED: yup.boolean(),
    NEXT_PUBLIC_CROSS_CHAIN_TXS_BRIDGE_IDS: yup
      .array()
      .transform(replaceQuotes)
      .json()
      .of(yup.number().required())
      .when('NEXT_PUBLIC_CROSS_CHAIN_TXS_ENABLED', {
        is: (value: boolean) => value,
        then: (schema) => schema.required(),
        otherwise: (schema) => schema.max(
          -1,
          'NEXT_PUBLIC_CROSS_CHAIN_TXS_BRIDGE_IDS can only be used with NEXT_PUBLIC_CROSS_CHAIN_TXS_ENABLED',
        ),
      }),
    NEXT_PUBLIC_CROSS_CHAIN_TXS_INCLUDE_UNINDEXED_CHAINS: yup.boolean(),
    NEXT_PUBLIC_INTERCHAIN_INDEXER_API_HOST: yup
      .string()
      .when('NEXT_PUBLIC_CROSS_CHAIN_TXS_ENABLED', {
        is: (value: boolean) => value,
        then: (schema) => schema.test(urlTest),
        otherwise: (schema) => schema.test(
          'not-exist',
          'NEXT_PUBLIC_INTERCHAIN_INDEXER_API_HOST can only be used with NEXT_PUBLIC_CROSS_CHAIN_TXS_ENABLED',
          value => value === undefined,
        ),
      }),
  });
