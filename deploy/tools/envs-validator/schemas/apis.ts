import * as yup from 'yup';
import { getYupValidationErrorMessage, protocols, urlTest } from '../utils';
import { replaceQuotes } from 'configs/app/utils';
import { StatsApiResourceNameRefetchInterval } from 'client/features/chain-stats/types/config';

const statsApiRefetchIntervalSchema = yup.object<Record<StatsApiResourceNameRefetchInterval, number>>()
  .transform(replaceQuotes)
  .json()
  .shape({
    'stats:counters': yup.number().integer().positive(),
    'stats:pages_main': yup.number().integer().positive(),
  })
  .exact();

export default yup.object({
    NEXT_PUBLIC_API_PROTOCOL: yup.string().oneOf(protocols),
    NEXT_PUBLIC_API_HOST: yup.string().required(),
    NEXT_PUBLIC_API_PORT: yup.number().integer().positive(),
    NEXT_PUBLIC_API_BASE_PATH: yup.string(),
    NEXT_PUBLIC_API_WEBSOCKET_PROTOCOL: yup.string().oneOf([ 'ws', 'wss' ]),

    NEXT_PUBLIC_STATS_API_HOST: yup.string().test(urlTest),
    NEXT_PUBLIC_STATS_API_BASE_PATH: yup.string(),
    NEXT_PUBLIC_STATS_API_REFETCH_INTERVAL: yup
      .mixed()
      .test(
        'shape', 
        (ctx) => {
          try {
            statsApiRefetchIntervalSchema.validateSync(ctx.originalValue);
            throw new Error('Unknown validation error');
          } catch (error: unknown) {
            const message = getYupValidationErrorMessage(error);
            return 'Invalid schema was provided for NEXT_PUBLIC_STATS_API_REFETCH_INTERVAL' + (message ? `: ${ message }` : '');
          }
        },
        (data) => {
          const isUndefined = data === undefined;
          return isUndefined || statsApiRefetchIntervalSchema.isValidSync(data);
        })
      .when('NEXT_PUBLIC_STATS_API_HOST', {
        is: (value: string) => Boolean(value),
        then: (schema) => schema,
        otherwise: (schema) => schema.test(
          'not-exist',
          'NEXT_PUBLIC_STATS_API_REFETCH_INTERVAL can only be used with NEXT_PUBLIC_STATS_API_HOST',
          value => value === undefined,
        ),
      }),

    NEXT_PUBLIC_VISUALIZE_API_HOST: yup.string().test(urlTest),
    NEXT_PUBLIC_VISUALIZE_API_BASE_PATH: yup.string(),

    NEXT_PUBLIC_CONTRACT_INFO_API_HOST: yup.string().test(urlTest),
    NEXT_PUBLIC_CONTRACT_INFO_INSTANCE_ID: yup.string()
      .when('NEXT_PUBLIC_CONTRACT_INFO_API_HOST', {
        is: (value: string) => Boolean(value),
        then: (schema) => schema,
        otherwise: (schema) => schema.test(
          'not-exist',
          'NEXT_PUBLIC_CONTRACT_INFO_INSTANCE_ID can only be used with NEXT_PUBLIC_CONTRACT_INFO_API_HOST',
          value => value === undefined,
        ),
      }),

    NEXT_PUBLIC_ADMIN_SERVICE_API_HOST: yup.string().test(urlTest),
    NEXT_PUBLIC_ADMIN_RS_INSTANCE_ID: yup.string()
      .when('NEXT_PUBLIC_ADMIN_SERVICE_API_HOST', {
        is: (value: string) => Boolean(value),
        then: (schema) => schema,
        otherwise: (schema) => schema.test(
          'not-exist',
          'NEXT_PUBLIC_ADMIN_RS_INSTANCE_ID can only be used with NEXT_PUBLIC_ADMIN_SERVICE_API_HOST',
          value => value === undefined,
        ),
      }),

    NEXT_PUBLIC_REWARDS_SERVICE_API_HOST: yup.string().test(urlTest),

    NEXT_PUBLIC_METADATA_SERVICE_API_HOST: yup
      .string()
      .test(urlTest),
    NEXT_PUBLIC_METADATA_ADDRESS_TAGS_UPDATE_ENABLED: yup
      .boolean()
      .when('NEXT_PUBLIC_METADATA_SERVICE_API_HOST', {
        is: (value: string) => Boolean(value),
        then: (schema) => schema,
        otherwise: (schema) => schema.test(
          'not-exist',
          'NEXT_PUBLIC_METADATA_ADDRESS_TAGS_UPDATE_ENABLED cannot not be used if NEXT_PUBLIC_METADATA_SERVICE_API_HOST is not defined',
          value => value === undefined,
        ),
      }),
});