import * as yup from 'yup';
import { FLASHBLOCKS_NAMES } from 'src/features/flashblocks/types/config';
import type { FlashblocksName } from 'src/features/flashblocks/types/config';
import { urlTest } from '../../utils';

export const flashblocksSchema = yup
  .object()
  .shape({
    NEXT_PUBLIC_FLASHBLOCKS_SOCKET_URL: yup.string().test(urlTest),
    NEXT_PUBLIC_FLASHBLOCKS_NAME: yup.string<FlashblocksName>().when('NEXT_PUBLIC_FLASHBLOCKS_SOCKET_URL', {
      is: (value: string) => Boolean(value),
      then: (schema) => schema.oneOf(FLASHBLOCKS_NAMES),
      otherwise: (schema) => schema.test(
        'not-exist',
        'NEXT_PUBLIC_FLASHBLOCKS_NAME can only be used with NEXT_PUBLIC_FLASHBLOCKS_SOCKET_URL',
        value => value === undefined,
      ),
    }),
  });
