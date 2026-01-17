import * as yup from 'yup';
import { urlTest } from '../../utils';
import { replaceQuotes } from 'configs/app/utils';
import { ExternalChain } from 'types/externalChains';
  
const externalChainConfigSchema: yup.ObjectSchema<ExternalChain> = yup.object({
    id: yup.string().required(),
    name: yup.string().required(),
    logo: yup.string(),
    explorer_url: yup.string().test(urlTest).required(),
    route_templates: yup.object({
        tx: yup.string(),
        address: yup.string(),
        token: yup.string(),
    }),
});
  
export const crossChainTxsSchema = yup
    .object()
    .shape({
        NEXT_PUBLIC_INTERCHAIN_INDEXER_API_HOST: yup.string().test(urlTest),
        NEXT_PUBLIC_CROSS_CHAIN_TXS_CONFIG: yup
        .array()
        .transform(replaceQuotes)
        .json()
        .of(externalChainConfigSchema)
        .when('NEXT_PUBLIC_INTERCHAIN_INDEXER_API_HOST', {
            is: (value: string) => Boolean(value),
            then: (schema) => schema,
            otherwise: (schema) => schema.test(
            'not-exist',
            'NEXT_PUBLIC_CROSS_CHAIN_TXS_CONFIG cannot be used if NEXT_PUBLIC_INTERCHAIN_INDEXER_API_HOST is not set',
            value => value === undefined,
            ),
        }),
    });
  