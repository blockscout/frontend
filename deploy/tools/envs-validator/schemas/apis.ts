import * as yup from 'yup';
import { protocols, urlTest } from '../utils';

export default yup.object({
    NEXT_PUBLIC_API_PROTOCOL: yup.string().oneOf(protocols),
    NEXT_PUBLIC_API_HOST: yup.string().required(),
    NEXT_PUBLIC_API_PORT: yup.number().integer().positive(),
    NEXT_PUBLIC_API_BASE_PATH: yup.string(),
    NEXT_PUBLIC_API_WEBSOCKET_PROTOCOL: yup.string().oneOf([ 'ws', 'wss' ]),

    NEXT_PUBLIC_STATS_API_HOST: yup.string().test(urlTest),
    NEXT_PUBLIC_STATS_API_BASE_PATH: yup.string(),

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